'use client'

import { Card } from './Card'

export const CardCatalog = () => (
  <div className="space-y-4 p-6">
    <Card
      imageSrc="image.png"
      label="Vertical"
      title="Title"
      description="Description"
      onAccept={() => {}}
    />
    <Card
      orientation="horizontal"
      imageSrc="image.png"
      label="Horizontal"
      title="Title"
      description="Description"
      onAccept={() => {}}
      showSecondaryButton
    />
  </div>
)
