import { describe, expect, it } from "vitest";

import {
  BillingDocumentMap,
  BillingDocumentCategoryMap,
  BillingDocumentDescriptionMap,
} from "./billingdocuments.mapper";

describe("billingdocuments.mapper", () => {
  describe("BillingDocumentCategoryMap", () => {
    it("maps string categories", () => {
      expect(BillingDocumentCategoryMap("Hospedaje")).toEqual({
        id_billingcategory: "",
        name: "Hospedaje",
      });
    });

    it("maps id from api variants", () => {
      expect(
        BillingDocumentCategoryMap({ id_billingcategory: "10", name: "Cat" }),
      ).toEqual({ id_billingcategory: "10", name: "Cat" });

      expect(BillingDocumentCategoryMap({ id: "11", name: "Cat2" })).toEqual({
        id_billingcategory: "11",
        name: "Cat2",
      });
    });
  });

  describe("BillingDocumentDescriptionMap", () => {
    it("maps string descriptions", () => {
      expect(BillingDocumentDescriptionMap("Taxi")).toEqual({
        id_billingdescription: "",
        name: "Taxi",
      });
    });

    it("maps id from api variants", () => {
      expect(
        BillingDocumentDescriptionMap({
          id_billingdescription: "20",
          name: "Desc",
        }),
      ).toEqual({ id_billingdescription: "20", name: "Desc" });

      expect(BillingDocumentDescriptionMap({ id: "21", name: "Desc2" })).toEqual(
        { id_billingdescription: "21", name: "Desc2" },
      );
    });
  });

  describe("BillingDocumentMap", () => {
    it("prioritizes json_sap totals when present", () => {
      const mapped = BillingDocumentMap({
        billingdocument_id: "bd-1",
        total: 100,
        subtotal: 80,
        iva: 20,
        otherinvoices: 1,
        json_sap: {
          iva: 81.79,
          subtotal: 511.21,
          total: 593,
          otherInvoices: 0,
          moneda: "MXN",
          iscompleted: true,
          items: [
            {
              itemIndex: 1,
              claveInterna: "59",
              claveProdServ: "90101501",
              descripcion: "Consumo",
              importe: 511.21,
            },
          ],
        },
      });

      expect(mapped.total).toBe(593);
      expect(mapped.subtotal).toBe(511.21);
      expect(mapped.iva).toBe(81.79);
      expect(mapped.otherinvoices).toBe(0);
      expect(mapped.json_sap?.moneda).toBe("MXN");
      expect(mapped.json_sap?.items).toHaveLength(1);
    });

    it("falls back to legacy totals when json_sap is missing", () => {
      const mapped = BillingDocumentMap({
        billingdocument_id: "bd-2",
        total: 400,
        subtotal: 300,
        iva: 100,
        otherinvoices: 5,
      });

      expect(mapped.total).toBe(400);
      expect(mapped.subtotal).toBe(300);
      expect(mapped.iva).toBe(100);
      expect(mapped.otherinvoices).toBe(5);
      expect(mapped.json_sap).toBeNull();
    });
  });
});

