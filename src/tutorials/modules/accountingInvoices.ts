import type { TutorialDefinition } from '../types'

export const accountingInvoicesTutorials: TutorialDefinition[] = [
  {
    id: 'accounting-validateinvoices:table',
    moduleId: 'accounting-validateinvoices',
    title: 'Validar facturas',
    description: 'Revisa y valida facturas pendientes.',
    version: 1,
    steps: [
      {
        target: '[data-tour="accounting-validateinvoices-table-new"]',
        title: 'Nuevas facturas',
        description: 'Listado de facturas recientes.',
      },
      {
        target: '[data-tour="accounting-validateinvoices-validate"]',
        title: 'Validar facturas',
        description: 'Ejecuta la validacion en lote.',
      },
      {
        target: '[data-tour="accounting-validateinvoices-details"]',
        title: 'Ver detalles',
        description: 'Abre el panel de detalle de la factura.',
      },
      {
        target: '[data-tour="accounting-validateinvoices-table-pending"]',
        title: 'Pendientes por validar',
        description: 'Facturas pendientes de dias anteriores.',
      },
    ],
  },
  {
    id: 'accounting-invoices-sat:table',
    moduleId: 'accounting-invoices-sat',
    title: 'Validacion SAT',
    description: 'Consulta estatus SAT y envia a SAP.',
    version: 1,
    steps: [
      {
        target: '[data-tour="accounting-sat-table-valid"]',
        title: 'CFDIs validos',
        description: 'Listado de CFDIs con estatus valido.',
      },
      {
        target: '[data-tour="accounting-sat-send"]',
        title: 'Enviar a SAP',
        description: 'Envia los CFDIs seleccionados.',
      },
      {
        target: '[data-tour="accounting-sat-details"]',
        title: 'Ver detalles',
        description: 'Abre el detalle del CFDI.',
      },
      {
        target: '[data-tour="accounting-sat-table-others"]',
        title: 'Otros estatus',
        description: 'CFDIs con claves prohibidas o invalidas.',
      },
    ],
  },
]
