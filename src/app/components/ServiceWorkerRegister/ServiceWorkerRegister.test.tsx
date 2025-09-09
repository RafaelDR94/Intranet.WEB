import { render } from '@testing-library/react'
import React from 'react'
import { describe, it, expect } from 'vitest'

import { ServiceWorkerRegister } from './ServiceWorkerRegister'

describe('ServiceWorkerRegister', () => {
  it('renders without crashing', () => {
    const { container } = render(<ServiceWorkerRegister />)
    expect(container.firstChild).toBeNull()
  })
})
