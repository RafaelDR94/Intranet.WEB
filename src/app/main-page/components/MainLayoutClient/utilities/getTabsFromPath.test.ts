import { describe, it, expect } from "vitest";

import { getTabsFromPath } from "./getTabsFromPath";

describe("getTabsFromPath utility", () => {
  it("returns tabs for home section", () => {
    const result = getTabsFromPath("/main-page/home");
    expect(result).toEqual([
      { label: "Comunicados", path: "/main-page/home/announcements" },
      {
        label: "Información Importante",
        path: "/main-page/home/important-information",
      },
    ]);
  });

  it("returns tabs for request section", () => {
    const result = getTabsFromPath("/main-page/request");
    expect(result).toEqual([]);
  });

  it("returns empty array for unknown path", () => {
    const result = getTabsFromPath("/main-page/other");
    expect(result).toEqual([]);
  });

  it("shows the Treasury requisitions list tab even when viewing a detail", () => {
    const result = getTabsFromPath(
      "/main-page/treasury/requisitions",
      "?id=requisition-request-1",
    );

    expect(result).toEqual([
      {
        label: "Listado solicitud de requisici\u00f3n",
        path: "/main-page/treasury/requisitions",
      },
    ]);
  });

  it("returns the accounting documents history tab", () => {
    const result = getTabsFromPath("/main-page/accounting/documentshistory");

    expect(result).toEqual([
      {
        label: "Historico de facturas",
        path: "/main-page/accounting/documentshistory",
      },
    ]);
  });

  it("returns the sapkey base tab", () => {
    const result = getTabsFromPath("/main-page/accounting/sapkey");

    expect(result).toEqual([
      {
        label: "Claves SAP y SAT",
        path: "/main-page/accounting/sapkey",
      },
    ]);
  });

  it("returns the sapkey create tabs", () => {
    const result = getTabsFromPath("/main-page/accounting/sapkey", "?view=new");

    expect(result).toEqual([
      {
        label: "Claves SAP y SAT",
        path: "/main-page/accounting/sapkey",
      },
      {
        label: "Nueva clave",
        path: "/main-page/accounting/sapkey?view=new",
      },
    ]);
  });

  it("returns the sapkey edit tabs", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/sapkey",
      "?view=edit&id=sap-1",
    );

    expect(result).toEqual([
      {
        label: "Claves SAP y SAT",
        path: "/main-page/accounting/sapkey",
      },
      {
        label: "Editar clave",
        path: "/main-page/accounting/sapkey?view=edit&id=sap-1",
      },
    ]);
  });

  it("returns the operations documents history tab", () => {
    const result = getTabsFromPath("/main-page/operations/documentshistory");

    expect(result).toEqual([
      {
        label: "Historico de facturas",
        path: "/main-page/operations/documentshistory",
      },
    ]);
  });

  it("returns configuration tabs for the account section", () => {
    const result = getTabsFromPath("/main-page/configuration/account");

    expect(result).toEqual([
      { label: "Cuenta", path: "/main-page/configuration/account" },
      { label: "Seguridad", path: "/main-page/configuration/security" },
      {
        label: "Notificaciones",
        path: "/main-page/configuration/notifications",
      },
    ]);
  });

  it("shows dispositivos tab only when visiting devices page", () => {
    const result = getTabsFromPath("/main-page/configuration/devices");

    expect(result).toEqual([
      { label: "Cuenta", path: "/main-page/configuration/account" },
      { label: "Seguridad", path: "/main-page/configuration/security" },
      {
        label: "Notificaciones",
        path: "/main-page/configuration/notifications",
      },
      { label: "Dispositivos", path: "/main-page/configuration/devices" },
    ]);
  });

  it("adds files tab when operations requisition list has an id", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=123&label=Archivos",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
      {
        label: "Archivos",
        path: "/main-page/operations/requisitions/requisitionListPage?id=123&label=Archivos&requisitionsLabel=Archivos",
      },
    ]);
  });

  it("does not add detail tab when operations requisition list only has employee id", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=123",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
    ]);
  });

  it("adds requisitions and detail tabs when operations detail includes idRequisition", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=777&idEmployee=777&idRequisition=555&label=Detalle%20Requisici%C3%B3n&requisitionsLabel=Requisiciones%20Bruno%20Mendoza&view=detail",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
      {
        label: "Requisiciones Bruno",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&label=Requisiciones+Bruno&idEmployee=777&requisitionsLabel=Requisiciones+Bruno",
      },
      {
        label: "Detalle Requisición",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&idRequisition=555&label=Detalle+Requisici%C3%B3n&view=detail&idEmployee=777&requisitionsLabel=Requisiciones+Bruno",
      },
    ]);
  });

  it("adds billable files tab when personal requisitions detail includes an id and billable view", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/personalInvoices/requisitions",
      "?id=123&label=Detalle%20Requisici%C3%B3n&view=billablefiles",
    );

    expect(result).toEqual([
      {
        label: "Detalle Requisición",
        path: "/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n",
      },
      {
        label: "Carga de Archivos Facturables",
        path: "/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n&view=billablefiles",
      },
    ]);
  });

  it("does not add billable files tab if view is not billablefiles", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/personalInvoices/requisitions",
      "?id=123&label=Detalle%20Requisici%C3%B3n",
    );

    expect(result).toEqual([
      {
        label: "Detalle Requisición",
        path: "/main-page/accounting/personalInvoices/requisitions?id=123&label=Detalle+Requisici%C3%B3n",
      },
    ]);
  });

  it("adds requisition detail tab when navigating to billable files with requisition context", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/billablefiles/billablefiles",
      "?id=456&label=Requisici%C3%B3n%20Juan",
    );

    expect(result).toEqual([
      {
        label: "Requisición Juan",
        path: "/main-page/accounting/personalInvoices/requisitions?id=456&label=Requisici%C3%B3n+Juan",
      },
    ]);
  });

  it("keeps provided label in operations requisition file tab path", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=777&label=Archivos%20Bruno",
    );

    expect(result[2]).toEqual({
      label: "Archivos Bruno",
      path: "/main-page/operations/requisitions/requisitionListPage?id=777&label=Archivos+Bruno&requisitionsLabel=Archivos+Bruno",
    });
  });

  it("adds the beneficiary files tab with the selected employee context", () => {
    const result = getTabsFromPath(
      "/main-page/operations/expenserequisitions/beneficiaryhistory/",
      "?id=d8909c3a-fb4f-40b5-9842-04c1462bef9e&idEmployee=e986a8db-cb6e-4ce1-9a9d-a25c1f05fc89&label=Archivos%20Bruno",
    );

    expect(result.at(-1)).toEqual({
      label: "Archivos Bruno",
      path: "/main-page/operations/expenserequisitions/beneficiaryhistory?id=d8909c3a-fb4f-40b5-9842-04c1462bef9e&idEmployee=e986a8db-cb6e-4ce1-9a9d-a25c1f05fc89&label=Archivos+Bruno",
    });
  });

  it("only keeps the first name in person-based labels", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=888&label=Requisiciones%20Bruno%20Mendoza",
    );

    expect(result[2]).toEqual({
      label: "Requisiciones Bruno",
      path: "/main-page/operations/requisitions/requisitionListPage?id=888&label=Requisiciones+Bruno&requisitionsLabel=Requisiciones+Bruno",
    });
  });

  it("does not add files tab when requisition list has no id", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
    ]);
  });

  it("shows the employee name in the validate invoices tab when invoice context exists", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/invoices/validateinvoices",
      "?idEmployee=emp-1&employeeName=Bruno%20Mendoza",
    );

    expect(result[0]).toEqual({
      label: "Validación de Facturas Bruno Mendoza",
      path: "/main-page/accounting/invoices/validateinvoices?idEmployee=emp-1&employeeName=Bruno+Mendoza",
    });
  });

  it("prioritizes requisition code in the validate invoices tab when requisition context exists", () => {
    const result = getTabsFromPath(
      "/main-page/accounting/invoices/validateinvoices",
      "?idEmployee=emp-1&idRequisition=req-1&employeeName=Bruno%20Mendoza&requisitionCode=REQ-2026-001",
    );

    expect(result[0]).toEqual({
      label: "Validación de Facturas REQ-2026-001",
      path: "/main-page/accounting/invoices/validateinvoices?idEmployee=emp-1&idRequisition=req-1&requisitionCode=REQ-2026-001&employeeName=Bruno+Mendoza",
    });
  });

  it("adds requisitions and detail tabs when viewing requisition detail", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=555&idEmployee=777&label=Detalle%20Requisici%C3%B3n&requisitionsLabel=Requisiciones%20Bruno%20Mendoza&view=detail",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
      {
        label: "Requisiciones Bruno",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&label=Requisiciones+Bruno&idEmployee=777&requisitionsLabel=Requisiciones+Bruno",
      },
      {
        label: "Detalle Requisición",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&idRequisition=555&label=Detalle+Requisici%C3%B3n&view=detail&idEmployee=777&requisitionsLabel=Requisiciones+Bruno",
      },
    ]);
  });

  it("adds the operations billable files tab with the invoice upload section path", () => {
    const result = getTabsFromPath(
      "/main-page/operations/requisitions/requisitionListPage",
      "?id=777&idEmployee=777&idRequisition=555&label=Archivos%20Bruno&requisitionsLabel=Archivos%20Bruno&view=billablefiles",
    );

    expect(result).toEqual([
      {
        label: "Requisiciones",
        path: "/main-page/operations/requisitions/requisitionsPage",
      },
      {
        label: "Listado Beneficiarios",
        path: "/main-page/operations/requisitions/requisitionListPage",
      },
      {
        label: "Archivos Bruno",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&label=Archivos+Bruno&idEmployee=777&requisitionsLabel=Archivos+Bruno",
      },
      {
        label: "Subir una Factura",
        path: "/main-page/operations/requisitions/requisitionListPage?id=777&idRequisition=555&label=Archivos+Bruno&view=billablefiles&uploadSection=invoice&idEmployee=777&requisitionsLabel=Archivos+Bruno",
      },
    ]);
  });

  it("returns organigrama tabs for the standalone module", () => {
    const result = getTabsFromPath("/main-page/organigrama/departments");

    expect(result).toEqual([
      { label: "Departamentos", path: "/main-page/organigrama/departments" },
      {
        label: "Directorio General",
        path: "/main-page/organigrama/generaldirectory",
      },
    ]);
  });

  it("adds the dynamic department detail tab for organigrama", () => {
    const result = getTabsFromPath(
      "/main-page/organigrama/departments",
      "?view=detail&id=dep-1&label=TI",
    );

    expect(result).toEqual([
      { label: "Departamentos", path: "/main-page/organigrama/departments" },
      {
        label: "TI",
        path: "/main-page/organigrama/departments?view=detail&id=dep-1&label=TI",
      },
    ]);
  });
});
