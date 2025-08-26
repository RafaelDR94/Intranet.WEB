import { CategoriesType ,TypesOfReportType,ReportDeviceView} from "./reports.types";
import { DeviceExternalView } from "../devices/devices.types";

export const mapTypeReport = (type: any): TypesOfReportType => ({
  id: type?.id,
  name: type?.name,
  description: type?.description,
});

export const mapTypesOfReports = (types: any[]): TypesOfReportType[] =>
  types.map(mapTypeReport);

export const mapDeviceExternal = (dev: any): DeviceExternalView => ({
  id: dev?.id,
  brand: dev?.brand,
  model: dev?.model,
  serialnumber: dev?.serialnumber,
  fullInformation: dev?.fullInformation,
});

export const mapReportDevicesExternal = (devices: any[]): ReportDeviceView[] =>
  devices.map((dev: any) => ({
    id: dev?.id,
    device_external_view: mapDeviceExternal(dev?.device_external_view),
  }));
export const mapCategory = (category: any): CategoriesType => ({
  id: category?.id,
  name: category?.name,
  typesofreports: mapTypeReport(category?.typesofreports),
});

export const mapCategories = (categories: any[]): CategoriesType[] =>
  categories.map(mapCategory);
