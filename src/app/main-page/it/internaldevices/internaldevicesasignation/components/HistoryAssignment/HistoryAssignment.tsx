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
  showActions = true,
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
    setConfirmOpen,
  } = useHistoryAssignment({ deviceId, onCreateAssignment })

  if (loading) {
    return <div className="text-center text-gray-70">Cargando historial...</div>
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

      <div className="overflow-hidden rounded-2xl border border-gray-20 bg-white-70 shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-gray-20">
            <tr className="text-gray-90">
              <th className="px-6 py-4 text-c2 font-semibold">FECHA</th>
              <th className="px-6 py-4 text-c2 font-semibold">ASIGNADO A</th>
              <th className="px-6 py-4 text-c2 font-semibold">
                CONDICIONES DE ENTREGA
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-70">
            {rows.length === 0 && (
              <tr>
                <td className="px-6 py-5 text-center text-c2" colSpan={3}>
                  Sin asignaciones registradas.
                </td>
              </tr>
            )}
            {rows.map((assignment) => (
              <tr
                key={assignment.assignmentId}
                className="border-b border-gray-10 last:border-b-0"
              >
                <td className="px-6 py-4 text-c2">{assignment.dateLabel}</td>
                <td className="px-6 py-4 text-c2">{assignment.assignedTo}</td>
                <td className="px-6 py-4 text-c2">
                  <span className="block max-w-[280px] truncate">
                    {assignment.deliveryCondition}
                  </span>
                </td>
                <td className="px-6 py-4 text-c2">
                  <Button
                    size="small"
                    variant="ghost"
                    icon={ResponsiveDoc}
                    onClick={() => {
                      handleOpenResponsive(
                        assignment.responsiveUrl,
                        `Responsiva ${assignment.dateLabel}`,
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
