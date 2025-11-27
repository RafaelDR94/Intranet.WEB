// utils/getTabsFromPath.ts
export type Tab = { label: string; path: string };

export const getTabsFromPath = (
  pathname: string,
  search?: string | URLSearchParams,
): Tab[] => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "main-page") return [];

  const [, first, second, third] = segments; // main-page, first, second, third, fourth
  const key = second ? `${first}/${second}` : first; // <- ojo: usar template string

  const tabsMap: Record<string, Tab[]> = {
    home: [
      { label: "Comunicados", path: "/main-page/home/announcements" },
      {
        label: "Información Importante",
        path: "/main-page/home/important-information",
      },
    ],
    "treasury/treasurypettycash": [
      {
        label: "Control",
        path: "/main-page/treasury/treasurypettycash/treasurycontrol",
      },
      {
        label: "Solicitud",
        path: "/main-page/treasury/treasurypettycash/treasuryrequest",
      }
    ],
    "request/pettycash": [
      {
        label: "Solicitud Caja Chica",
        path: "/main-page/request/pettycash/pettycashrequest",
      },
      {
        label: "Historial",
        path: "/main-page/request/pettycash/pettycashhistory",
      }
    ],
    "request/documents": [
      {
        label: "Documentos Gerenciales",
        path: "/main-page/request/documents/managementdocuments",
      },
      {
        label: "Documentos Operativos",
        path: "/main-page/request/documents/operationaldocuments",
      }
    ],
    "request/acces": [
      {
        label: "Generación de accesos",
        path: "/main-page/request/acces/generateacces",
      },
      {
        label: "Historial de accesos",
        path: "/main-page/request/acces/acceshistory",
      },
      {
        label: "Registro de proveedores",
        path: "/main-page/request/acces/registerenterprise",
      }
    ],
    "accounting/invoices": [
      {
        label: "Subir Archivos",
        path: "/main-page/accounting/invoices/addFiles",
      },
      {
        label: "Validación de Facturas",
        path: "/main-page/accounting/invoices/validateinvoices",
      },
      { label: "SAT", path: "/main-page/accounting/invoices/sat" },
    ],
    "accounting/personalInvoices": [
      // {
      //   label: "Facturas",
      //   path: "/main-page/accounting/personalInvoices/invoices",
      // },
      // {
      //   label: "Historial",
      //   path: "/main-page/accounting/personalInvoices/history",
      // },
      {
        label: "Requisiciones",
        path: "/main-page/accounting/personalInvoices/requisitions",
      },
    ],
    "accounting/requisitions": [
      {
        label: "Requisiciones",
        path: "/main-page/accounting/requisitions/requisitions",
      },
      {
        label: "Listado de Requisiciones",
        path: "/main-page/accounting/requisitions/requisitionsList",
      },
    ],
    "accounting/sap": [
      {
        label: "Administración",
        path: "/main-page/accounting/sap/administration",
      },
      {
        label: "Operaciones",
        path: "/main-page/accounting/sap/operations",
      },
    ],
    'sip/proyects': [
      { label: 'Nuevo Proyecto', path: '/main-page/sip/proyects/newproyect' },
      { label: 'Proyectos', path: '/main-page/sip/proyects/proyectslist' },
    ],
    'generalservices/vehicleregist': [
      { label: 'Registro Vehicular', path: '/main-page/generalservices/vehicleregist/vehicleregistry' },
      { label: 'Lista de Registros', path: '/main-page/generalservices/vehicleregist/vehicleregistrylist' },
    ],
    'humanresources/documents': [
      { label: 'Registro de Documentos', path: '/main-page/humanresources/documents/documentregistry' },
      { label: 'Documentos Gerenciales', path: '/main-page/humanresources/documents/managementdocuments' },
      { label: 'Documentos Operativos', path: '/main-page/humanresources/documents/operationaldocuments' },
    ],
    'administration/usersmanagment': [
      { label: 'Crear Empleado', path: '/main-page/administration/usersmanagment/createemployee' },
      { label: 'Lista de Empleados', path: '/main-page/administration/usersmanagment/employeesList' },
    ],

    'configuration': [
      { label: 'Configuración', path: '/main-page/configuration/userconfiguration' },
    ],
  };

  let tabs = tabsMap[key] || tabsMap[first] || [];

  let id: string | null = null;
  let idEmployee: string | null = null;
  let labelparam: string | null = null;
  if (search) {
    const sp = typeof search === 'string' ? new URLSearchParams(search) : search;
    id = sp.get('id');
    idEmployee = sp.get('idEmployee');
    labelparam = sp.get('label');
  }

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'requisitions' && third == 'requisitionsList' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const detailPath = `${clean}?id=${id}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: labelparam || 'Detalle de Requisición', path: detailPath }];
    }
  }

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'personalInvoices' && third == 'requisitions' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const detailPath = `${clean}?id=${id}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: labelparam || 'Detalle de Requisición', path: detailPath }];
    }
  }

  // SIP/Proyectos: agrega tab dinámica para edición si viene un id
  if (first === 'sip' && second === 'proyects' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const detailPath = labelparam ? `${clean}?id=${id}&label=${labelparam}` : `${clean}?id=${id}`;

    if (!tabs.some(t => t.label === 'Editar Proyecto')) {
      tabs = [...tabs, { label: labelparam || 'Editar Proyecto', path: detailPath }];
    }
  }

  if (first === 'administration' && second === 'usersmanagment' && third == 'createemployee' && idEmployee) {
    tabs = tabs.map(tab => {
      if (
        tab.path === '/main-page/administration/usersmanagment/createemployee' &&
        (tab.label === 'Crear Usuario' || tab.label === 'Crear Empleado')
      ) {
        return { ...tab, label: labelparam || 'Editar Usuario' };
      }
      return tab;
    });
  }

  return tabs;
};
