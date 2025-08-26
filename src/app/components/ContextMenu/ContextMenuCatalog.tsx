'use client'

import { ContextMenu } from './ContextMenu'

export const ContextMenuCatalog = () => (
  <div className="p-6 space-y-4">
    <ContextMenu
      trigger={<button>Open</button>}
      items={[{ label: 'Item 1' }, { label: 'Item 2', danger: true }]}
    />
  </div>
)
