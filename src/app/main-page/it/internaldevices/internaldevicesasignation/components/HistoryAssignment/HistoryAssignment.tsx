'use client'

import { Button } from '@/app/components/Button/Button'
import DocumentViewer from '@/app/components/DocumentViewer/DocumentViewer'
import { PopUp } from '@/app/components/PopUp/PopUp'
import UserIcon from '@/assets/icons/Users/Users/user.svg'
import ResponsiveDoc from '@/assets/icons/Docs/page.svg'

import useHistoryAssignment from './hooks/useHistoryAssignment'
import type { HistoryAssignmentProps } from './types'

const HistoryAssignment = ({
  deviceId,
  onCreateAssignment,
  showActions = true
}: HistoryAssignmentProps) => {
  const {
    confirmOpen,
    deletingDeviceAssignment,
    handleCloseResponsive,
    handleConfirmUnlink,
    handleCreateAssignment,
    handleOpenResponsive,
    hasActiveAssignment,
    loading,
    responsiveOpen,
    responsiveTitle,
    responsiveUrl,
    rows,
    setConfirmOpen
  } = useHistoryAssignment({ deviceId, onCreateAssignment })

  if (loading) {
    return <div className="text-gray-70 text-center">Cargando historial...</div>
  }

  return (
    <div className="space-y-4">
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Desvincular usuario"
        content="¿Desea desvincular el usuario del dispositivo?"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={
          deletingDeviceAssignment ? 'Desvinculando...' : 'Desvincular'
        }
        onPrimaryButtonClick={handleConfirmUnlink}
      />

      {showActions && (
        <div className="flex items-center justify-end">
          <Button
            size="small"
            variant="ghost"
            icon={UserIcon}
            onClick={() => {
              if (hasActiveAssignment) {
                setConfirmOpen(true)
                return
              }
              handleCreateAssignment()
            }}
          >
            {hasActiveAssignment ? 'Desvincular usuario' : 'Nueva Asignación'}
          </Button>
        </div>
      )}

      <div className="border-gray-20 bg-white-70 overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-left">
          <thead className="border-gray-20 border-b">
            <tr className="text-gray-90">
              <th className="text-c2 px-6 py-4 font-semibold">FECHA</th>
              <th className="text-c2 px-6 py-4 font-semibold">ASIGNADO A</th>
              <th className="text-c2 px-6 py-4 font-semibold">
                CONDICIONES DE ENTREGA
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {rows.length === 0 && (
              <tr>
                <td className="text-c2 px-6 py-5 text-center" colSpan={3}>
                  Sin asignaciones registradas.
                </td>
              </tr>
            )}
            {rows.map((assignment) => (
              <tr
                key={assignment.assignmentId}
                className="border-gray-10 border-b last:border-b-0"
              >
                <td className="text-c2 px-6 py-4">{assignment.dateLabel}</td>
                <td className="text-c2 px-6 py-4">{assignment.assignedTo}</td>
                <td className="text-c2 px-6 py-4">
                  <span className="block max-w-[280px] truncate">
                    {assignment.deliveryCondition}
                  </span>
                </td>
                <td className="text-c2 px-6 py-4">
                  <Button
                    size="small"
                    variant="ghost"
                    icon={ResponsiveDoc}
                    onClick={() => {
                      handleOpenResponsive(
                        assignment.responsiveUrl,
                        `Responsiva - ${assignment.assignedTo} - ${assignment.deviceName}`
                      )
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {responsiveOpen && responsiveUrl && (
        <DocumentViewer
          fileUrl={responsiveUrl}
          title={responsiveTitle}
          onClose={handleCloseResponsive}
        />
      )}
    </div>
  )
}

export default HistoryAssignment
