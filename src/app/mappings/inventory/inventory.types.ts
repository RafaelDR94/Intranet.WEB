export type GenericEquipment = {
  id: string;
  typeOfEquipment: string;
  brand: string;
  model: string;
  createdBy: string;
  isActive?: boolean;
};

export type GenericEquipmentPost = {
  typeOfEquipment: string;
  brand: string;
  model: string;
};

export type GenericEquipmentPut = {
  id: string;
  typeOfEquipment: string;
  brand: string;
  model: string;
  createdBy: string;
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
  provider: string;
  website: string;
  phoneNumber: string;
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
  provider: string;
  website: string;
  phoneNumber: string;
};

export type GenericEquipmentSparePart = {
  id: string;
  idGenericEquipment: string;
  idSparePart: string;
  isActive?: boolean;
};

export type GenericEquipmentSparePartPost = {
  idGenericEquipment: string;
  idSparePart: string;
};

export type GenericEquipmentSparePartPut = {
  id: string;
  idGenericEquipment: string;
  idSparePart: string;
};
