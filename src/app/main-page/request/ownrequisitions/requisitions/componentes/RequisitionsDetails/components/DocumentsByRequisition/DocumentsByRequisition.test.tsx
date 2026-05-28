import { render } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import DocumentsByRequisition from './DocumentsByRequisition'

const requisitionDetailsTableMock = vi.fn(() => <div data-testid="operations-documents-table" />)

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === 'id' ? 'req-1' : null),
  }),
}))

vi.mock(
  '@/app/main-page/operations/requisitions/requisitionListPage/components/RequisitionDetails/components/RequisitionsDetailsTable',
  () => ({
    __esModule: true,
    default: (props: any) => requisitionDetailsTableMock(props),
  }),
)

describe('DocumentsByRequisition', () => {
  it('reuses the operations requisition documents table with the current requisition id', () => {
    render(<DocumentsByRequisition />)

    expect(requisitionDetailsTableMock).toHaveBeenCalledWith(
      expect.objectContaining({ requisitionIdOverride: 'req-1' }),
    )
  })
})
