import React from 'react'
import { render, waitFor } from '@testing-library/react'
import ThemeInitializer from './ThemeInitializer'
import { vi } from 'vitest'

vi.mock('../PrincipalContext', () => ({
  usePrincipal: () => ({ usePrincipalTheme: { theme: 'dark' } })
}))

describe('ThemeInitializer', () => {
  it('sets data-theme attribute from context', async () => {
    render(<ThemeInitializer />)
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })
})
