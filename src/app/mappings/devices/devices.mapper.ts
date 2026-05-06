import { DeviceExternalView } from "./devices.types";

export const mapDeviceExternal = (dev: any): DeviceExternalView => ({
  id: dev?.id,
  brand: dev?.brand,
  model: dev?.model,
  serialnumber: dev?.serialnumber,
  idGenericEquipment: dev?.idGenericEquipment ?? dev?.idgenericEquipment ?? null,
  idproyect: dev.idproyect,
  keyproyect: dev.keyproyect,
  idlocation: dev.idlocation,
  locationname: dev.locationname,
  is_active: dev.is_active
});
