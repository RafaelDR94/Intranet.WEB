import { DeviceExternalView } from "../devices/devices.types";
export type TypesOfReportType = {
  id: string;
  name: string;
  description: string;
};

export type CategoriesType = {
  id: string;
  name: string;
  typesofreports: TypesOfReportType;
};

export interface ReportDeviceView {
  id: string;
  device_external_view: DeviceExternalView;
}