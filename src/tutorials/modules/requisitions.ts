import type { TutorialDefinition } from '../types';

export const requisitionsTutorials: TutorialDefinition[] = [
  {
    id: 'operations-requisitions:form',
    moduleId: 'operations-requisitions-form',
    title: 'Crear requisiciones',
    description: 'Conoce las secciones principales para capturar requisiciones.',
    version: 1,
    steps: [
      {
        target: '[data-tour="requisitions-excel-loader"]',
        title: 'Carga masiva',
        description: 'Sube un Excel para registrar varias requisiciones de una sola vez.',
      },
      {
        target: '[data-tour="requisitions-upload-submit"]',
        title: 'Subir archivo',
        description: 'Usa este boton para procesar el archivo seleccionado.',
      },
      {
        target: '[data-tour="requisitions-form"]',
        title: 'Formulario de requisicion',
        description: 'Completa los datos necesarios para crear una requisicion individual.',
      },
      {
        target: '[data-tour="requisitions-form-submit"]',
        title: 'Guardar requisicion',
        description: 'Guarda la informacion para enviar tu solicitud.',
      },
    ],
  },
  {
    id: 'operations-requisitions:list',
    moduleId: 'operations-requisitions-list',
    title: 'Listado de requisiciones',
    description: 'Aprende a buscar, filtrar y administrar requisiciones.',
    version: 1,
    steps: [
      {
        target: '[data-tour="requisitions-table"]',
        title: 'Listado principal',
        description: 'Aqui se muestran todas las requisiciones registradas.',
      },
      {
        target: '[data-tour="requisitions-search"]',
        title: 'Busqueda rapida',
        description: 'Filtra por nombre, codigo o proyecto desde la barra de busqueda.',
      },
      {
        target: '[data-tour="requisitions-calendar"]',
        title: 'Rango de fechas',
        description: 'Usa el calendario para filtrar por fechas de creacion.',
      },
      {
        target: '[data-tour="requisitions-refresh"]',
        title: 'Actualizar',
        description: 'Recarga el listado cuando necesites informacion actualizada.',
      },
      {
        target: '[data-tour="requisitions-add"]',
        title: 'Nueva requisicion',
        description: 'Crea una nueva requisicion desde este boton.',
      },
      {
        target: '[data-tour="requisitions-view-files"]',
        title: 'Ver archivos',
        description: 'Accede a los archivos adjuntos de una requisicion.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="requisitions-view-requisitions"]',
        title: 'Ver requisiciones',
        description: 'Consulta el detalle de requisiciones por colaborador.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="requisitions-row-actions"]',
        title: 'Acciones rapidas',
        description: 'Edita o elimina una requisicion desde este menu.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="requisitions-row-actions"]',
        title: 'Menu de acciones',
        description:
          'En mobile, abre este menu para ver Requisiciones y Archivos.',
        onlyMobile: true,
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-view-files"]',
        title: 'Ver archivos',
        description: 'Desde aqui puedes ver los archivos del beneficiario.',
        onlyMobile: true,
      },
      {
        target: '[data-tour="requisitions-view-requisitions"]',
        title: 'Ver requisiciones',
        description: 'Desde aqui puedes consultar sus requisiciones.',
        onlyMobile: true,
      },
    ],
  },
  {
    id: 'operations-requisitions:files',
    moduleId: 'operations-requisitions-files',
    title: 'Archivos de requisicion',
    description: 'Revisa tickets y facturas asociados a la requisicion.',
    version: 1,
    steps: [
      {
        target: '[data-tour="requisitions-tickets-table"]',
        title: 'Tickets',
        description: 'Aqui se muestran las imagenes y tickets relacionados.',
      },
      {
        target: '[data-tour="requisitions-ticket-download"]',
        title: 'Descargar ticket',
        description: 'Descarga el archivo del ticket seleccionado.',
      },
      {
        target: '[data-tour="requisitions-ticket-preview"]',
        title: 'Ver imagen',
        description: 'Abre la imagen del ticket para revisarla.',
      },
      {
        target: '[data-tour="requisitions-ticket-details"]',
        title: 'Detalle del ticket',
        description: 'Abre el detalle para ver informacion y acciones.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-ticket-reject"]',
        title: 'Rechazar ticket',
        description: 'Rechaza el ticket cuando la evidencia no sea valida.',
      },
      {
        target: '[data-tour="requisitions-ticket-open-image"]',
        title: 'Abrir imagen',
        description: 'Abre la imagen en una vista completa.',
      },
      {
        target: '[data-tour="requisitions-ticket-download-image"]',
        title: 'Descargar imagen',
        description: 'Guarda la imagen del ticket en tu equipo.',
      },
      {
        target: '[data-tour="requisitions-ticket-close"]',
        title: 'Cerrar detalle',
        description: 'Cierra el panel para continuar con la siguiente seccion.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-invoices-table"]',
        title: 'Facturas',
        description: 'Consulta las facturas asociadas y su estatus.',
      },
      {
        target: '[data-tour="requisitions-invoice-xml"]',
        title: 'Ver XML',
        description: 'Abre el XML de la factura.',
      },
      {
        target: '[data-tour="requisitions-invoice-pdf"]',
        title: 'Ver PDF',
        description: 'Abre el PDF de la factura.',
      },
      {
        target: '[data-tour="requisitions-invoice-link"]',
        title: 'Vincular requisicion',
        description: 'Relaciona la factura con una requisicion.',
      },
      {
        target: '[data-tour="requisitions-invoice-details"]',
        title: 'Detalle de factura',
        description: 'Abre el detalle para revisar la factura.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-invoice-validate"]',
        title: 'Validar factura',
        description: 'Aprueba la factura cuando todo este correcto.',
      },
      {
        target: '[data-tour="requisitions-invoice-reject"]',
        title: 'Rechazar factura',
        description: 'Rechaza la factura si necesita correcciones.',
      },
      {
        target: '[data-tour="requisitions-invoice-close"]',
        title: 'Cerrar detalle',
        description: 'Cierra el panel para continuar con la siguiente seccion.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-upload-invoice"]',
        title: 'Subir factura',
        description: 'Al continuar, abriremos la pestaña para cargar una nueva factura.',
        nextAction: 'click',
        nextTutorialId: 'operations-requisitions:billablefiles',
      },
    ],
  },
  {
    id: 'operations-requisitions:billablefiles',
    moduleId: 'operations-requisitions-billablefiles',
    title: 'Subir factura',
    description: 'Carga los archivos XML y PDF de una factura.',
    version: 1,
    steps: [
      {
        target: '[data-tour="requisitions-invoice-form"]',
        title: 'Formulario de factura',
        description:
          'Primero puedes capturar la factura sin imagen asociada y adjuntar los archivos XML y PDF.',
      },
      {
        target: '[data-tour="requisitions-ticket-select"]',
        title: 'Selecciona un ticket',
        description:
          'Da clic en el checkbox del ticket para asociar la imagen a la factura.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-invoice-preview"]',
        title: 'Imagen asociada',
        description:
          'Al seleccionar un ticket, la imagen se agrega aqui para relacionarla con la factura.',
      },
      {
        target: '[data-tour="requisitions-invoice-submit"]',
        title: 'Enviar factura',
        description: 'Guarda la factura para su validacion.',
      },
    ],
  },
  {
    id: 'operations-requisitions:detail',
    moduleId: 'operations-requisitions-detail',
    title: 'Detalle de requisicion',
    description: 'Conoce los elementos y acciones disponibles en el detalle.',
    version: 1,
    steps: [
      {
        target: '[data-tour="requisitions-detail-form"]',
        title: 'Formulario de requisicion',
        description: 'Aqui puedes revisar la informacion general de la requisicion.',
      },
      {
        target: '[data-tour="requisitions-detail-balance"]',
        title: 'Balance de viaticos',
        description: 'Consulta los montos solicitados y comprobados.',
      },
      {
        target: '[data-tour="requisitions-detail-approval-card"]',
        title: 'Aprobacion de facturas',
        description: 'Gestiona la solicitud de aprobacion o revisa el historial.',
      },
      {
        target: '[data-tour="requisitions-detail-request"]',
        title: 'Solicitar autorizacion',
        description: 'Envia la solicitud de autorizacion al responsable.',
      },
      {
        target: '[data-tour="requisitions-detail-history"]',
        title: 'Historial de aprobaciones',
        description: 'Consulta el historial de autorizaciones de la requisicion.',
      },
      {
        target: '[data-tour="requisitions-detail-documents"]',
        title: 'Reporte de gastos',
        description: 'Aqui veras los comprobantes asociados a la requisicion.',
      },
      {
        target: '[data-tour="requisitions-detail-docs-download"]',
        title: 'Descargar reporte',
        description: 'Genera el reporte completo de gastos.',
      },
      {
        target: '[data-tour="requisitions-detail-docs-xml"]',
        title: 'XML del comprobante',
        description: 'Abre el XML asociado al registro.',
      },
      {
        target: '[data-tour="requisitions-detail-docs-pdf"]',
        title: 'PDF del comprobante',
        description: 'Abre el PDF asociado al registro.',
      },
      {
        target: '[data-tour="requisitions-detail-docs-view"]',
        title: 'Ver detalles',
        description: 'Abre el panel con el detalle del comprobante.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="requisitions-detail-panel-xml"]',
        title: 'XML en el panel',
        description: 'Accede al XML desde el panel de detalle.',
      },
      {
        target: '[data-tour="requisitions-detail-panel-pdf"]',
        title: 'PDF en el panel',
        description: 'Accede al PDF desde el panel de detalle.',
      },
      {
        target: '[data-tour="requisitions-detail-panel-image"]',
        title: 'Imagen asociada',
        description: 'Abre la imagen vinculada al comprobante.',
      },
      {
        target: '[data-tour="requisitions-detail-panel-close"]',
        title: 'Cerrar detalle',
        description: 'Cierra el panel para continuar.',
        nextAction: 'click',
      },
    ],
  },
];
