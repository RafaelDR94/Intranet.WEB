import { describe, it, expect, beforeEach } from 'vitest'

import { useIntranetGatewayStore } from './useIntranetGatewayStore'

describe('useIntranetGatewayStore', () => {
  beforeEach(() => {
    useIntranetGatewayStore.setState({ get: undefined, post: undefined, put: undefined, del: undefined, isReady: false })
  })

  it('inicia no listo', () => {
    expect(useIntranetGatewayStore.getState().isReady).toBe(false)
  })

  it('setCRUD actualiza funciones y readiness', () => {
    const getFn = () => {}
    useIntranetGatewayStore.getState().setCRUD({ get: getFn })
    expect(useIntranetGatewayStore.getState().get).toBe(getFn)
    expect(useIntranetGatewayStore.getState().isReady).toBe(true)
  })
})
