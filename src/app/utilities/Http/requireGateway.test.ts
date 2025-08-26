import { describe, it, expect, beforeEach } from 'vitest'
import { requireGateway, isGatewayReady, requireFullGateway } from './requireGateway'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

describe('requireGateway utilities', () => {
  beforeEach(() => {
    useIntranetGatewayStore.setState({ get: undefined, post: undefined, put: undefined, del: undefined, isReady: false })
  })

  it('throws if gateway fn is missing', () => {
    expect(() => requireGateway('get')).toThrow()
  })

  it('returns gateway fn when available', () => {
    const getFn = () => {}
    useIntranetGatewayStore.setState({ get: getFn, isReady: true })
    expect(requireGateway('get')).toBe(getFn)
  })

  it('isGatewayReady reflects store state', () => {
    expect(isGatewayReady()).toBe(false)
    useIntranetGatewayStore.setState({ isReady: true })
    expect(isGatewayReady()).toBe(true)
  })

  it('requireFullGateway returns all fns', () => {
    const fns = { get: () => {}, post: () => {}, put: () => {}, del: () => {} }
    useIntranetGatewayStore.setState({ ...fns, isReady: true })
    expect(requireFullGateway()).toMatchObject(fns)
  })

  it('requireFullGateway throws if missing fn', () => {
    useIntranetGatewayStore.setState({ get: () => {}, post: () => {} })
    expect(() => requireFullGateway()).toThrow()
  })
})
