import path from "path";

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
    "operations/requisitions": [
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      }
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
    "accounting/billablefiles": [
      {
        label: "Carga de Archivos Facturables",
        path: "/main-page/accounting/billablefiles/billablefiles",
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

  const normalizePersonLabel = (label?: string | null) => {
    if (!label) return null;
    const trimmed = label.trim();
    const lower = trimmed.toLowerCase();
    const prefixed =
      lower.startsWith('archivos ') || lower.startsWith('requisiciones ') || lower.startsWith('detalle ');
    if (!prefixed) return trimmed;
    const parts = trimmed.split(/\s+/);
    if (parts.length <= 1) return trimmed;
    return `${parts[0]} ${parts[1]}`;
  };

  let id: string | null = null;
  let idEmployee: string | null = null;
  let labelparam: string | null = null;
  let requisitionsLabel: string | null = null;
  let view: string | null = null;
  if (search) {
    const sp = typeof search === 'string' ? new URLSearchParams(search) : search;
    id = sp.get('id');
    idEmployee = sp.get('idEmployee');
    labelparam = normalizePersonLabel(sp.get('label'));
    requisitionsLabel = normalizePersonLabel(sp.get('requisitionsLabel'));
    view = sp.get('view');
  }

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'requisitions' && third == 'requisitionsList' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const qs = new URLSearchParams();
    qs.set('id', id);
    if (labelparam) qs.set('label', labelparam);
    const detailPath = `${clean}?${qs.toString()}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: labelparam || 'Detalle de Requisición', path: detailPath }];
    }
  }

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'personalInvoices' && third == 'requisitions' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const qs = new URLSearchParams();
    qs.set('id', id);
    if (labelparam) qs.set('label', labelparam);
    const detailPath = `${clean}?${qs.toString()}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: labelparam || 'Detalle de Requisición', path: detailPath }];
    }

    if (view === 'billablefiles') {
      const billableQs = new URLSearchParams(qs);
      billableQs.set('view', view);
      const billablePath = `${clean}?${billableQs.toString()}`;
      if (!tabs.some(t => t.path === billablePath || t.label === 'Carga de Archivos Facturables')) {
        tabs = [...tabs, { label: 'Carga de Archivos Facturables', path: billablePath }];
      }
    }
  }

  if (first === 'accounting' && second === 'billablefiles' && third == 'billablefiles' && id) {
    const detailQs = new URLSearchParams();
    detailQs.set('id', id);
    if (labelparam) detailQs.set('label', labelparam);
    const detailLabel = labelparam || 'Detalle Requisición';
    const detailPath = `/main-page/accounting/personalInvoices/requisitions?${detailQs.toString()}`;

    if (!tabs.some(t => t.path === detailPath || t.label === detailLabel)) {
      tabs = [...tabs, { label: detailLabel, path: detailPath }];
    }
  }

  // agrega tabs dinámicos para la lista de requisiciones de operaciones
  if (first === 'operations' && second === 'requisitions' && third == 'requisitionListPage') {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const requisitionsTabLabel = requisitionsLabel ||
      (labelparam && (labelparam.toLowerCase().startsWith('requisiciones') || labelparam.toLowerCase().startsWith('archivos'))
        ? labelparam
        : null);

    if (requisitionsTabLabel && (id || idEmployee)) {
      const requisitionsQs = new URLSearchParams();
      const requisitionsId = idEmployee || id;
      if (requisitionsId) requisitionsQs.set('id', requisitionsId);
      requisitionsQs.set('label', requisitionsTabLabel);
      if (idEmployee) requisitionsQs.set('idEmployee', idEmployee);
      requisitionsQs.set('requisitionsLabel', requisitionsTabLabel);
      const requisitionsPath = `${clean}?${requisitionsQs.toString()}`;

      if (!tabs.some(t => t.path === requisitionsPath || t.label === requisitionsTabLabel)) {
        tabs = [...tabs, { label: requisitionsTabLabel, path: requisitionsPath }];
      }
    }

    const shouldAddDetail = view === 'detail' || labelparam?.toLowerCase().startsWith('detalle') || (!labelparam && Boolean(id));

    if (shouldAddDetail && id) {
      const detailLabel = labelparam || 'Detalle Requisición';
      const detailQs = new URLSearchParams();
      detailQs.set('id', id);
      detailQs.set('label', detailLabel);
      detailQs.set('view', 'detail');
      if (idEmployee) detailQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) detailQs.set('requisitionsLabel', requisitionsLabel);
      const detailPath = `${clean}?${detailQs.toString()}`;

      if (!tabs.some(t => t.path === detailPath || t.label === detailLabel)) {
        tabs = [...tabs, { label: detailLabel, path: detailPath }];
      }
    }

    if (view === 'billablefiles' && id) {
      const billableLabel = 'Subir Facturas';
      const billableQs = new URLSearchParams();
      billableQs.set('id', id);
      if (labelparam) billableQs.set('label', labelparam);
      billableQs.set('view', view);
      if (idEmployee) billableQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) billableQs.set('requisitionsLabel', requisitionsLabel);
      const billablePath = `${clean}?${billableQs.toString()}`;

      if (!tabs.some(t => t.path === billablePath || t.label === billableLabel)) {
        tabs = [...tabs, { label: billableLabel, path: billablePath }];
      }
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
