// utils/getTabsFromPath.ts
export type Tab = { label: string; path: string };

export const getTabsFromPath = (
  pathname: string,
  search?: string | URLSearchParams
): Tab[] => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'main-page') return [];

  const [, first, second, third] = segments; // main-page, first, second, third, fourth
  const key = second ? `${first}/${second}` : first; // <- ojo: usar template string

  const tabsMap: Record<string, Tab[]> = {
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

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'requisitions' && third =='requisitionsList'&& id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const detailPath = `${clean}?id=${id}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: 'Detalle de Requisición', path: detailPath }];
    }
  }


  return tabs;
};
