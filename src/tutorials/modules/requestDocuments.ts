import type { TutorialDefinition } from '../types'

export const requestDocumentsTutorials: TutorialDefinition[] = [
  {
    id: 'request-documents-management:table',
    moduleId: 'request-documents-management',
    title: 'Documentos gerenciales',
    description: 'Consulta formatos y descargas disponibles.',
    version: 1,
    steps: [
      {
        target: '[data-tour="request-documents-management-table"]',
        title: 'Tabla de documentos',
        description: 'Listado de documentos gerenciales.',
      },
      {
        target: '[data-tour="request-documents-management-search"]',
        title: 'Busqueda',
        description: 'Filtra por clave o descripcion.',
      },
      {
        target: '[data-tour="request-documents-management-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="request-documents-management-open"]',
        title: 'Abrir documento',
        description: 'Visualiza el formato en el visor.',
      },
      {
        target: '[data-tour="request-documents-management-download"]',
        title: 'Descargar',
        description: 'Descarga el documento seleccionado.',
      },
    ],
  },
  {
    id: 'request-documents-operational:table',
    moduleId: 'request-documents-operational',
    title: 'Documentos operativos',
    description: 'Consulta formatos y descargas disponibles.',
    version: 1,
    steps: [
      {
        target: '[data-tour="request-documents-operational-table"]',
        title: 'Tabla de documentos',
        description: 'Listado de documentos operativos.',
      },
      {
        target: '[data-tour="request-documents-operational-search"]',
        title: 'Busqueda',
        description: 'Filtra por clave o descripcion.',
      },
      {
        target: '[data-tour="request-documents-operational-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="request-documents-operational-open"]',
        title: 'Abrir documento',
        description: 'Visualiza el formato en el visor.',
      },
      {
        target: '[data-tour="request-documents-operational-download"]',
        title: 'Descargar',
        description: 'Descarga el documento seleccionado.',
      },
    ],
  },
]
