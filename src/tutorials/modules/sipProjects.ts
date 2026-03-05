import type { TutorialDefinition } from '../types'

export const sipProjectsTutorials: TutorialDefinition[] = [
  {
    id: 'sip-newproyect:form',
    moduleId: 'sip-newproyect',
    title: 'Nuevo proyecto',
    description: 'Captura la informacion del proyecto.',
    version: 1,
    steps: [
      {
        target: '[data-tour="sip-newproyect-form"]',
        title: 'Formulario',
        description: 'Completa los datos del proyecto.',
      },
      {
        target: '[data-tour="sip-newproyect-submit"]',
        title: 'Registrar',
        description: 'Guarda el nuevo proyecto.',
      },
    ],
  },
]
