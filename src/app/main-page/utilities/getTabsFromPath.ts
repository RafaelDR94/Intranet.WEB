// utils/getTabsFromPath.ts
export const getTabsFromPath = (pathname: string): { label: string; path: string }[] => {
  const match = pathname.match(/^\/main-page\/([^\/]+)/);
  if (!match) return [];

  const section = match[1];

  const tabsMap: Record<string, { label: string; path: string }[]> = {
    home: [
      { label: 'Comunicados', path: '/main-page/home/announcements' },
      { label: 'Información Importante', path: '/main-page/home/important-information' },
    ],
    request:[
      { label: 'Facturación', path: '/main-page/request/invoices' },
    ]
    // Puedes agregar más secciones si lo deseas
  };

  return tabsMap[section] || [];
};
