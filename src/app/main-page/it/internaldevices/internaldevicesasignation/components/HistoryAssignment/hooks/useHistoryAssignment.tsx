import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { InternalDeviceAssignmentHistory } from "@/app/mappings/internaldevices/internaldevices.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useInternalDevicesStore } from "@/app/stores/useInternalDevicesStore/useInternalDevicesStore";

import type { HistoryAssignmentProps, HistoryAssignmentRow } from "../types";

type UnlinkModalStep = "details" | "confirmation";

type DeviceStatusOption = {
  label: string;
  value: string;
};

const formatAssignmentDate = (
  assignment: InternalDeviceAssignmentHistory,
): string => {
  const rawDate = assignment.date ?? assignment.created_at;
  if (!rawDate) return "-";

  const onlyDate = rawDate.split("T")[0];
  const [year, month, day] = onlyDate.split("-");
  if (!year || !month || !day) return "-";

  return `${day}/${month}/${year}`;
};

/**
 * Encapsulates state, data fetching, and handlers for HistoryAssignment.
 */
const useHistoryAssignment = ({
  deviceId,
  onCreateAssignment,
}: HistoryAssignmentProps) => {
  const { updateQuery } = useQuery();
  const { user, currentPagePermissions } = useAuth();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const {
    deviceAssignmentHistory,
    loadingDeviceAssignmentHistory,
    fetchDeviceAssignmentHistoryByDeviceId,
    deleteDeviceAssignment,
    deletingDeviceAssignment,
    fetchDeviceAssignments,
    deviceAssignments,
    deviceAssignment,
    deviceStatuses,
    fetchDeviceStatuses,
    error,
  } = useInternalDevicesStore(
    (state) => ({
      deviceAssignmentHistory: state.deviceAssignmentHistory,
      loadingDeviceAssignmentHistory: state.loadingDeviceAssignmentHistory,
      fetchDeviceAssignmentHistoryByDeviceId:
        state.fetchDeviceAssignmentHistoryByDeviceId,
      deleteDeviceAssignment: state.deleteDeviceAssignment,
      deletingDeviceAssignment: state.deletingDeviceAssignment,
      fetchDeviceAssignments: state.fetchDeviceAssignments,
      deviceAssignments: state.deviceAssignments,
      deviceAssignment: state.deviceAssignment,
      deviceStatuses: state.deviceStatuses,
      fetchDeviceStatuses: state.fetchDeviceStatuses,
      error: state.error,
    }),
    shallow,
  );

  const { activeEmployees, loadingActive, fetchActiveEmployees } =
    useEmployeesStore(
      (state) => ({
        activeEmployees: state.activeEmployees,
        loadingActive: state.loadingActive,
        fetchActiveEmployees: state.fetchActiveEmployees,
      }),
      shallow,
    );

  useEffect(() => {
    if (!deviceId) return;
    void fetchDeviceAssignmentHistoryByDeviceId(deviceId, true);
    if (!activeEmployees.length) {
      void fetchActiveEmployees(true);
    }
    if (!deviceAssignments.length) {
      void fetchDeviceAssignments(true);
    }
    if (!deviceStatuses.length) {
      void fetchDeviceStatuses(true);
    }
  }, [
    deviceId,
    activeEmployees.length,
    fetchActiveEmployees,
    fetchDeviceAssignmentHistoryByDeviceId,
    deviceAssignments.length,
    fetchDeviceAssignments,
    deviceStatuses.length,
    fetchDeviceStatuses,
  ]);

  const employeeById = useMemo(() => {
    const entries = activeEmployees
      .map((employee) => {
        const key = employee.employee_id || employee.id;
        return key ? ([key, employee] as const) : null;
      })
      .filter(
        (entry): entry is readonly [string, EmployeeType] => entry !== null,
      );
    return new Map<string, EmployeeType>(entries);
  }, [activeEmployees]);

  const responsiveByAssignmentId = useMemo(() => {
    const entries = deviceAssignments.map(
      (assignment) =>
        [
          assignment.device_assigment_id,
          assignment.responsive_url ?? null,
        ] as const,
    );
    return new Map<string, string | null>(entries);
  }, [deviceAssignments]);

  const rows = useMemo<HistoryAssignmentRow[]>(
    () =>
      (deviceAssignmentHistory ?? []).map((assignment) => {
        const employee =
          assignment.assigned_to ??
          employeeById.get(assignment.employee_id)?.fullname ??
          assignment.employee_id ??
          "-";
        return {
          assignmentId: assignment.device_assigment_id,
          dateLabel: formatAssignmentDate(assignment),
          assignedTo: employee,
          deviceName:
            assignment.devicename || assignment.model || assignment.device_id,
          deliveryCondition: assignment.delivery_condition || "Sin condiciones",
          responsiveUrl: responsiveByAssignmentId.get(
            assignment.device_assigment_id,
          ),
        };
      }),
    [deviceAssignmentHistory, employeeById, responsiveByAssignmentId],
  );

  const [unlinkModalStep, setUnlinkModalStep] =
    useState<UnlinkModalStep | null>(null);
  const [unlinkMotive, setUnlinkMotive] = useState("");
  const [unlinkStatusId, setUnlinkStatusId] = useState("");
  const [responsiveOpen, setResponsiveOpen] = useState(false);
  const [responsiveUrl, setResponsiveUrl] = useState<string | null>(null);
  const [responsiveTitle, setResponsiveTitle] = useState<string>("");

  const hasActiveAssignment = Boolean(
    deviceAssignment?.device_assigment_id &&
      deviceAssignment.device_id &&
      deviceAssignment.device_id === deviceId,
  );

  const statusOptions = useMemo<DeviceStatusOption[]>(
    () =>
      deviceStatuses.map((status) => ({
        label: status.name,
        value: status.device_status_id,
      })),
    [deviceStatuses],
  );

  const closeUnlinkModal = useCallback(() => {
    setUnlinkModalStep(null);
    setUnlinkMotive("");
    setUnlinkStatusId("");
  }, []);

  const openUnlinkModal = useCallback(() => {
    setUnlinkModalStep("details");
  }, []);

  const handleNextUnlinkStep = useCallback(() => {
    if (!unlinkMotive.trim() || !unlinkStatusId) {
      showAlert({
        type: "warning",
        title: "Datos incompletos",
        description:
          "Escribe el motivo y selecciona el estatus del dispositivo.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      return;
    }

    setUnlinkModalStep("confirmation");
  }, [showAlert, unlinkMotive, unlinkStatusId]);

  const handleCreateAssignment = useCallback(() => {
    if (!currentPagePermissions?.createDeviceAssignment) return;
    if (onCreateAssignment) {
      onCreateAssignment();
      return;
    }
    updateQuery({ view: "new" });
  }, [onCreateAssignment, updateQuery]);

  const handleConfirmUnlink = useCallback(async () => {
    if (!currentPagePermissions?.unlinkDeviceAssignment) return;
    if (
      !deviceAssignment?.device_assigment_id ||
      !deviceAssignment.device_id ||
      deviceAssignment.device_id !== deviceId
    ) {
      return;
    }
    if (!user?.idEmployee) {
      showAlert({
        type: "warning",
        title: "Usuario no disponible",
        description: "No se encontro el usuario que realiza la operacion.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      return;
    }

    showSpinner({ message: "Desvinculando usuario..." });
    const ok = await deleteDeviceAssignment({
      device_assignment_id: deviceAssignment.device_assigment_id,
      device_status_id: unlinkStatusId,
      delivery_condition: unlinkMotive.trim(),
      id_employee: user.idEmployee,
    });

    if (!ok) {
      hideSpinner();
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error ?? "No se pudo desvincular al usuario.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      return;
    }

    hideSpinner();
    closeUnlinkModal();
    showAlert({
      type: "info",
      title: "Usuario desvinculado",
      description: "El dispositivo quedo disponible para una nueva asignación.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1200,
    });

    if (deviceId) {
      await fetchDeviceAssignmentHistoryByDeviceId(deviceId, true);
    }
    await fetchDeviceAssignments(true);
  }, [
    deleteDeviceAssignment,
    deviceAssignment?.device_assigment_id,
    deviceAssignment?.device_id,
    deviceId,
    error,
    fetchDeviceAssignmentHistoryByDeviceId,
    fetchDeviceAssignments,
    hideSpinner,
    closeUnlinkModal,
    showAlert,
    showSpinner,
    unlinkMotive,
    unlinkStatusId,
    user?.idEmployee,
  ]);

  const handleOpenResponsive = useCallback(
    (url?: string | null, title?: string) => {
      if (!currentPagePermissions?.viewResponsive) return;
      if (!url) {
        showAlert({
          type: "warning",
          title: "Responsiva no disponible",
          description: "No se encontro una responsiva para esta asignacion.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
        return;
      }
      setResponsiveUrl(url);
      setResponsiveTitle(title ?? "Responsiva de asignacion");
      setResponsiveOpen(true);
    },
    [showAlert],
  );

  const handleCloseResponsive = useCallback(() => {
    setResponsiveOpen(false);
    setResponsiveUrl(null);
  }, []);

  return {
    closeUnlinkModal,
    deletingDeviceAssignment,
    handleCloseResponsive,
    handleConfirmUnlink,
    handleCreateAssignment,
    handleNextUnlinkStep,
    handleOpenResponsive,
    hasActiveAssignment,
    loading: loadingDeviceAssignmentHistory || loadingActive,
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
  };
};

export default useHistoryAssignment;
