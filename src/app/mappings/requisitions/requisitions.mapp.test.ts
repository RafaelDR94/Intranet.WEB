import { describe, expect, it } from 'vitest'

import { RequisitionMap } from './requisitions.mapp'

const sampleResponse = {
  billing_requisition: {
    billingrequisition_id: '5ecf32f5-1b3e-4240-9c3f-0fba73bb52fc',
    requisitionkey: '123',
    employee_id: '4d57db6c-686a-4f76-b180-03fcedab13d4',
    employeename: 'Katherine Negrete Aguilar',
    idproject: '0f825e11-d85c-4102-9a21-0783e9325f52',
    status: 'CERRADO',
    projectname: 'PY-SEMAR-011',
    assignmentdate: '2025-10-23T00:00:00',
    enddate: '2025-10-30T00:00:00',
    motive: 'Test',
    state: 'Aguascalientes',
    amountdeposited: 10000,
    provenamount: 447,
    amountdifference: 9553,
    date_created: '2025-10-23 13:25:47',
    gts_type: 'O',
    email: 'katherine.negrete@drsecurity.net',
    phone_number: '',
    period: '23-10-2025 - 15-12-2025',
    current_days: 54,
  },
  billing_document_requisition: [
    {
      billingdocument_id: 'd914d846-b560-4a0d-a576-38410dd5cd3c',
      category: { id: '4e4d078d-67af-4ea5-888e-2929544789a3', name: 'HOSPEDAJE' },
      description: { id: '9ec7a1da-0d9d-4af0-96b2-1b0ce4c26c09', name: 'OTROS' },
      iva: 61.66,
      total: 447,
      subtotal: 385.34,
      date_created: '23/10/2025 01:27:02 p. m.',
      sat_validation: true,
      SAP_Pending: true,
      complete_SAP: true,
      forbidden_code: false,
      validatedbyoperations: true,
    },
  ],
}

describe('RequisitionMap', () => {
  it('maps snake_case requisition responses including documents', () => {
    const mapped = RequisitionMap(sampleResponse)

    expect(mapped.billingrequisition_id).toBe('5ecf32f5-1b3e-4240-9c3f-0fba73bb52fc')
    expect(mapped.id_Employee).toBe('4d57db6c-686a-4f76-b180-03fcedab13d4')
    expect(mapped.projectname).toBe('PY-SEMAR-011')
    expect(mapped.assignmentdate).toBe('2025-10-23')
    expect(mapped.endDate).toBe('2025-10-30')
    expect(mapped.current_days).toBe(54)
    expect(mapped.period).toBe('23-10-2025 - 15-12-2025')

    expect(mapped.billingDocumentRquisition).toHaveLength(1)
    const [document] = mapped.billingDocumentRquisition
    expect(document.category).toBe('HOSPEDAJE')
    expect(document.description).toBe('OTROS')
    expect(document.total).toBe(447)
    expect(mapped.state).toBe('Aguascalientes')
  })
})
