import { DeviceExternalView } from "./devices.types";

export const mapDeviceExternal = (dev: any): DeviceExternalView => ({
  id: dev?.id,
  brand: dev?.brand,
  model: dev?.model,
  serialnumber: dev?.serialnumber,
  fullInformation: dev?.fullInformation,
});