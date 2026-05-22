import type {
  LocationPost,
  LocationPut,
  ProyectLocationType,
} from '@/app/mappings/locations/locations.types';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';

export type ProyectLocationState = {
  locations: ProyectLocationType[];
  devices: ReportDeviceView[];
  allDevices: ReportDeviceView[];
  devicesByProyect: ReportDeviceView[];
  currentDevice: ReportDeviceView | null;
  lastProyectId: string | null;
  lastLocationId: string | null;
  lastDevicesByProyectId: string | null;
  lastCurrentDeviceId: string | null;
  loadingLocations: boolean;
  loadingDevices: boolean;
  loadingAllDevices: boolean; 
  loadingDevicesByProyect: boolean;
  loadingCurrentDevice: boolean;
  error?: string;
  fetchLocations: (proyectId: string, force?: boolean)   => Promise<ProyectLocationType[] | null | undefined>
  fetchAllLocations: (force?: boolean) => Promise<ProyectLocationType[] | null | undefined>
  createLocation: (payload: LocationPost) => Promise<ProyectLocationType | null>
  updateLocation: (payload: LocationPut) => Promise<ProyectLocationType | null>
  deleteLocation: (id: string) => Promise<boolean>
  fetchDevicesByLocation: (locationId: string, force?: boolean)  => Promise<void>
  fetchDevicesByProyectId: (proyectId: string, force?: boolean) => Promise<void>;
  fetchDeviceById: (deviceId: string, force?: boolean) => Promise<ReportDeviceView | null>;
  fetchAllDevices: (force?: boolean) => Promise<void>;
  reset: () => void;
  resetFlags: () => void;
};

export type SetProyectLocation = (
  partial: Partial<ProyectLocationState> | ((state: ProyectLocationState) => Partial<ProyectLocationState>)
) => void;
export type GetProyectLocation = () => ProyectLocationState;
