// utils/getTabsFromPath.ts
export const getTabsFromPath = (pathname: string): { label: string; path: string }[] => {
  // Divide la ruta en segmentos no vacíos
  const segments = pathname.split('/').filter(Boolean);
  // segments[0] === 'main-page'; si no coincide, no hay pestañas
  if (segments[0] !== 'main-page') return [];

  const first  = segments[1];        // e.g. 'home' o 'accounting'
  const second = segments[2];        // e.g. 'announcements' o 'invoices'
  // Si hay segundo segmento, prueba con "first/second", si no, solo "first"
  const key = second ? `${first}/${second}` : first;

  // Mapa existente de pestañas
  const tabsMap: Record<string, { label: string; path: string }[]> = {
    home: [
      { label: 'Comunicados', path: '/main-page/home/announcements' },
      { label: 'Información Importante', path: '/main-page/home/important-information' },
    ],
    request: [
      { label: 'Facturación', path: '/main-page/request/invoices' },
    ],
    'accounting/invoices': [
      { label: 'Subir Archivos', path: '/main-page/accounting/invoices/addFiles' },
      { label: 'Validación de Facturas', path: '/main-page/accounting/invoices/validateinvoices' },
      { label: 'SAT', path: '/main-page/accounting/invoices/sat' },
    ],
    // …otros mapeos
  };

  // Primero intenta con la clave de dos segmentos, sino con la de uno
  return tabsMap[key] || tabsMap[first] || [];
};
