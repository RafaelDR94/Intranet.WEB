import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { fetchRequisitionsByIdEmployee } from './fetchRequisitionsByIdEmployee'

const getResponseMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => getResponseMock }))
describe('fetchRequisitionsByIdEmployee util', () => {
  beforeEach(() => {
    getResponseMock.mockReset()
    getResponseMock.mockResolvedValue({
      data: {
        data: [
          {
            billingRequisition: {
              billingrequisition_id: '1',
              requisitionkey: 'REQ-1',
              employee_id: 'emp1',
              employeename: 'Employee Test',
              idproject: 'proj1',
              projectname: 'Project',
              assignmentdate: '2025-12-01T00:00:00',
              enddate: '2025-12-02T00:00:00',
              motive: 'Test motive',
              state: 'Aguascalientes',
              amountdeposited: 100,
              provenamount: 0,
              amountdifference: 100,
              date_created: '2025-12-01 00:00:00',
              status: 'ACTIVA',
              gts_type: 'O',
              email: 'test@example.com',
              phone_number: '123',
              period: '01-12-2025 - 02-12-2025',
              current_days: 2,
            },
            billingDocumentRquisition: [
              {
                billingdocument_id: 'doc-1',
                billingimages_id: null,
                category: null,
                description: null,
                numpersons: 1,
                numnights: 1,
                iva: 16,
                total: 100,
                subtotal: 84,
                otherinvoices: 0,
                xml: null,
                image: null,
                pdf: null,
                status: null,
                comments: null,
                rfc_emisor: null,
                rfc_receptor: null,
                conceptos: null,
                uuid: null,
                importe: null,
                xmlinformation: null,
                certification_date: null,
                date_created: '2025-12-01',
                sat_validation: true,
                SAP_Pending: true,
                complete_SAP: false,
                billingAcuse: null,
                forbidden_code: false,
                user_comments: '',
                validatedbyoperations: false,
              },
            ],
          },
        ],
      },
    })
  })

  it('llena requisitions', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await fetchRequisitionsByIdEmployee('emp1', set, get)

    expect(state.requisitions).toHaveLength(1)
    expect(state.requisitions?.[0].billingDocumentRquisition).toHaveLength(1)
    expect(state.successGet).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('retorna advertencia si no hay datos', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    getResponseMock.mockResolvedValueOnce({ data: { data: [] } })

    await fetchRequisitionsByIdEmployee('emp1', set, get)

    expect(state.requisitions).toHaveLength(0)
    expect(state.warning).toBeDefined()
    expect(state.loading).toBe(false)
  })
})
