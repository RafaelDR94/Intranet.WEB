import { useCallback, useMemo, useState } from "react";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type {
  InternalDevice,
  InternalDeviceAssignment,
} from "@/app/mappings/internaldevices/internaldevices.types";
import ResponsiveDoc from "@/assets/icons/Docs/page.svg";

import type {
  InternalDeviceAssignmentRow,
  StatusFilterOption,
  StatusFilterValue,
} from "../types";
import {
  DEFAULT_STATUS_FILTER,
  INTERNAL_DEVICE_ASSIGNATION_SEARCHABLE_KEYS,
  STATUS_FILTER_OPTIONS,
  isStatusFilterValue,
  matchesStatusFilter,
  statusToLabelType,
} from "../utilities/internalDevicesAsignationTable";

type UseInternalDevicesAsignationTableParams = {
  deviceAssignments: InternalDeviceAssignment[];
  deviceById: Map<string, InternalDevice>;
  employeeById: Map<string, EmployeeType>;
  isMobile: boolean;
  onOpenDetails: (row: InternalDeviceAssignmentRow) => void;
  onOpenResponsive: (row: InternalDeviceAssignmentRow) => void;
};

type UseInternalDevicesAsignationTableResult = {
  columns: ColumnDefinition<InternalDeviceAssignmentRow>[];
  rows: InternalDeviceAssignmentRow[];
  searchableKeys: (keyof InternalDeviceAssignmentRow)[];
  statusFilter: StatusFilterValue;
  statusFilterOptions: StatusFilterOption[];
  handleStatusFilterChange: (value: string) => void;
};

/**
 * Encapsulates table state, columns, and filtering for internal devices asignation list.
 */
const useInternalDevicesAsignationTable = ({
  deviceAssignments,
  deviceById,
  employeeById,
  isMobile,
  onOpenDetails,
  onOpenResponsive,
}: UseInternalDevicesAsignationTableParams): UseInternalDevicesAsignationTableResult => {
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    DEFAULT_STATUS_FILTER,
  );

  const rows = useMemo<InternalDeviceAssignmentRow[]>(
    () =>
      deviceAssignments.map((assignment, index) => {
        const device = deviceById.get(assignment.device_id);
        const employee = employeeById.get(assignment.employee_id);
        return {
          id: assignment.device_assigment_id || String(index + 1),
          assignment_id: assignment.device_assigment_id || "",
          device_id: assignment.device_id ?? null,
          display_id: String(index + 1).padStart(3, "0"),
          device_status: device?.device_status ?? null,
          device_type: device?.device_type ?? null,
          device_brand: device?.device_brand ?? null,
          model: device?.model ?? "",
          serial_number: device?.serial_number ?? "",
          name: device?.name ?? "",
          assigned_to: employee?.fullname ?? assignment.employee_id ?? "-",
          responsive_url: assignment.responsive_url ?? null,
        };
      }),
    [deviceAssignments, deviceById, employeeById],
  );

  const columnsDesktop = useMemo<
    ColumnDefinition<InternalDeviceAssignmentRow>[]
  >(
    () => [
      {
        key: "display_id",
        label: "ID",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
      },
      {
        key: "device_status",
        label: "ESTATUS",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
        render: (row) => (
          <Label
            type={statusToLabelType(row.device_status?.name)}
            text={row.device_status?.name ?? "SIN ESTATUS"}
          />
        ),
      },
      {
        key: "device_type",
        label: "DISPOSITIVO",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
        render: (row) => row.device_type?.name ?? "-",
      },
      {
        key: "device_brand",
        label: "MARCA",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
        render: (row) => row.device_brand?.name ?? "-",
      },
      {
        key: "model",
        label: "MODELO",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "serial_number",
        label: "No. SERIE",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "name",
        label: "NOMBRE",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "assigned_to",
        label: "ASIGNADO A",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
        render: (row) => row.assigned_to ?? "-",
      },
      {
        key: "responsive_url",
        label: "RESPONSIVA",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
        render: (row) => (
          <Button
            size="small"
            variant="ghost"
            icon={ResponsiveDoc}
            onClick={() => onOpenResponsive(row)}
          />
        ),
      },
      {
        key: "is_active",
        label: "ESTADO ASIGNACIÓN",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
        render: (row) => (
          <Label
            type={row.is_active ? "valido" : "restringido"}
            text={row.is_active ? "ACTIVO" : "INACTIVO"}
          />
        ),
      },
      {
        key: "assignment_id",
        label: "",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
        render: (row) => (
          <div data-tour="internaldevices-asignation-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => onOpenDetails(row)}
              permissions={{ details: true, delete: false, update: false }}
            />
          </div>
        ),
      },
    ],
    [onOpenDetails, onOpenResponsive],
  );

  const columnsMobile = useMemo<
    ColumnDefinition<InternalDeviceAssignmentRow>[]
  >(
    () => [
      {
        key: "display_id",
        label: "ID",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "name",
        label: "DISPOSITIVO",
        cellClass: "w-4/12",
        headerClass: "w-4/12",
      },
      {
        key: "assigned_to",
        label: "ASIGNADO A",
        cellClass: "w-3/12",
        headerClass: "w-3/12",
        render: (row) => row.assigned_to ?? "-",
      },
      {
        key: "assignment_id",
        label: "",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
        render: (row) => (
          <div data-tour="internaldevices-asignation-row-actions">
            <ActionMenuCell
              row={row}
              onDetails={() => onOpenDetails(row)}
              permissions={{ details: true, delete: false, update: false }}
            />
          </div>
        ),
      },
    ],
    [onOpenDetails],
  );

  const columns = isMobile ? columnsMobile : columnsDesktop;

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        matchesStatusFilter(row.device_status?.name ?? null, statusFilter),
      ),
    [rows, statusFilter],
  );

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(isStatusFilterValue(value) ? value : DEFAULT_STATUS_FILTER);
  }, []);

  return {
    columns,
    rows: filteredRows,
    searchableKeys: INTERNAL_DEVICE_ASSIGNATION_SEARCHABLE_KEYS,
    statusFilter,
    statusFilterOptions: STATUS_FILTER_OPTIONS,
    handleStatusFilterChange,
  };
};

export default useInternalDevicesAsignationTable;
