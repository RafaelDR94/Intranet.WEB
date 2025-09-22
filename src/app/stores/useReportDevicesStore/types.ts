import type { DeviceExternalView } from '@/app/mappings/devices/devices.types';


export interface ReportDeviceCreatePayload {
  proyectLocationId?: string;
  deviceExternalId?: string;
  device_external_view?: Partial<DeviceExternalView>;
  deviceExternal?: Partial<DeviceExternalView>;
  brand?: string;
  model?: string;
  serialnumber?: string;
  fullInformation?: string;
  [key: string]: unknown;
}

export interface ReportDeviceUpdatePayload extends ReportDeviceCreatePayload {
  id: string;
}

export type ReportDevicesState = {
  devices: DeviceExternalView[];
  locationDevices: DeviceExternalView[];
  lastLocationId: string | null;
  currentDevice: DeviceExternalView | null;

  loading: boolean;
  loadingByLocation: boolean;
  creating: boolean;
  updating: boolean;
  removing: boolean;

  successGet: boolean;
  successGetByLocation: boolean;
  successPost: boolean;
  successPut: boolean;
  successDelete: boolean;

  error?: string;

  fetchDevices: (force?: boolean) => Promise<DeviceExternalView[]>;
  fetchDevicesByLocation: (locationId: string, force?: boolean) => Promise<DeviceExternalView[]>;
  createDevice: (payload: ReportDeviceCreatePayload) => Promise<DeviceExternalView | null>;
  updateDevice: (payload: ReportDeviceUpdatePayload) => Promise<DeviceExternalView | null>;
  deleteDevice: (id: string) => Promise<boolean>;
  setCurrentDevice: (device: DeviceExternalView | null) => void;
  clearCurrentDevice: () => void;

  reset: () => void;
  resetFlags: () => void;
};

export type SetReportDevicesState = (
  partial:
    | Partial<ReportDevicesState>
    | ((state: ReportDevicesState) => Partial<ReportDevicesState>)
) => void;

export type GetReportDevicesState = () => ReportDevicesState;
