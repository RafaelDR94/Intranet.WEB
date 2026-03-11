import { describe, expect, it } from "vitest";

import {
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
});

