import { describe, expect, it } from "vitest";

import { mapSAPKey, mapSAPKeyPost, mapSAPKeyPut } from "./sapkeys.mapper";

describe("sapkeys.mapper", () => {
  it("maps get payloads with normalized keys and booleans", () => {
    expect(
      mapSAPKey({
        id: "123",
        satKey: "86121700",
        descriptionSatKey: "Universidades",
        internalKey: "130",
        descriptionInternalKey: "Capacitación 0%",
        GTSType: "a",
        iva: "0.16",
        isActive: 1,
      }),
    ).toEqual({
      id: "123",
      satKey: "86121700",
      descriptionSatKey: "Universidades",
      internalKey: "130",
      descriptionInternalKey: "Capacitación 0%",
      gtsType: "A",
      iva: 0.16,
      isActive: true,
    });
  });

  it("maps post payloads without id and preserves decimals", () => {
    expect(
      mapSAPKeyPost({
        satKey: "90101501",
        descriptionSatKey: "Restaurantes",
        internalKey: "79",
        descriptionInternalKey: "Consumo viáticos 0%",
        gtsType: "o",
        iva: "0.00",
      }),
    ).toEqual({
      satKey: "90101501",
      descriptionSatKey: "Restaurantes",
      internalKey: "79",
      descriptionInternalKey: "Consumo viáticos 0%",
      gtsType: "O",
      iva: 0,
    });
  });

  it("maps put payloads with id included", () => {
    expect(
      mapSAPKeyPut({
        id: "guid-1",
        sat_key: "78111500",
        description_sat_key: "Transporte pasajeros aéreo",
        internal_key: "4",
        description_internal_key: "Comisiones TDC",
        gtStype: "A",
        iva: 0.08,
      }),
    ).toEqual({
      id: "guid-1",
      satKey: "78111500",
      descriptionSatKey: "Transporte pasajeros aéreo",
      internalKey: "4",
      descriptionInternalKey: "Comisiones TDC",
      gtsType: "A",
      iva: 0.08,
    });
  });
});
