'use client'
import React from 'react'
import { useRequisitionsList } from './hooks/useRequisitionsList'

// ⬇️ Formulario reutilizable
import RequisitionsForm from '../components/RequisitionsForm/RequisitionsForm'
import type { RequisitionInitialValues } from '../components/RequisitionsForm/hooks/useRequisitionsForm'

// ⬇️ Nueva tabla desacoplada
import RequisitionsTable from './componentes/RequisitionsTable/RequisitionsTable'

const RequisitionsList: React.FC = () => {
  const { editorOpen, editorInitial, openEditor, closeEditor } = useRequisitionsList()

  return editorOpen ? (
    <RequisitionsForm
      mode="edit"
      initialValues={editorInitial as RequisitionInitialValues | undefined}
      onClose={closeEditor}
    />
  ) : (
    <RequisitionsTable onEditRequest={openEditor} />
  )
}

export default RequisitionsList
