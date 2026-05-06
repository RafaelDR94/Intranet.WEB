import { DeviceExternalView } from "@/app/mappings/devices/devices.types";
import { FormValues } from "../types";
export const initialFormState = {
  brand: '',
  model: '',
  serialnumber: '',
};


export const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
};

export const resolveExternalView = (device: DeviceExternalView | null | undefined) => {
  const raw = (device as any)?.device_external_view ?? device ?? {};
  return {
    brand: raw?.brand ? String(raw.brand) : '',
    model: raw?.model ? String(raw.model) : '',
    serialnumber: raw?.serialnumber ? String(raw.serialnumber) : '',
    fullInformation: raw?.fullInformation ? String(raw.fullInformation) : '',
  };
};

export const buildDeviceLabel = (device: DeviceExternalView | null | undefined) => {
  if (!device) return 'equipo';
  const ext = resolveExternalView(device);
  const readable = [ext.brand, ext.model, ext.serialnumber]
    .filter((v) => Boolean(v && v.trim()))
    .join(' ');
  return ext.fullInformation || readable || 'equipo';
};

export const buildFormLabel = (values: FormValues) =>
  [values.brand, values.model, values.serialnumber]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');

export const normalizeId = (device: DeviceExternalView, index: number) => {
  const id = device?.id ?? (device as any)?.device_external_view?.id;
  return id != null ? String(id) : `temp-${index}`;
};
