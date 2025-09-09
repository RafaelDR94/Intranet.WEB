import { describe, it, expect } from 'vitest'

import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('creates initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })
})