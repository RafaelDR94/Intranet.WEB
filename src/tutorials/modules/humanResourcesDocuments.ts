import type { TutorialDefinition } from '../types'

export const humanResourcesDocumentsTutorials: TutorialDefinition[] = [
  {
    id: 'humanresources-managementdocuments:table',
    moduleId: 'humanresources-managementdocuments',
    title: 'Documentos gerenciales',
    description: 'Gestiona documentos gerenciales.',
    version: 1,
    steps: [
      {
        target: '[data-tour="humanresources-managementdocuments-table"]',
        title: 'Tabla de documentos',
        description: 'Listado de documentos gerenciales.',
      },
      {
        target: '[data-tour="humanresources-managementdocuments-search"]',
        title: 'Busqueda',
        description: 'Filtra por clave o descripcion.',
      },
      {
        target: '[data-tour="humanresources-managementdocuments-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="humanresources-managementdocuments-create"]',
        title: 'Nuevo documento',
        description: 'Abre el registro de documentos.',
      },
    ],
  },
  {
    id: 'humanresources-operationaldocuments:table',
    moduleId: 'humanresources-operationaldocuments',
    title: 'Documentos operativos',
    description: 'Gestiona documentos operativos.',
    version: 1,
    steps: [
      {
        target: '[data-tour="humanresources-operationaldocuments-table"]',
        title: 'Tabla de documentos',
        description: 'Listado de documentos operativos.',
      },
      {
        target: '[data-tour="humanresources-operationaldocuments-search"]',
        title: 'Busqueda',
        description: 'Filtra por clave o descripcion.',
      },
      {
        target: '[data-tour="humanresources-operationaldocuments-refresh"]',
        title: 'Actualizar',
        description: 'Recarga la informacion mas reciente.',
      },
      {
        target: '[data-tour="humanresources-operationaldocuments-create"]',
        title: 'Nuevo documento',
        description: 'Abre el registro de documentos.',
      },
    ],
  },
  {
    id: 'humanresources-documentregistry:form',
    moduleId: 'humanresources-documentregistry',
    title: 'Registro de documentos',
    description: 'Captura y carga documentos.',
    version: 1,
    steps: [
      {
        target: '[data-tour="documentregistry-form"]',
        title: 'Formulario',
        description: 'Completa los datos del documento.',
      },
      {
        target: '[data-tour="documentregistry-submit"]',
        title: 'Guardar',
        description: 'Registra el documento.',
      },
      {
        target: '[data-tour="documentregistry-view"]',
        title: 'Visualizar',
        description: 'Abre el archivo cargado.',
      },
    ],
  },
]
