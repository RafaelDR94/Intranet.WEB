import { describe, expect, it, vi } from "vitest";

import { ReportMap, mapReportViewToPost, mapReportViewToPut } from "./report.mapper";
import type { ReportView } from "./reports.types";

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  currentDate: () => "2026-05-14",
  formatDateHour: (value: string) => value,
  formatDateOnlyDate: (value: string) => value,
}));

const buildReportView = (): ReportView => ({
  id: "REP-1",
  model: {
    maps: false,
    diagnostic: true,
    solution: true,
    refactions: true,
    clientsign: false,
    ticket: true,
  },
  startdate: "2026-05-10",
  enddate: "2026-05-11",
  datecreate: "2026-05-12",
  proyect: {
    id: "PROY-1",
    name: "Proyecto demo",
    proyectKey: "PROY-KEY",
    client: "Cliente",
    collaborators: [],
  } as any,
  type: "TYPE-1",
  reportcategories: {
    id: "CAT-1",
    name: "Categoria",
    typesofreports: {
      id: "TYPE-1",
      name: "Tipo",
      description: "Descripcion",
    },
  },
  location: { id: "LOC-1", name: "Ubicacion" } as any,
  employe: { employee_id: "EMP-1", fullname: "Empleado" } as any,
  workposition: { workposition_id: "WP-1", name: "Puesto" } as any,
  remarks: "Observaciones",
  progress: "20",
  ticket: "TK-1",
  employeesignurl: "https://example.com/sign.png",
  activities: [],
  maps: [],
  diagnostic: "Diag",
  solution: "Sol",
  idSpareParts: ["SP-1", "SP-2"],
  refactions: [
    {
      description: "Ref 1",
      brand: "Marca",
      model: "Modelo",
      serialnumber: "SER-1",
      partnumber: "PN-1",
    },
  ],
  clientsign: {},
  front_identifier: "FRONT-1",
  reportDeviceView: [
    {
      id: "DEV-1",
      device_external_view: { id: "DEV-1" } as any,
    },
  ],
});

describe("report.mapper", () => {
  it("ReportMap normaliza idSpareParts desde un arreglo real", () => {
    const mapped = ReportMap({
      id: "REP-1",
      model: {},
      startdate: "2026-05-10",
      enddate: "2026-05-11",
      datecreate: "2026-05-12",
      proyect: {},
      type: "TYPE-1",
      reportcategories: {},
      location: {},
      employe: {},
      workposition: {},
      idSpareParts: ["SP-1", 2, null],
      Refactions: [],
    });

    expect(mapped.idSpareParts).toEqual(["SP-1", "2"]);
  });

  it("ReportMap normaliza idSpareParts desde string JSON legacy", () => {
    const mapped = ReportMap({
      id: "REP-1",
      model: {},
      startdate: "2026-05-10",
      enddate: "2026-05-11",
      datecreate: "2026-05-12",
      proyect: {},
      type: "TYPE-1",
      reportcategories: {},
      location: {},
      employe: {},
      workposition: {},
      idspareparts: '["SP-10","SP-11"]',
      Refactions: [],
    });

    expect(mapped.idSpareParts).toEqual(["SP-10", "SP-11"]);
  });

  it("ReportMap recupera el idtype desde la categoria cuando type viene vacio", () => {
    const mapped = ReportMap({
      id: "REP-1",
      model: {},
      startdate: "2026-05-10",
      enddate: "2026-05-11",
      datecreate: "2026-05-12",
      proyect: {},
      type: "",
      reportcategories: {
        id: "CAT-1",
        name: "Categoria",
        typesofreports: {
          id: "TYPE-ADV",
          name: "Avance",
          description: "Descripcion",
        },
      },
      location: {},
      employe: {},
      workposition: {},
      Refactions: [],
    });

    expect(mapped.type).toBe("TYPE-ADV");
  });

  it("mapReportViewToPost y mapReportViewToPut incluyen idSpareParts sin perder Refactions", () => {
    const view = buildReportView();

    const postPayload = mapReportViewToPost(view);
    const putPayload = mapReportViewToPut(view);

    expect(postPayload.idSpareParts).toEqual(["SP-1", "SP-2"]);
    expect(putPayload.idSpareParts).toEqual(["SP-1", "SP-2"]);
    expect(postPayload.Refactions).toBe(JSON.stringify(view.refactions));
    expect(putPayload.Refactions).toBe(JSON.stringify(view.refactions));
  });

  it("mapReportViewToPost y mapReportViewToPut usan el tipo de la categoria si view.type viene vacio", () => {
    const view = buildReportView();
    view.type = "";

    const postPayload = mapReportViewToPost(view);
    const putPayload = mapReportViewToPut(view);

    expect(postPayload.idtype).toBe("TYPE-1");
    expect(putPayload.idtype).toBe("TYPE-1");
  });
});
