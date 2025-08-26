'use client'

import RequisitionsTable from './RequisitionsTable'
import * as hook from './hooks/useRequisitionsTable'

;(hook as any).useRequisitionTable = () => ({
  rows: [
    { id: '1', snCode: 'REQ-1', debtorName: 'John Doe', projectCode: 'PRJ-1', date_created: '2025-01-01' },
  ],
  setQuery: () => {},
  confirmOpen: false,
  rowToDelete: null,
  removing: false,
  handleConfirmDelete: () => {},
  setConfirmOpen: () => {},
  onEdit: () => {},
  onDelete: () => {},
  refresh: () => {},
})

export default function RequisitionsTableCatalog() {
  return (
    <div className="p-8">
      <RequisitionsTable onEditRequest={() => {}} />
    </div>
  )
}
