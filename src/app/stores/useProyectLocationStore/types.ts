import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';

export type ProyectLocationState = {
  locations: ProyectLocationType[];
  devices: ReportDeviceView[];
  allDevices: ReportDeviceView[];
  lastProyectId: string | null;
  lastLocationId: string | null;
  loadingLocations: boolean;
  loadingDevices: boolean;
  loadingAllDevices: boolean; 
  error?: string;
  fetchLocations: (proyectId: string, force?: boolean)   => Promise<ProyectLocationType[] | null | undefined>
  fetchDevicesByLocation: (locationId: string, force?: boolean)  => Promise<void>
  fetchAllDevices: (force?: boolean) => Promise<void>;
  reset: () => void;
  resetFlags: () => void;
};

export type SetProyectLocation = (
  partial: Partial<ProyectLocationState> | ((state: ProyectLocationState) => Partial<ProyectLocationState>)
) => void;
export type GetProyectLocation = () => ProyectLocationState;
