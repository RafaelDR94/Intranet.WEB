import type { TutorialDefinition } from '../types'

export const authorizationsTutorials: TutorialDefinition[] = [
  {
    id: 'authorizations:list',
    moduleId: 'authorizations-list',
    title: 'Solicitudes de autorizacion',
    description: 'Aprende a localizar y abrir solicitudes pendientes.',
    version: 1,
    steps: [
      {
        target: '[data-tour="authorizations-table"]',
        title: 'Listado principal',
        description: 'Aqui se muestran las solicitudes asignadas.',
      },
      {
        target: '[data-tour="authorizations-search"]',
        title: 'Busqueda',
        description: 'Filtra por empresa, solicitante o proyecto.',
      },
      {
        target: '[data-tour="authorizations-filter"]',
        title: 'Filtro por estatus',
        description: 'Selecciona pendientes, aprobadas o rechazadas.',
      },
      {
        target: '[data-tour="authorizations-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la Información mas reciente.',
      },
      {
        target: '[data-tour="authorizations-row-view"]',
        title: 'Ver solicitud',
        description: 'Abre el detalle de la autorizacion.',
      },
    ],
  },
  {
    id: 'authorizations:requisition-detail',
    moduleId: 'authorizations-requisition-detail',
    title: 'Autorizacion de requisicion',
    description: 'Revisa el resumen, aprueba o rechaza la requisicion.',
    version: 1,
    steps: [
      {
        target: '[data-tour="authorizations-requisition-header"]',
        title: 'Encabezado',
        description: 'Identifica el reporte y la requisicion.',
      },
      {
        target: '[data-tour="authorizations-requisition-approve"]',
        title: 'Aprobar',
        description: 'Autoriza la requisicion si todo es correcto.',
      },
      {
        target: '[data-tour="authorizations-requisition-reject"]',
        title: 'Rechazar',
        description: 'Envia comentarios cuando haya observaciones.',
      },
      {
        target: '[data-tour="authorizations-requisition-summary"]',
        title: 'Resumen',
        description: 'Consulta periodo, montos y beneficiario.',
      },
      {
        target: '[data-tour="authorizations-requisition-escalate"]',
        title: 'Escalar',
        description: 'Deriva la solicitud a otro autorizador.',
      },
      {
        target: '[data-tour="authorizations-requisition-report-table"]',
        title: 'Reporte de gastos',
        description: 'Revisa los comprobantes asociados.',
      },
      {
        target: '[data-tour="authorizations-requisition-download"]',
        title: 'Descargar',
        description: 'Descarga la tabla completa cuando lo necesites.',
      },
    ],
  },
  {
    id: 'authorizations:vale-detail',
    moduleId: 'authorizations-vale-detail',
    title: 'Autorizacion de vales',
    description: 'Revisa el resumen, adjuntos y el historial.',
    version: 1,
    steps: [
      {
        target: '[data-tour="authorizations-vale-header"]',
        title: 'Encabezado',
        description: 'Identifica la solicitud y sus acciones.',
      },
      {
        target: '[data-tour="authorizations-vale-approve"]',
        title: 'Aprobar',
        description: 'Autoriza el vale cuando sea correcto.',
      },
      {
        target: '[data-tour="authorizations-vale-reject"]',
        title: 'Rechazar',
        description: 'Rechaza el vale con comentarios claros.',
      },
      {
        target: '[data-tour="authorizations-vale-summary"]',
        title: 'Resumen',
        description: 'Consulta RFC, conceptos y montos.',
      },
      {
        target: '[data-tour="authorizations-vale-attachments"]',
        title: 'Adjuntos',
        description: 'Abre evidencia, XML o PDF.',
      },
      {
        target: '[data-tour="authorizations-vale-escalate"]',
        title: 'Escalar',
        description: 'Envia la solicitud a otro autorizador.',
      },
      {
        target: '[data-tour="authorizations-vale-history-table"]',
        title: 'Historial',
        description: 'Consulta el historial de solicitudes.',
      },
      {
        target: '[data-tour="authorizations-vale-filter"]',
        title: 'Filtrar',
        description: 'Segmenta por tipo y estatus.',
      },
    ],
  },
]
