import { beforeEach, describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'
import type { User } from '@/app/context/AuthContext/types'

import { changeNip } from './changeNIP'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

const saveUserMock = vi.hoisted(() => vi.fn())
const saveLastUserRemeberedMock = vi.hoisted(() => vi.fn())

vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  saveUser: saveUserMock,
  saveLastUserRemebered: saveLastUserRemeberedMock,
}))

const createUser = (overrides: Partial<User> = {}): User =>
  ({
    fullName: 'User',
    employeeNumber: '1',
    userName: 'user',
    changePassword: false,
    idEmployee: 'employee-1',
    idUser: '1',
    idRol: 'role-1',
    lifeToken: 'token',
    rolName: 'role',
    token: 'token',
    imageProfile: '',
    treeFirebase: '{}',
    nip: '0000',
    activeNIP: true,
    idWorkPosition: 'work-position',
    workPositionName: 'Work Position',
    idEnterprise: 'enterprise',
    idDepartment: 'department',
    password: 'secret',
    signature: '',
    email: 'user@example.com',
    ...overrides,
  })

describe('changeNip util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    saveUserMock.mockResolvedValue(undefined)
    saveLastUserRemeberedMock.mockResolvedValue(undefined)
  })

  it('actualiza el nip del usuario autenticado y persiste los cambios', async () => {
    const state: Partial<AuthState> = {
      loading: false,
      successChangeNIP: false,
      user: createUser(),
      userRemebered: null,
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    await changeNip(set, get, { user_id: '1', nip: '1234' })

    expect(state.successChangeNIP).toBe(true)
    expect(state.user?.nip).toBe('1234')
    expect(saveUserMock).toHaveBeenCalledWith(expect.objectContaining({ nip: '1234' }))
    expect(saveLastUserRemeberedMock).not.toHaveBeenCalled()
  })

  it('sincroniza el nip del usuario recordado cuando corresponde', async () => {
    const state: Partial<AuthState> = {
      loading: false,
      successChangeNIP: false,
      user: createUser({ idUser: '1' }),
      userRemebered: createUser({ idUser: '1', nip: '4321', userName: 'remembered' }),
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await changeNip(set, get, { user_id: '1', nip: '1234' })
    expect(state.userRemebered?.nip).toBe('1234')
    expect(saveLastUserRemeberedMock).toHaveBeenCalledWith(expect.objectContaining({ nip: '1234' }))
  })
})
