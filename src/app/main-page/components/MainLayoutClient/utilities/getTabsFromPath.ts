// utils/getTabsFromPath.ts
export type Tab = { label: string; path: string };

const withInvoiceContext = (
  path: string,
  context: {
    idEmployee?: string | null;
    idRequisition?: string | null;
    requisitionCode?: string | null;
    employeeName?: string | null;
    hasNonDeductible?: boolean;
  },
): string => {
  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);

  if (context.idEmployee) params.set("idEmployee", context.idEmployee);
  if (context.idRequisition) params.set("idRequisition", context.idRequisition);
  if (context.requisitionCode) params.set("requisitionCode", context.requisitionCode);
  if (context.employeeName) params.set("employeeName", context.employeeName);
  if (context.hasNonDeductible) params.set("hasNonDeductible", "1");

  const nextQuery = params.toString();
  return nextQuery ? `${base}?${nextQuery}` : base;
};

const withProjectContext = (
  path: string,
  context: {
    id?: string | null;
    label?: string | null;
  },
): string => {
  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);

  if (context.id) params.set("id", context.id);
  if (context.label) params.set("label", context.label);

  const nextQuery = params.toString();
  return nextQuery ? `${base}?${nextQuery}` : base;
};

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
    "request/vehicleassignament": [
      {
        label: "Prestamo Vehicular",
        path: "/main-page/request/vehicleassignament",
      }
    ],
    "request/documents": [
      {
        label: "Registro de Documentos",
        path: "/main-page/request/documents/documentregistry",
      },
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
    "request/ownrequisitions": [
      {
        label: "Requisiciones",
        path: "/main-page/request/ownrequisitions/requisitions",
      },
      {
        label: "Archivos Facturables",
        path: "/main-page/request/ownrequisitions/billablefiles",
      },
            {
        label: "Subir Archivos Facturables",
        path: "/main-page/request/ownrequisitions/uploadbillablefiles",
      },
    ],
    "it/internaldevices": [
      {
        label: "Dispositivos",
        path: "/main-page/it/internaldevices/internaldeviceslist",
      },
      {
        label: "Marcas",
        path: "/main-page/it/internaldevices/devicesBrands",
      },
      {
        label: "Tipos de Dispositivos",
        path: "/main-page/it/internaldevices/devicesTypes",
      },
      {
        label: "Asignación de Dispositivos",
        path: "/main-page/it/internaldevices/internaldevicesasignation",
      },
    ],
    "it/users": [
      {
        label: "Cuentas Activadas",
        path: "/main-page/it/users/userslist",
      },
      {
        label: "Cuentas por Activar",
        path: "/main-page/it/users/userspending",
      },
    ],
    "accounting/invoices": [
      {
        label: "Validación de Facturas",
        path: "/main-page/accounting/invoices/validateinvoices",
      },
      { label: "SAT", path: "/main-page/accounting/invoices/sat" },
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
        label: "Listado de Beneficiarios",
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
    'proyects/proyects': [
      { label: 'Nuevo Proyecto', path: '/main-page/proyects/proyects/newproyect' },
      { label: 'Proyectos', path: '/main-page/proyects/proyects/proyectslist' },
      { label: 'Ubicaciones', path: '/main-page/proyects/proyects/locations' },
      { label: 'Dispositivos', path: '/main-page/proyects/proyects/devices' },
      { label: 'Refacciones', path: '/main-page/proyects/proyects/refactions' },
    ],
    'proyects/inventory': [
      { label: 'Equipos', path: '/main-page/proyects/inventory/devices' },
      { label: 'Refacciones', path: '/main-page/proyects/inventory/refactions' },
      { label: 'Ubicaciones', path: '/main-page/proyects/inventory/locations' },
      { label: 'Proveedores', path: '/main-page/proyects/inventory/providers' },

    ],
    'generalservices/vehicleregist': [
      { label: 'Registro Vehicular', path: '/main-page/generalservices/vehicleregist/vehicleregistry' },
      { label: 'Lista de Registros', path: '/main-page/generalservices/vehicleregist/vehicleregistrylist' },
    ],
    'humanresources/organizationchart': [
      { label: 'Departamentos', path: '/main-page/humanresources/organizationchart/departments' },
      { label: 'Directorio General', path: '/main-page/humanresources/organizationchart/generaldirectory' },
    ],
    organigrama: [
      { label: 'Departamentos', path: '/main-page/organigrama/departments' },
      { label: 'Directorio General', path: '/main-page/organigrama/generaldirectory' },
    ],
    'humanresources/companies': [
      { label: 'Empresas', path: '/main-page/humanresources/companies' },
    ],
    'humanresources/departments': [
      { label: 'Departamentos', path: '/main-page/humanresources/departments' },
    ],
    'humanresources/release': [
      { label: 'Comunicados', path: '/main-page/humanresources/release/pressreleases' },
      { label: 'Información Importante', path: '/main-page/humanresources/release/importantinformation' },
    ],
    'administration/usersmanagment': [
      { label: 'Crear Empleado', path: '/main-page/administration/usersmanagment/createemployee' },
      { label: 'Lista de Empleados', path: '/main-page/administration/usersmanagment/employeesList' },
    ],
    'authorizations': [
      { label: 'Lista de autorizaciones', path: '/main-page/authorizations/authorizationslist' },
    ],
    'configuration': [
      { label: 'Cuenta', path: '/main-page/configuration/account' },
      { label: 'Seguridad', path: '/main-page/configuration/security' },
      { label: 'Notificaciones', path: '/main-page/configuration/notifications' },
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
  let idRequisition: string | null = null;
  let requisitionCode: string | null = null;
  let labelparam: string | null = null;
  let requisitionsLabel: string | null = null;
  let view: string | null = null;
  let historyLabel: string | null = null;
  let authorizationDetailLabel: string | null = null;
  let authorizationId: string | null = null;
  let authorizationEventId: string | null = null;
  let authorizationKind: string | null = null;
  let employeeName: string | null = null;
  let hasNonDeductible = false;
  if (search) {
    const sp = typeof search === 'string' ? new URLSearchParams(search) : search;
    id = sp.get('id');
    idEmployee = sp.get('idEmployee');
    idRequisition = sp.get('idRequisition');
    requisitionCode = sp.get('requisitionCode');
    employeeName = sp.get('employeeName');
    labelparam = normalizePersonLabel(sp.get('label'));
    requisitionsLabel = normalizePersonLabel(sp.get('requisitionsLabel'));
    view = sp.get('view');
    historyLabel = normalizePersonLabel(sp.get('historyLabel'));
    authorizationDetailLabel = normalizePersonLabel(sp.get('authorizationDetailLabel'));
    authorizationId = sp.get('authorization_id');
    authorizationEventId = sp.get('event_id');
    authorizationKind = sp.get('kind');
    hasNonDeductible = sp.get('hasNonDeductible') === '1';
  }

  if (first === "accounting" && second === "invoices") {
    const invoiceContext = {
      idEmployee,
      idRequisition,
      requisitionCode,
      employeeName,
      hasNonDeductible,
    };
    const invoiceSubjectLabel = requisitionCode?.trim() || employeeName?.trim();
    const validateInvoicesLabel = invoiceSubjectLabel
      ? `Validaci\u00F3n de Facturas ${invoiceSubjectLabel}`
      : "Validaci\u00F3n de Facturas";
    const invoiceTabs = [
      {
        label: validateInvoicesLabel,
        path: withInvoiceContext(
          "/main-page/accounting/invoices/validateinvoices",
          invoiceContext,
        ),
      },
      ...(hasNonDeductible || third === "nondeductibles"
        ? [
            {
              label: "No deducibles",
              path: withInvoiceContext(
                "/main-page/accounting/invoices/nondeductibles",
                { ...invoiceContext, hasNonDeductible: true },
              ),
            },
          ]
        : []),
      {
        label: "SAT",
        path: withInvoiceContext(
          "/main-page/accounting/invoices/sat",
          invoiceContext,
        ),
      },
    ];

    tabs = invoiceTabs;
  }

  const internalDevicesListPath = '/main-page/it/internaldevices/internaldeviceslist';
  const internalDevicesAssignPath = '/main-page/it/internaldevices/internaldevicesasignation';

  if (first === 'it' && second === 'internaldevices') {
    if (pathname === internalDevicesListPath) {
      if (view === 'new') {
        return [
          { label: 'Dispositivos', path: internalDevicesListPath },
          { label: 'Nuevo Dispositivo', path: `${internalDevicesListPath}?view=new` },
        ];
      }
      if (view === 'edit' && id) {
        return [
          { label: 'Dispositivos', path: internalDevicesListPath },
          { label: 'Editar dispositivo', path: `${internalDevicesListPath}?id=${id}&view=edit` },
        ];
      }
      if (view === 'review' && id) {
        return [
          { label: 'Dispositivos', path: internalDevicesListPath },
          { label: 'Revision de Dispositivo', path: `${internalDevicesListPath}?id=${id}&view=review` },
        ];
      }

      if (id) {
        tabs = tabs.map((tab) =>
          tab.path === internalDevicesListPath
            ? { ...tab, path: `${internalDevicesListPath}?id=${id}` }
            : tab
        );
      }
    }

    if (pathname === internalDevicesAssignPath && view === 'new') {
      return [
        { label: 'Dispositivos', path: internalDevicesListPath },
        { label: 'Asignación de Dispositivos', path: internalDevicesAssignPath },
        { label: 'Nueva Asignación', path: `${internalDevicesAssignPath}?view=new` },
      ];
    }
  }

  // agrega la Tab de detalle solo si estás en accounting/requisitions y hay id
  if (first === 'accounting' && second === 'requisitions' && third == 'requisitionsList' && id && !idRequisition && !labelparam?.toLowerCase().startsWith('requisiciones')) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const qs = new URLSearchParams();
    qs.set('id', id);
    if (labelparam) qs.set('label', labelparam);
    const detailPath = `${clean}?${qs.toString()}`;
    if (!tabs.some(t => t.label === 'Detalle de Requisición')) {
      tabs = [...tabs, { label: labelparam || 'Detalle de Requisición', path: detailPath }];
    }
  }

  if (first === 'accounting' && second === 'requisitions' && third == 'requisitionsList') {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const employeeIdForContext = idEmployee ?? id;
    const requisitionIdForContext = idRequisition ?? (view === 'detail' ? id : null);
    const requisitionsTabLabel =
      requisitionsLabel ||
      (labelparam?.toLowerCase().startsWith('requisiciones') ? labelparam : null);

    if (requisitionsTabLabel && employeeIdForContext) {
      const requisitionsQs = new URLSearchParams();
      requisitionsQs.set('id', employeeIdForContext);
      requisitionsQs.set('label', requisitionsTabLabel);
      requisitionsQs.set('requisitionsLabel', requisitionsTabLabel);
      if (idEmployee) requisitionsQs.set('idEmployee', idEmployee);
      const requisitionsPath = `${clean}?${requisitionsQs.toString()}`;

      if (!tabs.some(t => t.path === requisitionsPath || t.label === requisitionsTabLabel)) {
        tabs = [...tabs, { label: requisitionsTabLabel, path: requisitionsPath }];
      }
    }

    if (requisitionIdForContext) {
      const detailLabel = labelparam || 'Detalle Requisició³n';
      const detailQs = new URLSearchParams();
      if (employeeIdForContext) {
        detailQs.set('id', employeeIdForContext);
      } else {
        detailQs.set('id', requisitionIdForContext);
      }
      detailQs.set('idRequisition', requisitionIdForContext);
      detailQs.set('view', 'detail');
      detailQs.set('label', detailLabel);
      if (idEmployee) detailQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) detailQs.set('requisitionsLabel', requisitionsLabel);
      const detailPath = `${clean}?${detailQs.toString()}`;

      if (!tabs.some(t => t.path === detailPath || t.label === detailLabel)) {
        tabs = [...tabs, { label: detailLabel, path: detailPath }];
      }
    }
  }

  // agrega la Tab de detalle para requisiciones personales en request/ownrequisitions
  if (first === 'request' && second === 'ownrequisitions' && third === 'requisitions' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const qs = new URLSearchParams();
    qs.set('id', id);
    if (labelparam) qs.set('label', labelparam);
    const detailLabel = labelparam || 'Detalle Requisición';
    const detailPath = `${clean}?${qs.toString()}`;

    if (!tabs.some(t => t.path === detailPath || t.label === detailLabel)) {
      tabs = [...tabs, { label: detailLabel, path: detailPath }];
    }

    if (view === 'billablefiles') {
      const billableQs = new URLSearchParams(qs);
      billableQs.set('view', 'billablefiles');
      const billablePath = `${clean}?${billableQs.toString()}`;

      if (!tabs.some((t) => t.path === billablePath || t.label === 'Archivos Facturables')) {
        tabs = [...tabs, { label: 'Archivos Facturables', path: billablePath }];
      }
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
    const employeeIdForContext = idEmployee ?? id;
    const requisitionIdForContext =
      idRequisition ??
      (idEmployee && id && id !== idEmployee ? id : null) ??
      (!idEmployee && !idRequisition && (view === 'detail' || view === 'history' || view === 'billablefiles')
        ? id
        : null);
    const requisitionsTabLabel = requisitionsLabel ||
      (labelparam && (labelparam.toLowerCase().startsWith('requisiciones') || labelparam.toLowerCase().startsWith('archivos'))
        ? labelparam
        : null);

    if (requisitionsTabLabel && employeeIdForContext) {
      const requisitionsQs = new URLSearchParams();
      requisitionsQs.set('id', employeeIdForContext);
      requisitionsQs.set('label', requisitionsTabLabel);
      if (idEmployee) requisitionsQs.set('idEmployee', idEmployee);
      requisitionsQs.set('requisitionsLabel', requisitionsTabLabel);
      const requisitionsPath = `${clean}?${requisitionsQs.toString()}`;

      if (!tabs.some(t => t.path === requisitionsPath || t.label === requisitionsTabLabel)) {
        tabs = [...tabs, { label: requisitionsTabLabel, path: requisitionsPath }];
      }
    }

    const shouldAddDetail =
      view === 'detail' ||
      view === 'history' ||
      view === 'authorizationDetail' ||
      labelparam?.toLowerCase().startsWith('detalle') ||
      (!labelparam && Boolean(id));

    if (shouldAddDetail && requisitionIdForContext) {
      const detailLabel = labelparam || 'Detalle Requisición';
      const detailQs = new URLSearchParams();
      if (employeeIdForContext) {
        detailQs.set('id', employeeIdForContext);
      } else {
        detailQs.set('id', requisitionIdForContext);
      }
      detailQs.set('idRequisition', requisitionIdForContext);
      detailQs.set('label', detailLabel);
      detailQs.set('view', 'detail');
      if (idEmployee) detailQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) detailQs.set('requisitionsLabel', requisitionsLabel);
      const detailPath = `${clean}?${detailQs.toString()}`;

      if (!tabs.some(t => t.path === detailPath || t.label === detailLabel)) {
        tabs = [...tabs, { label: detailLabel, path: detailPath }];
      }
    }

    if (view === 'billablefiles' && requisitionIdForContext) {
      const billableLabel = 'Subir una Factura';
      const billableQs = new URLSearchParams();
      if (employeeIdForContext) {
        billableQs.set('id', employeeIdForContext);
      } else {
        billableQs.set('id', requisitionIdForContext);
      }
      billableQs.set('idRequisition', requisitionIdForContext);
      if (labelparam) billableQs.set('label', labelparam);
      billableQs.set('view', view);
      billableQs.set('uploadSection', 'invoice');
      if (idEmployee) billableQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) billableQs.set('requisitionsLabel', requisitionsLabel);
      const billablePath = `${clean}?${billableQs.toString()}`;

      if (!tabs.some(t => t.path === billablePath || t.label === billableLabel)) {
        tabs = [...tabs, { label: billableLabel, path: billablePath }];
      }
    }

    if (view === 'history' && requisitionIdForContext) {
      const historyTabLabel = historyLabel || 'Historial Aprobaciones';
      const historyQs = new URLSearchParams();
      if (employeeIdForContext) {
        historyQs.set('id', employeeIdForContext);
      } else {
        historyQs.set('id', requisitionIdForContext);
      }
      historyQs.set('idRequisition', requisitionIdForContext);
      if (labelparam) historyQs.set('label', labelparam);
      historyQs.set('view', view);
      historyQs.set('historyLabel', historyTabLabel);
      if (idEmployee) historyQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) historyQs.set('requisitionsLabel', requisitionsLabel);
      const historyPath = `${clean}?${historyQs.toString()}`;

      if (!tabs.some(t => t.path === historyPath || t.label === historyTabLabel)) {
        tabs = [...tabs, { label: historyTabLabel, path: historyPath }];
      }
    }

    if (view === 'authorizationDetail' && authorizationId) {
      const detailTabLabel = authorizationDetailLabel || 'Detalle';
      const detailQs = new URLSearchParams();
      if (employeeIdForContext) {
        detailQs.set('id', employeeIdForContext);
      } else if (requisitionIdForContext) {
        detailQs.set('id', requisitionIdForContext);
      }
      if (requisitionIdForContext) {
        detailQs.set('idRequisition', requisitionIdForContext);
      }
      if (labelparam) detailQs.set('label', labelparam);
      detailQs.set('view', view);
      detailQs.set('authorization_id', authorizationId);
      if (authorizationEventId) detailQs.set('event_id', authorizationEventId);
      detailQs.set('authorizationDetailLabel', detailTabLabel);
      if (idEmployee) detailQs.set('idEmployee', idEmployee);
      if (requisitionsLabel) detailQs.set('requisitionsLabel', requisitionsLabel);
      const detailPath = `${clean}?${detailQs.toString()}`;

      if (!tabs.some(t => t.path === detailPath || t.label === detailTabLabel)) {
        tabs = [...tabs, { label: detailTabLabel, path: detailPath }];
      }
    }
  }

  if (first === 'authorizations' && second === 'authorizationslist') {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const resolvedAuthorizationId = authorizationId || id;
    const detailLabel =
      labelparam || (authorizationKind ? `Solicitud de ${authorizationKind}` : 'Solicitud de autorización');

    if (resolvedAuthorizationId) {
      const detailQs = new URLSearchParams();
      detailQs.set('id', resolvedAuthorizationId);
      detailQs.set('authorization_id', resolvedAuthorizationId);
      if (authorizationEventId) detailQs.set('event_id', authorizationEventId);
      if (authorizationKind) detailQs.set('kind', authorizationKind);
      if (detailLabel) detailQs.set('label', detailLabel);

      const detailPath = `${clean}?${detailQs.toString()}`;

      if (!tabs.some((tab) => tab.path === detailPath)) {
        tabs = [...tabs, { label: detailLabel, path: detailPath }];
      }
    }
  }

  if (first === 'humanresources' && second === 'companies') {
    if (view === 'new') {
      tabs = [
        { label: 'Empresas', path: '/main-page/humanresources/companies' },
        { label: 'Nueva empresa', path: '/main-page/humanresources/companies?view=new' },
      ];
    }
    if (view === 'edit' && id) {
      tabs = [
        { label: 'Empresas', path: '/main-page/humanresources/companies' },
        { label: 'Editar empresa', path: `/main-page/humanresources/companies?view=edit&id=${id}` },
      ];
    }
  }

  if (first === 'humanresources' && second === 'departments') {
    if (view === 'new') {
      tabs = [
        { label: 'Departamentos', path: '/main-page/humanresources/departments' },
        { label: 'Nuevo departamento', path: '/main-page/humanresources/departments?view=new' },
      ];
    }
    if (view === 'edit' && id) {
      const departmentLabel = labelparam || 'Departamento';
      const detailQs = new URLSearchParams();
      detailQs.set('view', 'edit');
      detailQs.set('id', id);
      if (departmentLabel) detailQs.set('label', departmentLabel);

      tabs = [
        { label: 'Departamentos', path: '/main-page/humanresources/departments' },
        {
          label: departmentLabel,
          path: `/main-page/humanresources/departments?${detailQs.toString()}`,
        },
      ];
    }
  }


  if (first === 'humanresources' && second === 'organizationchart' && third === 'departments') {
    if (view === 'detail' && id) {
      const departmentLabel = labelparam || 'Departamento';
      const detailQs = new URLSearchParams();
      detailQs.set('view', 'detail');
      detailQs.set('id', id);
      if (departmentLabel) detailQs.set('label', departmentLabel);

      tabs = [
        { label: 'Departamentos', path: '/main-page/humanresources/organizationchart/departments' },
        {
          label: departmentLabel,
          path: `/main-page/humanresources/organizationchart/departments?${detailQs.toString()}`,
        },
      ];
    }
  }

  if (first === 'organigrama' && second === 'departments') {
    if (view === 'detail' && id) {
      const departmentLabel = labelparam || 'Departamento';
      const detailQs = new URLSearchParams();
      detailQs.set('view', 'detail');
      detailQs.set('id', id);
      if (departmentLabel) detailQs.set('label', departmentLabel);

      tabs = [
        { label: 'Departamentos', path: '/main-page/organigrama/departments' },
        {
          label: departmentLabel,
          path: `/main-page/organigrama/departments?${detailQs.toString()}`,
        },
      ];
    }
  }

  if (first === 'proyects' && second === 'proyects') {
    const isNewProjectView = third === 'newproyect';
    const baseProjectTabs: Tab[] = isNewProjectView
      ? [
          { label: 'Proyectos', path: '/main-page/proyects/proyects/proyectslist' },
          { label: 'Nuevo Proyecto', path: '/main-page/proyects/proyects/newproyect' },
        ]
      : [{ label: 'Proyectos', path: '/main-page/proyects/proyects/proyectslist' }];
    const hasProjectContext = Boolean(id && labelparam);

    if (!hasProjectContext) {
      tabs = baseProjectTabs;
    } else {
      const projectContext = { id, label: labelparam };
      const detailPath = withProjectContext(
        '/main-page/proyects/proyects/proyectslist',
        projectContext,
      );
      const contextualTabs: Tab[] = [
        { label: 'Ubicaciones', path: '/main-page/proyects/proyects/locations' },
        { label: 'Dispositivos', path: '/main-page/proyects/proyects/devices' },
        { label: 'Refacciones', path: '/main-page/proyects/proyects/refactions' },
      ].map((tab) => ({
        ...tab,
        path: withProjectContext(tab.path, projectContext),
      }));

      tabs = [
        ...baseProjectTabs,
        { label: labelparam ?? 'Proyecto', path: detailPath },
        ...contextualTabs,
      ];
    }
  }

  if (first === 'proyects' && second === 'inventory' && id) {
    const projectContext = { id, label: labelparam };
    tabs = tabs.map((tab) => ({
      ...tab,
      path: withProjectContext(tab.path, projectContext),
    }));
  }

  if (first === 'it' && second === 'users' && third === 'userspending' && id) {
    const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const activationLabel = labelparam || 'Activar Empleado';
    const activationQs = new URLSearchParams();
    activationQs.set('id', id);
    activationQs.set('label', activationLabel);
    const activationPath = `${clean}?${activationQs.toString()}`;

    if (!tabs.some((tab) => tab.path === activationPath || tab.label === activationLabel)) {
      tabs = [...tabs, { label: activationLabel, path: activationPath }];
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

  if (first === 'configuration' && second === 'devices') {
    const devicesTab = { label: 'Dispositivos', path: '/main-page/configuration/devices' };
    if (!tabs.some((tab) => tab.path === devicesTab.path)) {
      tabs = [...tabs, devicesTab];
    }
  }

  return tabs;
};
