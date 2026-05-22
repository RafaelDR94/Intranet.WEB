import { describe, expect, it } from "vitest";

import {
  BillingDocumentMap,
  BillingDocumentCategoryMap,
  BillingDocumentDescriptionMap,
  BillingDocumentSatTableMap,
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
    it("prioritizes json_sap totals when present except otherinvoices", () => {
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
          expenseType: "6",
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
      expect(mapped.otherinvoices).toBe(1);
      expect(mapped.json_sap?.moneda).toBe("MXN");
      expect(mapped.json_sap?.expenseType).toBe("6");
      expect(mapped.json_sap?.items).toHaveLength(1);
    });

    it("keeps otherinvoices from the root payload even if json_sap sends a different value", () => {
      const mapped = BillingDocumentMap({
        billingdocument_id: "bd-1b",
        total: 100,
        subtotal: 80,
        iva: 20,
        otherinvoices: 9.45,
        json_sap: {
          iva: 0,
          subtotal: 70.37,
          total: 76,
          otherinvoices: 5.63,
          moneda: "MXN",
          expenseType: "6",
          iscompleted: true,
          items: [],
        },
      });

      expect(mapped.otherinvoices).toBe(9.45);
      expect(mapped.json_sap?.otherInvoices).toBe(5.63);
    });

    it("parses json_sap when the backend sends it as a string", () => {
      const mapped = BillingDocumentMap({
        billingdocument_id: "bd-1c",
        total: 950,
        subtotal: 798.32,
        iva: 127.73,
        otherinvoices: 0,
        json_sap: JSON.stringify({
          iva: 127.73,
          subtotal: 798.32,
          total: 950,
          otherinvoices: 23.95,
          moneda: "MXN",
          expenseType: "6",
          iscompleted: true,
          items: [],
        }),
      });

      expect(mapped.otherinvoices).toBe(0);
      expect(mapped.json_sap?.otherInvoices).toBe(23.95);
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

    it("exposes requisitionkey as a top-level field for table search", () => {
      const mapped = BillingDocumentMap({
        billingdocument_id: "bd-req",
        requisition: {
          requisitionkey: "REQ-VAL-001",
        },
      });

      expect(mapped.requisitionkey).toBe("REQ-VAL-001");
    });
  });

  describe("BillingDocumentSatTableMap", () => {
    it("exposes requisitionkey as a top-level field for table search", () => {
      const mapped = BillingDocumentSatTableMap({
        billingdocument_id: "bd-3",
        requisition: {
          requisitionkey: "REQ-12345",
          employeename: "Test User",
        },
      } as any);

      expect(mapped.requisitionkey).toBe("REQ-12345");
      expect(mapped.employeename).toBe("Test User");
    });
  });
});

