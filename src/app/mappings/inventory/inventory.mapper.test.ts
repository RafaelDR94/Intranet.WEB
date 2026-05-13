import { describe, expect, it } from "vitest";

import { mapGenericEquipmentPost, mapGenericEquipmentPut, mapSparePart } from "./inventory.mapper";

describe("mapSparePart", () => {
  it("normaliza ids y campos legacy usados por refacciones del reporte", () => {
    const mapped = mapSparePart({
      idSparePart: "SP-10",
      numeroParte: "PN-77",
      descripcion: "Filtro principal",
      marca: "Bosch",
      modelo: "B-9",
      numeroSerie: "SER-77",
    });

    expect(mapped).toMatchObject({
      id: "SP-10",
      sku: "PN-77",
      name: "Filtro principal",
      brand: "Bosch",
      model: "B-9",
      serialNumber: "SER-77",
      characteristic: "Filtro principal",
    });
  });

  it("usa characteristic como descripcion visible cuando name no existe", () => {
    const mapped = mapSparePart({
      id: "SP-20",
      characteristic: "Empaque de bomba",
      partnumber: "EMP-20",
    });

    expect(mapped.name).toBe("Empaque de bomba");
    expect(mapped.sku).toBe("EMP-20");
  });

  it("incluye idSpareParts en el payload post de equipo generico", () => {
    const mapped = mapGenericEquipmentPost({
      typeOfEquipment: "NVR",
      brand: "Hikvision",
      model: "DS-7608",
      idSpareParts: ["SP-1", 2],
    });

    expect(mapped).toEqual({
      name: "NVR",
      brand: "Hikvision",
      model: "DS-7608",
      idSpareParts: ["SP-1", "2"],
    });
  });

  it("incluye idSpareParts en el payload put de equipo generico", () => {
    const mapped = mapGenericEquipmentPut({
      id: "GE-1",
      name: "Camara",
      brand: "Axis",
      model: "Q6128",
      createdBy: "tester",
      idSpareParts: ["SP-10", "SP-11"],
    });

    expect(mapped).toEqual({
      id: "GE-1",
      name: "Camara",
      brand: "Axis",
      model: "Q6128",
      createdBy: "tester",
      idSpareParts: ["SP-10", "SP-11"],
    });
  });
});
