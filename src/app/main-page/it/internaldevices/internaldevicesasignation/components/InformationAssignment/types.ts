import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";

/**
 * Props for InformationAssignment component.
 */
export type InternalDeviceInformationProps = {
  device?: InternalDevice | null;
  deviceId?: string | null;
  onEdit?: () => void;
};
