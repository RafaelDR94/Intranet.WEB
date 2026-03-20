import type {
  DeviceAssignmentResponsiveUrl,
  DeviceAssignmentResponsiveUrlPut,
} from "@/app/mappings/deviceAssignmentResponsiveUrl/deviceAssignmentResponsiveUrl.types";

/**
 * Estado del store para responsivas de asignacion de dispositivos.
 */
export type DeviceAssignmentResponsiveUrlState = {
  /** Responsiva actual consultada/actualizada. */
  assignmentResponsive?: DeviceAssignmentResponsiveUrl;
  /** Flags de carga. */
  updating: boolean;
  /** Flags de exito. */
  successPut: boolean;
  /** Error normalizado. */
  error?: string;
  /** Actualiza la responsiva de una asignacion. */
  updateDeviceAssignmentResponsiveUrl: (
    payload: DeviceAssignmentResponsiveUrlPut,
  ) => Promise<DeviceAssignmentResponsiveUrl | null>;
  /** Resetea el estado completo. */
  reset: () => void;
  /** Limpia flags de proceso. */
  resetFlags: () => void;
};

/** Setter de Zustand. */
export type Set = (
  partial:
    | Partial<DeviceAssignmentResponsiveUrlState>
    | ((
        s: DeviceAssignmentResponsiveUrlState,
      ) => Partial<DeviceAssignmentResponsiveUrlState>),
) => void;

/** Getter de Zustand. */
export type Get = () => DeviceAssignmentResponsiveUrlState;
