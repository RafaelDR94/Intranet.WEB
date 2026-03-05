import type { TutorialDefinition } from '../types'

export const ownRequisitionsTutorials: TutorialDefinition[] = [
  {
    id: 'request-ownrequisitions:list',
    moduleId: 'request-ownrequisitions-list',
    title: 'Requisiciones personales',
    description: 'Identifica las herramientas principales del listado.',
    version: 1,
    steps: [
      {
        target: '[data-tour="ownrequisitions-table"]',
        title: 'Listado de requisiciones',
        description: 'Aqui ves las requisiciones activas de tu usuario.',
      },
      {
        target: '[data-tour="ownrequisitions-search"]',
        title: 'Busqueda',
        description: 'Filtra por proyecto, estado o codigo de solicitud.',
      },
      {
        target: '[data-tour="ownrequisitions-calendar"]',
        title: 'Rango de fechas',
        description: 'Ajusta el periodo para encontrar registros especificos.',
      },
      {
        target: '[data-tour="ownrequisitions-refresh"]',
        title: 'Actualizar',
        description: 'Recarga el listado con la informacion mas reciente.',
      },
      {
        target: '[data-tour="ownrequisitions-row-details"]',
        title: 'Ver detalle',
        description: 'Abre el detalle de la requisicion seleccionada.',
        onlyDesktop: true,
      },
      {
        target: '[data-tour="ownrequisitions-row-actions"]',
        title: 'Acciones rapidas',
        description: 'En mobile, abre el menu para ver detalles.',
        onlyMobile: true,
        nextAction: 'click',
      },
    ],
  },
  {
    id: 'request-ownrequisitions:detail',
    moduleId: 'request-ownrequisitions-detail',
    title: 'Detalle de requisicion',
    description: 'Conoce el formulario, balance y documentos asociados.',
    version: 1,
    steps: [
      {
        target: '[data-tour="ownrequisitions-detail-form"]',
        title: 'Formulario',
        description: 'Revisa la informacion general de la requisicion.',
      },
      {
        target: '[data-tour="ownrequisitions-detail-balance"]',
        title: 'Balance de viaticos',
        description: 'Consulta montos solicitados y comprobados.',
      },
      {
        target: '[data-tour="ownrequisitions-detail-documents-table"]',
        title: 'Reporte de gastos',
        description: 'Aqui veras los comprobantes asociados.',
      },
      {
        target: '[data-tour="ownrequisitions-detail-docs-view"]',
        title: 'Abrir detalle',
        description: 'Abre el panel con el detalle del comprobante.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="ownrequisitions-detail-panel-close"]',
        title: 'Cerrar panel',
        description: 'Cierra el panel para volver al listado.',
        nextAction: 'click',
      },
    ],
  },
  {
    id: 'request-ownrequisitions:billablefiles',
    moduleId: 'request-ownrequisitions-billablefiles',
    title: 'Archivos facturables',
    description: 'Explora el historial de archivos y sus acciones.',
    version: 1,
    steps: [
      {
        target: '[data-tour="ownrequisitions-billablefiles-recent-table"]',
        title: 'Archivos recientes',
        description: 'Consulta los comprobantes mas recientes.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-search"]',
        title: 'Busqueda',
        description: 'Busca por fecha, proyecto o estatus.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-filter"]',
        title: 'Filtro por estatus',
        description: 'Filtra por pendientes, rechazados o validados.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-calendar"]',
        title: 'Rango de fechas',
        description: 'Limita el periodo del historial.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-refresh"]',
        title: 'Actualizar',
        description: 'Refresca los datos cargados.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-upload"]',
        title: 'Subir archivos',
        description: 'Abre el flujo de carga de comprobantes.',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-details"]',
        title: 'Ver detalle',
        description: 'Abre el panel de detalle del comprobante.',
        nextAction: 'click',
      },
      {
        target: '[data-tour="ownrequisitions-billablefiles-panel-close"]',
        title: 'Cerrar panel',
        description: 'Regresa al listado de archivos.',
        nextAction: 'click',
      },
    ],
  },
]
