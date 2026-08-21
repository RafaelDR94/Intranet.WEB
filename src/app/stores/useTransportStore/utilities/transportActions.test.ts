import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ChangeDriverPayload, GetState, SetState, TransportStoreState } from '../types'

import { changeDriver } from './changeDriver'
import { fetchVehicleReassignmentsByEmployee } from './fetchVehicleReassignmentsByEmployee'
import { vehicleReassignmentApprove } from './vehicleReassignmentApprove'
import { vehicleReassignmentReject } from './vehicleReassignmentReject'

const { getSpy, postSpy, putSpy, fetchAssignmentsSpy } = vi.hoisted(() => ({
  getSpy: vi.fn(async () => ({ status: 200, data: { data: [] } })),
  postSpy: vi.fn(async () => ({ status: 200, data: {} })),
  putSpy: vi.fn(async () => ({ status: 200, data: {} })),
  fetchAssignmentsSpy: vi.fn(),
}))

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => getSpy,
  pPost: () => postSpy,
  pPut: () => putSpy,
}))
vi.mock('./fetchAssignments', () => ({ fetchAssignments: fetchAssignmentsSpy }))

describe('useTransportStore utilities (actions)', () => {
  beforeEach(() => {
    getSpy.mockClear()
    postSpy.mockClear()
    putSpy.mockClear()
    fetchAssignmentsSpy.mockReset()
  })

  it('changeDriver posts payload, refreshes assignments and updates currentAssignment', async () => {
    const assignment: TransportStoreState['assignments'][number] = {
      vehicleassignments_id: 'a1',
      employee_id: 'e1',
      name: 'Empleado',
      transport: {
        transport_id: 't1',
        brand: 'Brand',
        model: 'Model',
        UnitType: 'UnitType',
        plates: 'ABC-123',
      },
      status: {
        status_id: 's1',
        status: 'Activo',
        description: 'Activo',
      },
      departure_date: '2026-03-18',
      arrival_date: '2026-03-18',
      destination: 'Destino',
      signature_leader: null,
      signature_employee: null,
    }

    fetchAssignmentsSpy.mockImplementationOnce(async (set: SetState) => {
      set({ assignments: [assignment] })
      return [assignment]
    })

    const state: Partial<TransportStoreState> = {
      assignments: [],
      currentAssignment: undefined,
      changingDriver: false,
      successChangeDriver: false,
      error: undefined,
      warning: undefined,
    }
    const set: SetState = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as TransportStoreState) : partial
      )
    const get: GetState = () => state as TransportStoreState

    const payload: ChangeDriverPayload = {
      id_vehicleAssignments: 'a1',
      id_newEmployee: 'e2',
    }

    const ok = await changeDriver(set, get, payload)

    expect(ok).toBe(true)
    expect(postSpy).toHaveBeenCalledWith('/Transport/ChangeDriver', payload)
    expect(fetchAssignmentsSpy).toHaveBeenCalled()
    expect(state.changingDriver).toBe(false)
    expect(state.successChangeDriver).toBe(true)
    expect(state.currentAssignment?.vehicleassignments_id).toBe('a1')
  })

  it('vehicleReassignmentApprove sends payload and sets success flag', async () => {
    fetchAssignmentsSpy.mockImplementationOnce(async () => [])

    const state: Partial<TransportStoreState> = {
      approvingVehicleReassignment: false,
      successApproveVehicleReassignment: false,
      error: undefined,
      warning: undefined,
      assignments: [],
    }
    const set: SetState = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as TransportStoreState) : partial
      )
    const get: GetState = () => state as TransportStoreState

    const payload = {
      id: 'vr-1',
      comment: 'ok',
      front_image: 'f',
      back_image: 'b',
      right_side_image: 'r',
      left_side_image: 'l',
      circulation_card_image: 'c',
      signature: 's',
    }

    const ok = await vehicleReassignmentApprove(set, get, payload)

    expect(ok).toBe(true)
    expect(putSpy).toHaveBeenCalledWith('/Transport/VehicleReassignmentApprove', payload)
    expect(state.approvingVehicleReassignment).toBe(false)
    expect(state.successApproveVehicleReassignment).toBe(true)
  })

  it('vehicleReassignmentReject encodes comment and sets success flag', async () => {
    fetchAssignmentsSpy.mockImplementationOnce(async () => [])

    const state: Partial<TransportStoreState> = {
      rejectingVehicleReassignment: false,
      successRejectVehicleReassignment: false,
      error: undefined,
      warning: undefined,
      assignments: [],
    }
    const set: SetState = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as TransportStoreState) : partial
      )
    const get: GetState = () => state as TransportStoreState

    const ok = await vehicleReassignmentReject(set, get, 'vr-1', 'no procede')

    expect(ok).toBe(true)
    expect(putSpy).toHaveBeenCalledWith(
      '/Transport/VehicleReassignmentReject?VehicleReassignment=vr-1&comment=no%20procede',
      {}
    )
    expect(state.rejectingVehicleReassignment).toBe(false)
    expect(state.successRejectVehicleReassignment).toBe(true)
  })

  it('fetchVehicleReassignmentsByEmployee gets list and stores it', async () => {
    getSpy.mockResolvedValueOnce({
      status: 200,
      data: {
        data: [
          {
            vehicleassignments_id: 'A1',
            employee_id: 'E1',
            name: 'Empleado',
            transport: {
              transport_id: 'T1',
              brand: 'Brand',
              model: 'Model',
              UnitType: 'UnitType',
              plates: 'ABC-123',
            },
            status: {
              status_id: 'S1',
              status: 'En transito',
              description: 'En transito',
            },
            departure_date: '2026-03-18T10:00:00Z',
            arrival_date: null,
            destination: 'Destino',
            signature_leader: null,
            signature_employee: null,
            vehicletrackinglist: [],
          },
        ],
      },
    })

    const state: Partial<TransportStoreState> = {
      vehicleReassignmentsByEmployee: [],
      loadingVehicleReassignmentsByEmployee: false,
      successGetVehicleReassignmentsByEmployee: false,
      error: undefined,
      warning: undefined,
    }
    const set: SetState = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as TransportStoreState) : partial
      )
    const get: GetState = () => state as TransportStoreState

    const res = await fetchVehicleReassignmentsByEmployee('E1', set, get)

    expect(res?.[0]?.vehicleassignments_id).toBe('A1')
    expect(getSpy).toHaveBeenCalledWith('/Transport/VehicleReassignment/ByIdEmployee/E1')
    expect(state.loadingVehicleReassignmentsByEmployee).toBe(false)
    expect(state.successGetVehicleReassignmentsByEmployee).toBe(true)
    expect(state.vehicleReassignmentsByEmployee.length).toBe(1)
  })
})
