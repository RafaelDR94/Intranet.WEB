'use client'
import React from 'react'
import type { RequisitionInitialValues } from '../../components/RequisitionsForm/hooks/useRequisitionsForm'

/**
 * Manages the state of the requisitions list page and the editor modal.
 * @returns helpers to open and close the requisition editor.
 */
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
