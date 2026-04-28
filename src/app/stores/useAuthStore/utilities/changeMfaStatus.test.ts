import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'
import type { User } from '@/app/context/AuthContext/types'

import { changeMfaStatus } from './changeMfaStatus'

const putMock = vi.hoisted(() => vi.fn())
const saveUserMock = vi.hoisted(() => vi.fn())
const saveLastUserRemeberedMock = vi.hoisted(() => vi.fn())

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => putMock }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))
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
    twoFactorEnabled: true,
    idWorkPosition: 'work-position',
    workPositionName: 'Work Position',
    idEnterprise: 'enterprise',
    idDepartment: 'department',
    password: 'secret',
    signature: '',
    email: 'user@example.com',
    ...overrides,
  })

describe('changeMfaStatus util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    putMock.mockResolvedValue({ status: 200, data: {} })
    saveUserMock.mockResolvedValue(undefined)
    saveLastUserRemeberedMock.mockResolvedValue(undefined)
  })

  it('actualiza MFA del usuario autenticado y persiste cambios', async () => {
    const state: Partial<AuthState> = {
      changingMFA: false,
      successChangeMFA: false,
      user: createUser({ idUser: '1', twoFactorEnabled: true }),
      userRemebered: null,
    }

    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    await changeMfaStatus(set, get, { idUser: '1', twoFactorEnabled: false })

    expect(putMock).toHaveBeenCalledWith('/Users/Mfa', {
      idUser: '1',
      twoFactorEnabled: false,
    })
    expect(state.successChangeMFA).toBe(true)
    expect(state.user?.twoFactorEnabled).toBe(false)
    expect(saveUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ twoFactorEnabled: false }),
    )
  })

  it('sincroniza MFA del usuario recordado cuando coincide', async () => {
    const state: Partial<AuthState> = {
      changingMFA: false,
      successChangeMFA: false,
      user: createUser({ idUser: '1', twoFactorEnabled: true }),
      userRemebered: createUser({
        idUser: '1',
        twoFactorEnabled: true,
        userName: 'remembered',
      }),
    }

    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    await changeMfaStatus(set, get, { idUser: '1', twoFactorEnabled: false })

    expect(state.userRemebered?.twoFactorEnabled).toBe(false)
    expect(saveLastUserRemeberedMock).toHaveBeenCalledWith(
      expect.objectContaining({ twoFactorEnabled: false }),
    )
  })
})
