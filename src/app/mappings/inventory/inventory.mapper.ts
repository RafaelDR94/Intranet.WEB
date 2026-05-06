import type {
  GenericEquipment,
  GenericEquipmentPost,
  GenericEquipmentPut,
  GenericEquipmentSparePart,
  GenericEquipmentSparePartPost,
  GenericEquipmentSparePartPut,
  SparePart,
  SparePartPost,
  SparePartPut,
} from "./inventory.types";

export const mapGenericEquipment = (raw: any): GenericEquipment => ({
  id: String(raw?.id ?? ""),
  typeOfEquipment: String(raw?.typeOfEquipment ?? raw?.typeofEquipment ?? ""),
  brand: String(raw?.brand ?? ""),
  model: String(raw?.model ?? ""),
  createdBy: String(raw?.createdBy ?? ""),
  isActive:
    typeof raw?.isActive === "boolean" ? raw.isActive : undefined,
});

export const mapGenericEquipments = (list: any[]): GenericEquipment[] =>
  Array.isArray(list) ? list.map(mapGenericEquipment) : [];

export const mapGenericEquipmentPost = (
  src: Partial<GenericEquipmentPost> | any
): GenericEquipmentPost => ({
  typeOfEquipment: String(src?.typeOfEquipment ?? src?.typeofEquipment ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
});

export const mapGenericEquipmentPut = (
  src: Partial<GenericEquipmentPut> | any
): GenericEquipmentPut => ({
  id: String(src?.id ?? ""),
  typeOfEquipment: String(src?.typeOfEquipment ?? src?.typeofEquipment ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
  createdBy: String(src?.createdBy ?? ""),
});

export const mapSparePart = (raw: any): SparePart => ({
  id: String(raw?.id ?? ""),
  sku: String(raw?.sku ?? ""),
  stock: Number(raw?.stock ?? 0),
  name: String(raw?.name ?? ""),
  brand: String(raw?.brand ?? ""),
  model: String(raw?.model ?? ""),
  serialNumber: String(raw?.serialNumber ?? raw?.serialnumber ?? ""),
  characteristic: String(raw?.characteristic ?? ""),
  provider: String(raw?.provider ?? ""),
  website: String(raw?.website ?? ""),
  phoneNumber: String(raw?.phoneNumber ?? raw?.phonenumber ?? ""),
  isActive:
    typeof raw?.isActive === "boolean" ? raw.isActive : undefined,
});

export const mapSpareParts = (list: any[]): SparePart[] =>
  Array.isArray(list) ? list.map(mapSparePart) : [];

export const mapSparePartPost = (
  src: Partial<SparePartPost> | any
): SparePartPost => ({
  sku: String(src?.sku ?? ""),
  stock: Number(src?.stock ?? 0),
  name: String(src?.name ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
  serialNumber: String(src?.serialNumber ?? src?.serialnumber ?? ""),
  characteristic: String(src?.characteristic ?? ""),
  provider: String(src?.provider ?? ""),
  website: String(src?.website ?? ""),
  phoneNumber: String(src?.phoneNumber ?? src?.phonenumber ?? ""),
});

export const mapSparePartPut = (
  src: Partial<SparePartPut> | any
): SparePartPut => ({
  id: String(src?.id ?? ""),
  sku: String(src?.sku ?? ""),
  stock: Number(src?.stock ?? 0),
  name: String(src?.name ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
  serialNumber: String(src?.serialNumber ?? src?.serialnumber ?? ""),
  characteristic: String(src?.characteristic ?? ""),
  provider: String(src?.provider ?? ""),
  website: String(src?.website ?? ""),
  phoneNumber: String(src?.phoneNumber ?? src?.phonenumber ?? ""),
});

export const mapGenericEquipmentSparePart = (
  raw: any
): GenericEquipmentSparePart => ({
  id: String(raw?.id ?? ""),
  idGenericEquipment: String(
    raw?.idGenericEquipment ?? raw?.idgenericEquipment ?? ""
  ),
  idSparePart: String(raw?.idSparePart ?? raw?.idsparePart ?? ""),
  isActive:
    typeof raw?.isActive === "boolean" ? raw.isActive : undefined,
});

export const mapGenericEquipmentSpareParts = (
  list: any[]
): GenericEquipmentSparePart[] =>
  Array.isArray(list) ? list.map(mapGenericEquipmentSparePart) : [];

export const mapGenericEquipmentSparePartPost = (
  src: Partial<GenericEquipmentSparePartPost> | any
): GenericEquipmentSparePartPost => ({
  idGenericEquipment: String(
    src?.idGenericEquipment ?? src?.idgenericEquipment ?? ""
  ),
  idSparePart: String(src?.idSparePart ?? src?.idsparePart ?? ""),
});

export const mapGenericEquipmentSparePartPut = (
  src: Partial<GenericEquipmentSparePartPut> | any
): GenericEquipmentSparePartPut => ({
  id: String(src?.id ?? ""),
  idGenericEquipment: String(
    src?.idGenericEquipment ?? src?.idgenericEquipment ?? ""
  ),
  idSparePart: String(src?.idSparePart ?? src?.idsparePart ?? ""),
});
