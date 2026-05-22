import type { TutorialDefinition } from '../types'

export const proyectsProjectsTutorials: TutorialDefinition[] = [
  {
    id: 'proyects-newproyect:form',
    moduleId: 'proyects-newproyect',
    title: 'Nuevo proyecto',
    description: 'Captura la Información del proyecto.',
    version: 1,
    steps: [
      {
        target: '[data-tour="proyects-newproyect-form"]',
        title: 'Formulario',
        description: 'Completa los datos del proyecto.',
      },
      {
        target: '[data-tour="proyects-newproyect-submit"]',
        title: 'Registrar',
        description: 'Guarda el nuevo proyecto.',
      },
    ],
  },
]
