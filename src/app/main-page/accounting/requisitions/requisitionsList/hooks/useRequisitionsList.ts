'use client'
import React from 'react'
import type { RequisitionInitialValues } from '../../components/RequisitionsForm/hooks/useRequisitionsForm'

export const useRequisitionsList = () => {
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editorInitial, setEditorInitial] = React.useState<RequisitionInitialValues | undefined>(undefined)

  const openEditor = (initial: RequisitionInitialValues) => {
    setEditorInitial(initial)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditorInitial(undefined)
  }

  return {
    editorOpen,
    editorInitial,
    openEditor,
    closeEditor,
  }
}
