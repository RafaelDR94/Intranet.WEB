import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useToolsForm from "./useToolsForm";

const mocks = vi.hoisted(() => ({
    mockShowAlert: vi.fn(),
    mockShowSpinner: vi.fn(),
    mockHideSpinner: vi.fn(),
    mockExportExcelPro: vi.fn(async () => ({ buffer: new ArrayBuffer(4) })),
    mockSaveAs: vi.fn(),
    mockSetTools: vi.fn(),
}));

vi.mock("file-saver", () => ({
    saveAs: (...args: unknown[]) => mocks.mockSaveAs(...args),
}));

vi.mock("@/app/utilities/Excel/ExportExcel", () => ({
    exportExcelPro: (...args: unknown[]) => mocks.mockExportExcelPro(...args),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
    usePrincipal: () => ({
        usePrincipalAlert: { showAlert: mocks.mockShowAlert },
        usePrincipalLoading: { showSpinner: mocks.mockShowSpinner, hideSpinner: mocks.mockHideSpinner },
    }),
}));

vi.mock("@/app/stores/useAccesRequestStore/useAccesRequestStore", () => {
    const toolsState = {
        tools: [],
        addTool: vi.fn(),
        updateTool: vi.fn(),
        removeTool: vi.fn(),
        setTools: mocks.mockSetTools,
    };
    return {
        __esModule: true,
        default: (selector: (state: typeof toolsState) => unknown) => selector(toolsState),
    };
});

describe("useToolsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("descarga una plantilla vacía de herramientas", async () => {
        const { result } = renderHook(() => useToolsForm());

        await act(async () => {
            await result.current.handleDownloadTemplate();
        });

        expect(mocks.mockExportExcelPro).toHaveBeenCalledWith(
            expect.objectContaining({
                fileName: "plantilla_herramientas",
                sheets: [
                    expect.objectContaining({
                        name: "Herramientas",
                        columns: [
                            { key: "quantity", header: "Cantidad" },
                            { key: "description", header: "Descripción" },
                            { key: "brand", header: "Marca" },
                            { key: "model", header: "Modelo" },
                            { key: "serialnumber", header: "No. de serie" },
                            { key: "materialtype", header: "Tipo de material" },
                            { key: "meditiontype", header: "Tipo de medida" },
                        ],
                        rows: [],
                    }),
                ],
            })
        );
        expect(mocks.mockSaveAs).toHaveBeenCalledTimes(1);
    });
});
