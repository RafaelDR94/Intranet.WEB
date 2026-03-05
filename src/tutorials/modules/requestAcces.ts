import type { TutorialDefinition } from '../types'

export const requestAccesTutorials: TutorialDefinition[] = [
  {
    id: 'request-acces-generate:main',
    moduleId: 'request-acces-generate',
    title: 'Generar acceso',
    description: 'Captura la informacion del acceso.',
    version: 1,
    steps: [
      {
        target: '[data-tour="acces-generate-form"]',
        title: 'Formulario',
        description: 'Completa los datos del acceso.',
      },
      {
        target: '[data-tour="acces-generate-submit"]',
        title: 'Enviar solicitud',
        description: 'Guarda la informacion del acceso.',
      },
      {
        target: '[data-tour="acces-external-form"]',
        title: 'Detalle externo',
        description: 'Gestiona personal, herramientas y vehiculos.',
      },
      {
        target: '[data-tour="acces-external-sections"]',
        title: 'Secciones',
        description: 'Navega entre personal, herramientas y vehiculos.',
      },
    ],
  },
  {
    id: 'request-acces-history:table',
    moduleId: 'request-acces-history',
    title: 'Historial de accesos',
    description: 'Consulta solicitudes creadas e historial.',
    version: 1,
    steps: [
      {
        target: '[data-tour="acces-history-table"]',
        title: 'Tablas de accesos',
        description: 'Solicitudes creadas e historial.',
      },
      {
        target: '[data-tour="acces-history-create"]',
        title: 'Crear solicitud',
        description: 'Genera una nueva solicitud de acceso.',
      },
      {
        target: '[data-tour="acces-history-row-actions"]',
        title: 'Acciones',
        description: 'Abre detalles o elimina el registro.',
      },
    ],
  },
  {
    id: 'request-acces-register:form',
    moduleId: 'request-acces-register',
    title: 'Registrar empresa',
    description: 'Captura los datos de la empresa externa.',
    version: 1,
    steps: [
      {
        target: '[data-tour="acces-register-form"]',
        title: 'Formulario',
        description: 'Completa la informacion de la empresa.',
      },
      {
        target: '[data-tour="acces-register-submit"]',
        title: 'Registrar',
        description: 'Guarda la empresa registrada.',
      },
    ],
  },
]
