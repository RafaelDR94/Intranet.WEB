import type {
  GenericEquipment,
  GenericEquipmentPost,
  GenericEquipmentPut,
  GenericEquipmentSparePart,
  GenericEquipmentSparePartPost,
  GenericEquipmentSparePartPut,
  Supplier,
  SupplierPost,
  SupplierPut,
  SparePart,
  SparePartPost,
  SparePartPut,
} from "./inventory.types";

export const mapGenericEquipment = (raw: any): GenericEquipment => ({
  id: String(raw?.id ?? ""),
  typeOfEquipment: String(
    raw?.typeOfEquipment ??
      raw?.typeofEquipment ??
      raw?.typeequipment ??
      raw?.equipmentType ??
      raw?.name ??
      ""
  ),
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
  name: String(
    src?.name ??
      src?.typeOfEquipment ??
      src?.typeofEquipment ??
      src?.typeequipment ??
      src?.equipmentType ??
      ""
  ),
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
): SparePartPost => {
  const supplierIds = src?.idSuppliers ?? src?.idsuppliers;

  return {
  sku: String(src?.sku ?? ""),
  stock: Number(src?.stock ?? 0),
  name: String(src?.name ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
  serialNumber: String(src?.serialNumber ?? src?.serialnumber ?? ""),
  characteristic: String(src?.characteristic ?? ""),
  website: String(src?.website ?? ""),
  phoneNumber: String(src?.phoneNumber ?? src?.phonenumber ?? ""),
  idSuppliers: Array.isArray(supplierIds)
    ? supplierIds.map((id: unknown) => String(id))
    : [],
  };
};

export const mapSparePartPut = (
  src: Partial<SparePartPut> | any
): SparePartPut => {
  const supplierIds = src?.idSuppliers ?? src?.idsuppliers;

  return {
  id: String(src?.id ?? ""),
  sku: String(src?.sku ?? ""),
  stock: Number(src?.stock ?? 0),
  name: String(src?.name ?? ""),
  brand: String(src?.brand ?? ""),
  model: String(src?.model ?? ""),
  serialNumber: String(src?.serialNumber ?? src?.serialnumber ?? ""),
  characteristic: String(src?.characteristic ?? ""),
  website: String(src?.website ?? ""),
  phoneNumber: String(src?.phoneNumber ?? src?.phonenumber ?? ""),
  idSuppliers: Array.isArray(supplierIds)
    ? supplierIds.map((id: unknown) => String(id))
    : [],
  };
};

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
): GenericEquipmentSparePartPost => {
  const sparePartValue = src?.idSparePart ?? src?.idsparePart;

  return {
    idGenericEquipment: String(
      src?.idGenericEquipment ?? src?.idgenericEquipment ?? ""
    ),
    idSparePart: Array.isArray(sparePartValue)
      ? sparePartValue.map((id: unknown) => String(id))
      : String(sparePartValue ?? ""),
  };
};

export const mapGenericEquipmentSparePartPut = (
  src: Partial<GenericEquipmentSparePartPut> | any
): GenericEquipmentSparePartPut => ({
  id: String(src?.id ?? ""),
  idGenericEquipment: String(
    src?.idGenericEquipment ?? src?.idgenericEquipment ?? ""
  ),
  idSparePart: String(src?.idSparePart ?? src?.idsparePart ?? ""),
});

export const mapSupplier = (raw: any): Supplier => ({
  id: String(raw?.id ?? ""),
  nombreProveedor: String(
    raw?.nombreProveedor ?? raw?.nombreproveedor ?? raw?.supplierName ?? ""
  ),
  paginaWeb: String(raw?.paginaWeb ?? raw?.paginaweb ?? raw?.website ?? ""),
  telefono: String(
    raw?.telefono ?? raw?.phonenumber ?? raw?.phoneumber ?? raw?.phoneNumber ?? ""
  ),
});

export const mapSuppliers = (list: any[]): Supplier[] =>
  Array.isArray(list) ? list.map(mapSupplier) : [];

export const mapSupplierPost = (
  src: Partial<SupplierPost> | any
): SupplierPost => ({
  supplierName: String(src?.supplierName ?? src?.nombreProveedor ?? src?.nombreproveedor ?? ""),
  website: String(src?.website ?? src?.paginaWeb ?? src?.paginaweb ?? ""),
  phonenumber: String(src?.phonenumber ?? src?.telefono ?? ""),
});

export const mapSupplierPut = (
  src: Partial<SupplierPut> | any
): SupplierPut => ({
  id: String(src?.id ?? ""),
  supplierName: String(src?.supplierName ?? src?.nombreProveedor ?? src?.nombreproveedor ?? ""),
  website: String(src?.website ?? src?.paginaWeb ?? src?.paginaweb ?? ""),
  phonenumber: String(src?.phonenumber ?? src?.telefono ?? ""),
});
