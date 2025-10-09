import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useSignature from "./useSignatures";

import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const updateSignatureMock = vi.fn();
const updateClientsignMock = vi.fn();
const report = createSampleReport({
  employeesignurl: "https://cdn.example.com/employee.png",
  clientsign: {
    clientname: "Carlos Perez",
    clientworkposition: "Supervisor",
    datetime: "2024-05-02 18:45",
    url: "https://cdn.example.com/client.png",
  },
});

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    user: {
      idEmployee: "EMP-1",
      fullName: "Laura Campos",
    },
  }),
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: () => ({
    report,
    updateSignature: updateSignatureMock,
    updateClientsign: updateClientsignMock,
  }),
}));

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  currentDate: () => "2024-05-10",
}));

describe("useSignatures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    report.employeesignurl = "https://cdn.example.com/employee.png";
    report.clientsign = {
      clientname: "Carlos Perez",
      clientworkposition: "Supervisor",
      datetime: "2024-05-02 18:45",
      url: "https://cdn.example.com/client.png",
    };
  });

  it("sincroniza firmas existentes desde el reporte al iniciar", () => {
    const { result } = renderHook(() => useSignature());

    expect(result.current.userSignature).toBe(report.employeesignurl);
    expect(result.current.clientSignature?.signature).toBe(report.clientsign?.url);
  });

  it("administra la autorizacion de la firma propia y del cliente", () => {
    const { result } = renderHook(() => useSignature());

    act(() => {
      result.current.handleAuthorization({
        state: true,
        signature: "data:image/png;base64,user",
      });
    });

    expect(result.current.userSignature).toBe("data:image/png;base64,user");
    expect(updateSignatureMock).toHaveBeenCalledWith("data:image/png;base64,user");

    act(() => {
      result.current.handleClientAuthorization({
        state: true,
        signature: "data:image/png;base64,client",
        external: { name: "Cliente Demo", workposition: "Gerente" },
      });
    });

    expect(updateClientsignMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "data:image/png;base64,client",
        clientname: "Cliente Demo",
      })
    );
    expect(result.current.clientSignature?.signature).toBe("data:image/png;base64,client");
  });

  it("controla la apertura de los popups segun el estado de las firmas", () => {
    const { result } = renderHook(() => useSignature());

    act(() => {
      result.current.handleClick();
    });

    expect(result.current.openClientSignaturePopUp).toBe(true);

    report.employeesignurl = "";
    report.clientsign = null;

    const { result: secondResult } = renderHook(() => useSignature());

    act(() => {
      secondResult.current.handleClick();
    });

    expect(secondResult.current.openSignaturePopUp).toBe(true);
  });
});
