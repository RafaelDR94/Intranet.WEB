import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Label } from './Label'

describe('Label', () => {
  it('renders text', () => {
    render(<Label type="valido" text="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
