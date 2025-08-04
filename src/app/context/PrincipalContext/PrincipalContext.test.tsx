import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PrincipalProvider, usePrincipal } from './PrincipalContext'

describe('PrincipalContext', () => {
  it('provides hooks to children', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PrincipalProvider>{children}</PrincipalProvider>
    )
    const { result } = renderHook(() => usePrincipal(), { wrapper })
    expect(result.current.usePrincipalTheme).toBeDefined()
    expect(result.current.usePrincipalAlert).toBeDefined()
  })

  it('throws error outside provider', () => {
    expect(() => renderHook(() => usePrincipal())).toThrow()
  })
})
