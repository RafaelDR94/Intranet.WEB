import type { TutorialDefinition } from '../types'

export const treasuryTutorials: TutorialDefinition[] = [
  {
    id: 'treasury-pettycash-control:main',
    moduleId: 'treasury-pettycash-control',
    title: 'Control de caja chica',
    description: 'Resumen del fondo y tabla de control de vales.',
    version: 1,
    steps: [
      {
        target: '[data-tour="treasury-control-summary-main"]',
        title: 'Resumen del fondo',
        description: 'Consulta el estado general del fondo fijo.',
      },
      {
        target: '[data-tour="treasury-control-card-cash"]',
        title: 'Efectivo disponible',
        description: 'Revisa el efectivo actual en caja.',
      },
      {
        target: '[data-tour="treasury-control-card-verified"]',
        title: 'Comprobados',
        description: 'Monto ya comprobado en vales.',
      },
      {
        target: '[data-tour="treasury-control-table"]',
        title: 'Tabla de control',
        description: 'Listado de vales y estatus actuales.',
      },
      {
        target: '[data-tour="treasury-control-search"]',
        title: 'Busqueda',
        description: 'Filtra por colaborador, concepto o estatus.',
      },
      {
        target: '[data-tour="treasury-control-filter"]',
        title: 'Filtro',
        description: 'Segmenta por tipo de vale o estatus.',
      },
      {
        target: '[data-tour="treasury-control-calendar"]',
        title: 'Rango de fechas',
        description: 'Ajusta el periodo de consulta.',
      },
      {
        target: '[data-tour="treasury-control-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="treasury-control-row-actions"]',
        title: 'Acciones por fila',
        description: 'Abre el menu para ver detalles o eliminar.',
        onlyDesktop: true,
      },
    ],
  },
  {
    id: 'treasury-pettycash-request:pink',
    moduleId: 'treasury-pettycash-request',
    title: 'Solicitud vale rosa',
    description: 'Captura y envia un vale rosa desde tesoreria.',
    version: 1,
    steps: [
      {
        target: '[data-tour="treasury-request-pink-form"]',
        title: 'Formulario',
        description: 'Completa los datos del vale rosa.',
      },
      {
        target: '[data-tour="treasury-request-pink-submit"]',
        title: 'Enviar vale',
        description: 'Envia la solicitud cuando el formulario este completo.',
      },
    ],
  },
  {
    id: 'treasury-pettycash-request:blue',
    moduleId: 'treasury-pettycash-request',
    title: 'Solicitud vale azul',
    description: 'Captura y envia un vale azul desde tesoreria.',
    version: 1,
    steps: [
      {
        target: '[data-tour="treasury-request-blue-form"]',
        title: 'Formulario',
        description: 'Completa los datos del vale azul.',
      },
      {
        target: '[data-tour="treasury-request-blue-submit"]',
        title: 'Enviar vale',
        description: 'Envia la solicitud cuando el formulario este completo.',
      },
    ],
  },
]
