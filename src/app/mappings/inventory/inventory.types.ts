export type GenericEquipment = {
  id: string;
  typeOfEquipment: string;
  brand: string;
  model: string;
  createdBy: string;
  isActive?: boolean;
};

export type GenericEquipmentPost = {
  name?: string;
  typeOfEquipment?: string;
  brand: string;
  model: string;
  idSpareParts: string[];
};

export type GenericEquipmentPut = {
  id: string;
  name: string;
  brand: string;
  model: string;
  createdBy: string;
  idSpareParts: string[];
};

export type SparePart = {
  id: string;
  sku: string;
  stock: number;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  characteristic: string;
  provider: string;
  website: string;
  phoneNumber: string;
  idSuppliers?: string[];
  idGenericEquipments?: string[];
  suppliers?: Supplier[];
  genericEquipments?: GenericEquipment[];
  isActive?: boolean;
};

export type SparePartPost = {
  sku: string;
  stock: number;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  characteristic: string;
  website: string;
  phoneNumber: string;
  idSuppliers: string[];
  idGenericEquipments: string[];
};

export type SparePartPut = {
  id: string;
  sku: string;
  stock: number;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  characteristic: string;
  website: string;
  phoneNumber: string;
  idSuppliers: string[];
  idGenericEquipments: string[];
};

export type GenericEquipmentSparePart = {
  id: string;
  idGenericEquipment: string;
  idSparePart: string;
  isActive?: boolean;
};

export type Supplier = {
  id: string;
  nombreProveedor: string;
  paginaWeb: string;
  telefono: string;
};

export type SupplierPost = {
  supplierName: string;
  website: string;
  phonenumber: string;
  nombreProveedor?: string;
  paginaWeb?: string;
  telefono?: string;
};

export type SupplierPut = {
  id: string;
  supplierName: string;
  website: string;
  phonenumber: string;
  nombreProveedor?: string;
  paginaWeb?: string;
  telefono?: string;
};
