"use client";

import { Button } from "@/app/components/Button/Button";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import DocumentViewer from "@/app/components/DocumentViewer/DocumentViewer";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import UserIcon from "@/assets/icons/Users/Users/user.svg";
import ResponsiveDoc from "@/assets/icons/Docs/page.svg";

import useHistoryAssignment from "./hooks/useHistoryAssignment";
import type { HistoryAssignmentProps } from "./types";

const HistoryAssignment = ({
  deviceId,
  onCreateAssignment,
  showActions = true,
}: HistoryAssignmentProps) => {
  const { currentPagePermissions } = useAuth();
  const {
    closeUnlinkModal,
    deletingDeviceAssignment,
    handleCloseResponsive,
    handleConfirmUnlink,
    handleCreateAssignment,
    handleNextUnlinkStep,
    handleOpenResponsive,
    hasActiveAssignment,
    loading,
    openUnlinkModal,
    responsiveOpen,
    responsiveTitle,
    responsiveUrl,
    rows,
    setUnlinkMotive,
    setUnlinkStatusId,
    statusOptions,
    unlinkModalStep,
    unlinkMotive,
    unlinkStatusId,
  } = useHistoryAssignment({ deviceId, onCreateAssignment });

  if (loading) {
    return (
      <div className="text-gray-70 text-center">Cargando historial...</div>
    );
  }

  return (
    <div className="space-y-4">
      <PopUp
        open={unlinkModalStep === "details"}
        onClose={closeUnlinkModal}
        title="Desvincular usuario"
        content={
          "Escribe aqu\u00ed los motivos por la que se entrega el dispositivo y selecciona el estatus del mismo"
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={closeUnlinkModal}
        showPrimaryButton
        primaryButtonText="Siguiente"
        onPrimaryButtonClick={handleNextUnlinkStep}
      >
        <div className="flex flex-col gap-5">
          <input
            type="text"
            value={unlinkMotive}
            onChange={(event) => setUnlinkMotive(event.target.value)}
            placeholder={"Descripci\u00f3n de motivos de entrega"}
            className="text-gray-70 bg-white-100 text-c2 focus:border-green-80 h-9 w-full rounded-lg border border-gray-50 px-3 outline-none placeholder:text-gray-50"
          />
          <Select
            options={statusOptions}
            selected={unlinkStatusId ? [unlinkStatusId] : []}
            onChange={(values) => setUnlinkStatusId(values[0] ?? "")}
            placeholder="Estatus del dispositivo"
            triggerClassName="h-9 rounded-lg border-gray-50 bg-white-100 text-c2"
          />
        </div>
      </PopUp>

      <PopUp
        open={unlinkModalStep === "confirmation"}
        onClose={closeUnlinkModal}
        title="Desvincular usuario"
        content={"\u00bfDesea desvincular el usuario del dispositivo?"}
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={closeUnlinkModal}
        showPrimaryButton
        primaryButtonText={
          deletingDeviceAssignment ? "Desvinculando..." : "Aceptar"
        }
        onPrimaryButtonClick={handleConfirmUnlink}
      />

      {showActions && (currentPagePermissions?.createDeviceAssignment || currentPagePermissions?.unlinkDeviceAssignment) && (
        <div className="flex items-center justify-end">
          <Button
            size="small"
            variant="ghost"
            icon={UserIcon}
            onClick={() => {
              if (hasActiveAssignment) {
                openUnlinkModal();
                return;
              }
              handleCreateAssignment();
            }}
          >
            {hasActiveAssignment ? "Desvincular usuario" : "Nueva Asignación"}
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
                  {currentPagePermissions?.viewResponsive && <Button
                    size="small"
                    variant="ghost"
                    icon={ResponsiveDoc}
                    onClick={() => {
                      handleOpenResponsive(
                        assignment.responsiveUrl,
                        `Responsiva - ${assignment.assignedTo} - ${assignment.deviceName}`,
                      );
                    }}
                  />}
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
  );
};

export default HistoryAssignment;
