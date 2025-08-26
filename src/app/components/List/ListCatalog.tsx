'use client'

import List from './List'

export const ListCatalog = () => (
  <div className="p-6">
    <List items={[
      { id: 1, label: 'Item 1', controlType: 'badge', showAvatar: false },
      { id: 2, label: 'Item 2', controlType: 'details', showAvatar: false },
    ]} />
  </div>
)
