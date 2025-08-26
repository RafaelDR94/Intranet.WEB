'use client'

import { Label } from './Label'

export const LabelCatalog = () => (
  <div className="p-6 space-x-2">
    <Label type="valido" text="Válido" />
    <Label type="invalido" text="Inválido" />
    <Label type="prohibido" text="Prohibido" />
  </div>
)
