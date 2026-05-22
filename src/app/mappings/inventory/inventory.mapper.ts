import type {
  GenericEquipment,
  GenericEquipmentPost,
  GenericEquipmentPut,
  GenericEquipmentSparePart,
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
): GenericEquipmentPost => {
  const sparePartIds = src?.idSpareParts ?? src?.idspareparts ?? src?.id_spare_parts;

  return {
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
    idSpareParts: Array.isArray(sparePartIds)
      ? sparePartIds.map((id: unknown) => String(id))
      : [],
  };
};

export const mapGenericEquipmentPut = (
  src: Partial<GenericEquipmentPut> | any
): GenericEquipmentPut => {
  const sparePartIds = src?.idSpareParts ?? src?.idspareparts ?? src?.id_spare_parts;

  return {
    id: String(src?.id ?? ""),
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
    createdBy: String(src?.createdBy ?? ""),
    idSpareParts: Array.isArray(sparePartIds)
      ? sparePartIds.map((id: unknown) => String(id))
      : [],
  };
};

export const mapSparePart = (raw: any): SparePart => {
  const supplierIds = raw?.idSuppliers ?? raw?.idsuppliers;
  const genericEquipmentIds = raw?.idGenericEquipments ?? raw?.idgenericequipments;
  const embeddedSuppliers = raw?.suppliers ?? raw?.Suppliers;
  const embeddedGenericEquipments = raw?.genericEquipments ?? raw?.GenericEquipments;

  return {
  id: String(
    raw?.id ??
      raw?.Id ??
      raw?.idSparePart ??
      raw?.idsparePart ??
      raw?.idsparepart ??
      ""
  ),
  sku: String(
    raw?.sku ??
      raw?.partNumber ??
      raw?.partnumber ??
      raw?.numeroParte ??
      raw?.numeroparte ??
      ""
  ),
  stock: Number(raw?.stock ?? 0),
  name: String(
    raw?.name ??
      raw?.description ??
      raw?.descripcion ??
      raw?.characteristic ??
      raw?.nombre ??
      ""
  ),
  brand: String(raw?.brand ?? raw?.marca ?? ""),
  model: String(raw?.model ?? raw?.modelo ?? ""),
  serialNumber: String(
    raw?.serialNumber ??
      raw?.serialnumber ??
      raw?.serialOrPart ??
      raw?.serialorpart ??
      raw?.numeroSerie ??
      raw?.numeroserie ??
      ""
  ),
  characteristic: String(
    raw?.characteristic ??
      raw?.description ??
      raw?.descripcion ??
      raw?.equipment ??
      raw?.equipo ??
      ""
  ),
  provider: String(raw?.provider ?? ""),
  website: String(raw?.website ?? ""),
  phoneNumber: String(raw?.phoneNumber ?? raw?.phonenumber ?? ""),
  idSuppliers: Array.isArray(supplierIds)
    ? supplierIds.map((id: unknown) => String(id))
    : [],
  idGenericEquipments: Array.isArray(genericEquipmentIds)
    ? genericEquipmentIds.map((id: unknown) => String(id))
    : [],
  suppliers: Array.isArray(embeddedSuppliers)
    ? embeddedSuppliers.map((supplierRaw: any) => ({
        id: String(supplierRaw?.id ?? ""),
        nombreProveedor: String(
          supplierRaw?.nombreProveedor ?? supplierRaw?.nombreproveedor ?? supplierRaw?.supplierName ?? ""
        ),
        paginaWeb: String(
          supplierRaw?.paginaWeb ?? supplierRaw?.paginaweb ?? supplierRaw?.website ?? ""
        ),
        telefono: String(
          supplierRaw?.telefono ??
            supplierRaw?.phonenumber ??
            supplierRaw?.phoneumber ??
            supplierRaw?.phoneNumber ??
            ""
        ),
      }))
    : [],
  genericEquipments: Array.isArray(embeddedGenericEquipments)
    ? embeddedGenericEquipments.map((equipmentRaw: any) => ({
        id: String(equipmentRaw?.id ?? ""),
        typeOfEquipment: String(
          equipmentRaw?.typeOfEquipment ??
            equipmentRaw?.typeofEquipment ??
            equipmentRaw?.typeequipment ??
            equipmentRaw?.equipmentType ??
            equipmentRaw?.name ??
            ""
        ),
        brand: String(equipmentRaw?.brand ?? ""),
        model: String(equipmentRaw?.model ?? ""),
        createdBy: String(equipmentRaw?.createdBy ?? ""),
        isActive:
          typeof equipmentRaw?.isActive === "boolean" ? equipmentRaw.isActive : undefined,
      }))
    : [],
  isActive:
    typeof raw?.isActive === "boolean" ? raw.isActive : undefined,
  };
};

export const mapSpareParts = (list: any[]): SparePart[] =>
  Array.isArray(list) ? list.map(mapSparePart) : [];

export const mapSparePartPost = (
  src: Partial<SparePartPost> | any
): SparePartPost => {
  const supplierIds = src?.idSuppliers ?? src?.idsuppliers;
  const genericEquipmentIds = src?.idGenericEquipments ?? src?.idgenericequipments;

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
  idGenericEquipments: Array.isArray(genericEquipmentIds)
    ? genericEquipmentIds.map((id: unknown) => String(id))
    : [],
  };
};

export const mapSparePartPut = (
  src: Partial<SparePartPut> | any
): SparePartPut => {
  const supplierIds = src?.idSuppliers ?? src?.idsuppliers;
  const genericEquipmentIds = src?.idGenericEquipments ?? src?.idgenericequipments;

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
  idGenericEquipments: Array.isArray(genericEquipmentIds)
    ? genericEquipmentIds.map((id: unknown) => String(id))
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
