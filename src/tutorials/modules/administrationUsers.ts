import type { TutorialDefinition } from '../types'

export const administrationUsersTutorials: TutorialDefinition[] = [
  {
    id: 'administration-createemployee:form',
    moduleId: 'administration-createemployee',
    title: 'Registro de empleado',
    description: 'Captura la informacion del empleado.',
    version: 1,
    steps: [
      {
        target: '[data-tour="createemployee-form"]',
        title: 'Formulario',
        description: 'Completa los datos del empleado.',
      },
      {
        target: '[data-tour="createemployee-submit"]',
        title: 'Registrar',
        description: 'Guarda el empleado.',
      },
    ],
  },
  {
    id: 'administration-employeeslist:table',
    moduleId: 'administration-employeeslist',
    title: 'Lista de empleados',
    description: 'Consulta y gestiona empleados.',
    version: 1,
    steps: [
      {
        target: '[data-tour="employeeslist-table"]',
        title: 'Tabla',
        description: 'Listado de empleados registrados.',
      },
      {
        target: '[data-tour="employeeslist-search"]',
        title: 'Busqueda',
        description: 'Filtra por nombre o correo.',
      },
      {
        target: '[data-tour="employeeslist-create"]',
        title: 'Nuevo empleado',
        description: 'Abre el registro de empleados.',
      },
      {
        target: '[data-tour="employeeslist-details"]',
        title: 'Ver detalle',
        description: 'Abre el detalle del empleado.',
      },
    ],
  },
]
