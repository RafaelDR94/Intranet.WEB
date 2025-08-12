import { describe, expect, it } from 'vitest'
import { getInitials, getShortenedName } from './NamesUtilities'

describe('NamesUtilities', () => {
  it('getInitials returns initials in uppercase', () => {
    expect(getInitials('Juan Carlos Rivera')).toBe('JCR')
    expect(getInitials('')).toBe('')
  })

  it('getShortenedName formats name correctly', () => {
    expect(getShortenedName('Ana Lucia Torres Gonzalez')).toBe('Ana L. Torres G.')
    expect(getShortenedName('Ana Torres Gonzalez')).toBe('Ana Torres G.')
    expect(getShortenedName('Ana')).toBe('Ana')
  })
})
