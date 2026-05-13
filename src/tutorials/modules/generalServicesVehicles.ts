import type { TutorialDefinition } from '../types'

export const generalServicesVehiclesTutorials: TutorialDefinition[] = [
  {
    id: 'generalservices-vehicleregistry:form',
    moduleId: 'generalservices-vehicleregistry',
    title: 'Registro vehicular',
    description: 'Captura datos y evidencia fotografica.',
    version: 1,
    steps: [
      {
        target: '[data-tour="vehicleregistry-form"]',
        title: 'Formulario',
        description: 'Completa los datos del vehiculo.',
      },
      {
        target: '[data-tour="vehicleregistry-next"]',
        title: 'Siguiente',
        description: 'Avanza a la carga de fotos.',
      },
      {
        target: '[data-tour="vehicleregistry-photos"]',
        title: 'Fotos',
        description: 'Carga las evidencias del vehiculo.',
      },
      {
        target: '[data-tour="vehicleregistry-submit"]',
        title: 'Guardar',
        description: 'Registra la salida o entrada.',
      },
    ],
  },
  {
    id: 'generalservices-vehicleregistrylist:table',
    moduleId: 'generalservices-vehicleregistrylist',
    title: 'Listado vehicular',
    description: 'Consulta registros y transitos.',
    version: 1,
    steps: [
      {
        target: '[data-tour="vehicleregistrylist-table-transit"]',
        title: 'En transito',
        description: 'Registros vehiculares activos.',
      },
      {
        target: '[data-tour="vehicleregistrylist-table-history"]',
        title: 'Historial',
        description: 'Registros finalizados.',
      },
      {
        target: '[data-tour="vehicleregistrylist-search"]',
        title: 'Busqueda',
        description: 'Filtra por conductor o placa.',
      },
      {
        target: '[data-tour="vehicleregistrylist-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la Información mas reciente.',
      },
      {
        target: '[data-tour="vehicleregistrylist-create"]',
        title: 'Nuevo registro',
        description: 'Inicia un nuevo registro vehicular.',
      },
      {
        target: '[data-tour="vehicleregistrylist-details"]',
        title: 'Ver mas',
        description: 'Abre el detalle del registro.',
      },
    ],
  },
]
