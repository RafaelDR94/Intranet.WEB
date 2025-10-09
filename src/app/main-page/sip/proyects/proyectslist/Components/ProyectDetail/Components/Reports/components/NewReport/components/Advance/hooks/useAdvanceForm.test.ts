import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useAdvanceForm from "./useAdvanceForm";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const FORM_ID = "new-report-avance-form";

const updateAdvanceMock = vi.fn();
const setFieldsMock = vi.fn();
const updateFieldMock = vi.fn();
const resetFieldsMock = vi.fn();
const fetchLocationsMock = vi.fn();
const resetLocationFlagsMock = vi.fn();
const showAlertMock = vi.fn();
const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();

let storedFields: FieldModel[] = [];
let reportCategoriesMock = [
  { id: "CAT-1", name: "Correctivo" },
  { id: "CAT-2", name: "Preventivo" },
];
let locationsMock = [{ id: "LOC-1", name: "Edificio Norte" }];
const reportMock = createSampleReport({
  front_identifier: "FR-001",
  reportcategories: { id: "CAT-1", name: "Correctivo" },
  location: { id: "LOC-1", name: "Edificio Norte", linkmaps: "", address: "", proyect: [] },
  ticket: "TK-001",
  remarks: "Observaciones",
  diagnostic: "Diagnostico inicial",
  solution: "Solucion aplicada",
  progress: "80",
});

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          updateAdvance: updateAdvanceMock,
          report: reportMock,
          isReportHydrated: true,
          currentReportfrontguid: reportMock.front_identifier,
        })
      : {
          updateAdvance: updateAdvanceMock,
          report: reportMock,
          isReportHydrated: true,
          currentReportfrontguid: reportMock.front_identifier,
        },
}));

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) =>
    selector
      ? selector({
          reportCategories: reportCategoriesMock,
          loadingCategories: false,
        })
      : {
          reportCategories: reportCategoriesMock,
          loadingCategories: false,
        },
}));

vi.mock("@/app/stores/useFormFieldsStore/useFormFieldsStore", () => ({
  useFormFieldsStore: (selector?: any) =>
    selector
      ? selector({
          fieldsByFormId: { [FORM_ID]: storedFields },
          setFields: setFieldsMock,
          updateField: updateFieldMock,
          resetFields: resetFieldsMock,
        })
      : {
          fieldsByFormId: { [FORM_ID]: storedFields },
          setFields: setFieldsMock,
          updateField: updateFieldMock,
          resetFields: resetFieldsMock,
        },
}));

vi.mock("@/app/stores/useProyectLocationStore/useProyectLocationStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          locations: locationsMock,
          loadingLocations: false,
          fetchLocations: fetchLocationsMock,
          error: null,
          resetFlags: resetLocationFlagsMock,
        })
      : {
          locations: locationsMock,
          loadingLocations: false,
          fetchLocations: fetchLocationsMock,
          error: null,
          resetFlags: resetLocationFlagsMock,
        },
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: showAlertMock,
      hideAlert: vi.fn(),
    },
    usePrincipalLoading: {
      showSpinner: showSpinnerMock,
      hideSpinner: hideSpinnerMock,
    },
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: { id: "PROY-1" },
  }),
}));

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  toDateInputValue: (value: string | null | undefined) => value ?? "",
  currentDate: () => "2024-05-10",
}));

describe("useAdvanceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storedFields = [
      {
        type: "input",
        name: "ticket",
        label: "Ticket*",
        value: "",
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "category",
        label: "Categoria*",
        value: "",
        options: [],
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "location",
        label: "Ubicacion*",
        value: "",
        options: [],
        validations: [{ type: "required" }],
      },
    ];
  });

  it("prepara los campos del formulario y expone banderas basicas", async () => {
    const { result } = renderHook(() => useAdvanceForm("Correctivo"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.formFields).toEqual(storedFields);
    expect(result.current.canStart).toBe(true);
    expect(resetFieldsMock).toHaveBeenCalledWith(FORM_ID);
    expect(updateFieldMock).toHaveBeenCalledWith(
      FORM_ID,
      "location",
      expect.objectContaining({ disabled: false })
    );
  });

  it("actualiza el estado del avance al recibir cambios del formulario", () => {
    const { result } = renderHook(() => useAdvanceForm("Correctivo"));

    act(() => {
      result.current.onFormValidChange(true);
    });
    expect(result.current.isStepValid).toBe(true);

    act(() => {
      result.current.handleValuesChange({
        ticket: "TK-100",
        category: "CAT-2",
        location: "LOC-1",
        progress: "75",
        remarks: "Nuevas observaciones",
        diagnostic: "Diagnostico",
        solution: "Solucion",
        startDate: "2024-05-01",
        endDate: "2024-05-02",
      });
    });

    expect(updateAdvanceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        ticket: "TK-100",
        progress: 75,
        reportcategory: expect.objectContaining({ id: "CAT-2" }),
        location: expect.objectContaining({ id: "LOC-1" }),
      })
    );
  });
});
