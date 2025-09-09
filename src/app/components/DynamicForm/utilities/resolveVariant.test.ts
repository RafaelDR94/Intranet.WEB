import { describe,it,expect } from 'vitest'

import { FieldModel } from '../types'

import { resolveVariant } from './resolveVariant'

describe('resolveVariant',()=>{
  it('returns error variant when field has error',()=>{
    const field: FieldModel = { name: 'age', type: 'number', label: 'Edad', value: 0 };
    const result = resolveVariant(field, { age: true }, { age: 'error' }, 0);
    expect(result.variant).toBe('error')
  })
})
