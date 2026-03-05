import type { TutorialDefinition } from '../types'

export const pettyCashTutorials: TutorialDefinition[] = [
  {
    id: 'request-pettycash-request:pink',
    moduleId: 'request-pettycash-request',
    title: 'Solicitud vale rosa',
    description: 'Captura y envia un vale rosa desde solicitudes.',
    version: 1,
    steps: [
      {
        target: '[data-tour="pettycash-request-pink-form"]',
        title: 'Formulario',
        description: 'Completa los datos del vale rosa.',
      },
      {
        target: '[data-tour="pettycash-request-pink-submit"]',
        title: 'Enviar vale',
        description: 'Envia la solicitud cuando el formulario este completo.',
      },
    ],
  },
  {
    id: 'request-pettycash-request:blue',
    moduleId: 'request-pettycash-request',
    title: 'Solicitud vale azul',
    description: 'Captura y envia un vale azul desde solicitudes.',
    version: 1,
    steps: [
      {
        target: '[data-tour="pettycash-request-blue-form"]',
        title: 'Formulario',
        description: 'Completa los datos del vale azul.',
      },
      {
        target: '[data-tour="pettycash-request-blue-submit"]',
        title: 'Enviar vale',
        description: 'Envia la solicitud cuando el formulario este completo.',
      },
    ],
  },
  {
    id: 'request-pettycash-history:table',
    moduleId: 'request-pettycash-history',
    title: 'Historial de vales',
    description: 'Consulta el listado de solicitudes anteriores.',
    version: 1,
    steps: [
      {
        target: '[data-tour="pettycash-history-table"]',
        title: 'Tabla de historial',
        description: 'Aqui se muestran los vales registrados.',
      },
      {
        target: '[data-tour="pettycash-history-search"]',
        title: 'Busqueda',
        description: 'Filtra por concepto, estatus o fecha.',
      },
      {
        target: '[data-tour="pettycash-history-filter"]',
        title: 'Filtro',
        description: 'Segmenta por tipo de vale y estatus.',
      },
      {
        target: '[data-tour="pettycash-history-calendar"]',
        title: 'Rango de fechas',
        description: 'Ajusta el periodo de consulta.',
      },
      {
        target: '[data-tour="pettycash-history-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="pettycash-history-row-actions"]',
        title: 'Acciones por fila',
        description: 'Abre el menu para ver detalle o cancelar.',
        onlyDesktop: true,
      },
    ],
  },
]
