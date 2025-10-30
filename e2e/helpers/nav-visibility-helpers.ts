// utils/navVisibility.ts
import { expect, Page } from '@playwright/test';

export type SidebarRouteCore = {
  label: string;
  path: string;
  subroutes?: { label: string; path: string }[];
};

export const sidebarRoutesCore: SidebarRouteCore[] = [
  { label: 'Inicio', path: '/main-page/home' },
  {
    label: 'Solicitudes',
    path: '/main-page/request',
    subroutes: [{ label: 'Facturación', path: '/main-page/request/invoices' }],
  },
  {
    label: 'Contabilidad',
    path: '/main-page/accounting',
    subroutes: [
      { label: 'Facturación', path: '/main-page/accounting/invoices' },
      { label: 'Facturación personal', path: '/main-page/accounting/personalInvoices' },
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions' },
    ],
  },
];

type TabsMap = Record<string, { label: string; path: string }[]>;

const normalizeRoute = (route: string) => {
  if (!route) return route;
  try {
    const u = new URL(route, 'http://localhost');
    route = u.pathname;
  } catch {
    route = route.split('#')[0].split('?')[0];
  }
  if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
  return route;
};

const hasAccess = (path: string, permissions: any) => {
  const cleanPath = path.replace(/\/\*$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  let currentLevel = permissions;

  for (const segment of segments) {
    if (currentLevel[segment]) {
      currentLevel = currentLevel[segment];
      if (!currentLevel.Acces) return false;
    } else {
      return false;
    }
  }
  return currentLevel.Acces !== false;
};

export function parsePermissions(treeFirebase: unknown) {
  if (!treeFirebase) return null;
  if (typeof treeFirebase === 'string') return JSON.parse(treeFirebase);
  if (typeof treeFirebase === 'object') return treeFirebase as any;
  return null;
}

export async function isMobileViewport(page: Page) {
  const size = page.viewportSize();
  return !!size && size.width < 1024; // <lg
}

export function getTabsFromPathLikeYourApp(
  pathname: string,
  search?: string | URLSearchParams
): { label: string; path: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'main-page') return [];
  const [, first, second, third] = segments;
  const key = second ? `${first}/${second}` : first;

  const tabsMap: TabsMap = {
    home: [
      { label: 'Comunicados', path: '/main-page/home/announcements' },
      { label: 'Información Importante', path: '/main-page/home/important-information' },
    ],
    request: [{ label: 'Facturación', path: '/main-page/request/invoices' }],
    'accounting/invoices': [
      { label: 'Subir Archivos', path: '/main-page/accounting/invoices/addFiles' },
      { label: 'Validación de Facturas', path: '/main-page/accounting/invoices/validateinvoices' },
      { label: 'SAT', path: '/main-page/accounting/invoices/sat' },
    ],
    'accounting/personalInvoices': [
      { label: 'Facturas', path: '/main-page/accounting/personalInvoices/invoices' },
      { label: 'Historial', path: '/main-page/accounting/personalInvoices/history' },
    ],
    'accounting/requisitions': [
      { label: 'Requisiciones', path: '/main-page/accounting/requisitions/requisitions' },
      { label: 'Listado de Requisiciones', path: '/main-page/accounting/requisitions/requisitionsList' },
    ],
  };

  let tabs = tabsMap[key] || tabsMap[first] || [];

  let id: string | null = null;
  if (search) {
    const sp = typeof search === 'string' ? new URLSearchParams(search) : search;
    id = sp.get('id');
  }

  if (first === 'accounting' && second === 'requisitions' && third === 'requisitionsList' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const detailPath = `${clean}?id=${id}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: 'Detalle de Requisición', path: detailPath }];
    }
  }
  return tabs;
}

/** Abre el menú lateral móvil si aplica */
async function ensureSidebarOpenIfMobile(page: Page) {
  if (await isMobileViewport(page)) {
    const openBtn = page.getByTestId('open-mobile-menu');
    if (await openBtn.isVisible()) {
      await openBtn.click();
      const drawer = page.getByTestId('mobile-sidebar');
      await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    }
  }
}

/** Valida tabs visibles/ocultas según permisos */
export async function expectTabsByPermissions(page: Page, permissions: any) {
  const url = new URL(page.url());
  const tabs = getTabsFromPathLikeYourApp(url.pathname, url.search);
  const allowed = tabs.filter(t => hasAccess(normalizeRoute(t.path), permissions));

  // Si no hay tabs permitidas, el contenedor podría no existir
  if (allowed.length === 0) {
    await expect(page.getByTestId('main-tabs')).toBeVisible(); // tu topbar móvil lo muestra igual
    return;
  }

  await expect(page.getByTestId('main-tabs')).toBeVisible();
  for (const tab of allowed) {
    await expect(page.getByTestId(`tab:${tab.path}`)).toBeVisible();
  }
}

/** Valida sidebar (top-level y subrutas) según permisos */
export async function expectSidebarByPermissions(
  page: Page,
  permissions: any,
  mobile: boolean = false
) {
  await ensureSidebarOpenIfMobile(page);

  // Top-level visible si él mismo es accesible o alguna subruta lo es
  const visibleTop = sidebarRoutesCore.filter(r => {
    if (!r.subroutes) return hasAccess(normalizeRoute(r.path), permissions);
    return r.subroutes.some(s => hasAccess(normalizeRoute(s.path), permissions));
  });

  // Top-level
  for (const r of visibleTop) {
    await expect(page.getByTestId(mobile ? `mobile:${r.path}` : `side:${r.path}`)).toBeVisible();
  }

  // Subrutas: expandimos secciones con subroutes y comprobamos solo las permitidas
  for (const r of sidebarRoutesCore) {
    if (r.subroutes?.length) {
      const host = page.locator(mobile ? `[data-testid="mobile:${r.path}"]` : `[data-testid="side:${r.path}"]`);
      if (await host.isVisible()) {
        // El botón para expandir está dentro de ese contenedor
        await host.locator('button').first().click();
        for (const s of r.subroutes) {
          const can = hasAccess(normalizeRoute(s.path), permissions);
          const loc = page.getByTestId(mobile ? `mobile:${s.path}` : `side:${s.path}`);
          if (can) {
            await expect(loc).toBeVisible();
          } else {
            await expect(loc).toHaveCount(0);
          }
        }
      }
    }
  }
}
