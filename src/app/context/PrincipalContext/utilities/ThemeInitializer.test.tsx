import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import ThemeInitializer from './ThemeInitializer'


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
