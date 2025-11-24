import ExcelJS, { Workbook } from "exceljs";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useToolsForm from "./useToolsForm";

const mocks = vi.hoisted(() => ({
    mockShowAlert: vi.fn(),
    mockShowSpinner: vi.fn(),
    mockHideSpinner: vi.fn(),
    mockSaveAs: vi.fn(),
    mockUpdateTool: vi.fn(),
    mockSetTools: vi.fn(),
    toolsState: {
        tools: [],
        addTool: vi.fn(),
        updateTool: vi.fn(),
        removeTool: vi.fn(),
        setTools: vi.fn(),
    },
}));

vi.mock("file-saver", () => ({
    saveAs: (...args: unknown[]) => mocks.mockSaveAs(...args),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
    usePrincipal: () => ({
        usePrincipalAlert: { showAlert: mocks.mockShowAlert },
        usePrincipalLoading: { showSpinner: mocks.mockShowSpinner, hideSpinner: mocks.mockHideSpinner },
    }),
}));

vi.mock("@/app/stores/useAccesRequestStore/useAccesRequestStore", () => {
    const toolsState = mocks.toolsState;
    toolsState.setTools = mocks.mockSetTools;
    toolsState.updateTool = mocks.mockUpdateTool;
    return {
        __esModule: true,
        default: (selector: (state: typeof toolsState) => unknown) => selector(toolsState),
    };
});

const TOOL_HEADERS = [
    "Cantidad",
    "Descripción",
    "Marca",
    "Modelo",
    "No. de serie",
    "Tipo de material",
    "Tipo de medida",
];

const createToolsFile = async (options?: { headerRow?: number; withConsecutive?: boolean }) => {
    const headerRow = options?.headerRow ?? 1;
    const withConsecutive = options?.withConsecutive ?? false;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Herramientas");

    while (worksheet.rowCount < headerRow - 1) {
        worksheet.addRow([]);
    }

    const headers = withConsecutive ? ["Consecutivo", ...TOOL_HEADERS] : TOOL_HEADERS;
    worksheet.getRow(headerRow).values = headers;
    worksheet.getRow(headerRow + 1).values = withConsecutive
        ? [1, "2", "Caja de herramientas", "ACME", "MX-100", "12345", "Ferretero", "Pieza"]
        : ["2", "Caja de herramientas", "ACME", "MX-100", "12345", "Ferretero", "Pieza"];

    const buffer = await workbook.xlsx.writeBuffer();
    return {
        name: "herramientas.xlsx",
        arrayBuffer: async () => buffer,
    } as unknown as File;
};

describe("useToolsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.toolsState.tools = [];
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("descarga una plantilla vacía sin columna de consecutivo ni filas adicionales", async () => {
        const addRowMock = vi.fn();
        const addWorksheetSpy = vi
            .spyOn(Workbook.prototype, "addWorksheet")
            .mockReturnValue({ addRow: addRowMock } as unknown as ExcelJS.Worksheet);
        const writeBufferMock = vi.fn(async () => new ArrayBuffer(8));
        vi.spyOn(Workbook.prototype, "xlsx", "get").mockReturnValue({ writeBuffer: writeBufferMock } as any);

        const { result } = renderHook(() => useToolsForm());

        await act(async () => {
            await result.current.handleDownloadTemplate();
        });

        expect(addWorksheetSpy).toHaveBeenCalledWith("Herramientas", expect.any(Object));
        expect(addRowMock).toHaveBeenCalledWith(TOOL_HEADERS);
        expect(writeBufferMock).toHaveBeenCalledTimes(1);
        expect(mocks.mockSaveAs).toHaveBeenCalledWith(expect.anything(), "plantilla_herramientas.xlsx");
    });

    it("importa herramientas desde una plantilla con encabezados en otra fila y columna consecutivo", async () => {
        const toolsFile = await createToolsFile({ headerRow: 7, withConsecutive: true });
        const { result } = renderHook(() => useToolsForm());

        await act(async () => {
            await result.current.handleImportToolsFile(toolsFile);
        });

        expect(mocks.mockSetTools).toHaveBeenCalledWith([
            {
                quantity: "2",
                brand: "ACME",
                description: "Caja de herramientas",
                model: "MX-100",
                serialnumber: "12345",
                materialtype: "Ferretero",
                meditiontype: "Pieza",
            },
        ]);
        expect(mocks.mockShowAlert).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "success",
                title: "Herramientas cargadas",
            })
        );
    });

    it("conserva los valores existentes al actualizar parcialmente una herramienta", () => {
        mocks.toolsState.tools = [
            {
                quantity: "2",
                brand: "ACME",
                description: "Caja de herramientas",
                model: "MX-100",
                serialnumber: "12345",
                materialtype: "Ferretero",
                meditiontype: "Pieza",
            },
        ];

        const { result } = renderHook(() => useToolsForm());

        act(() => {
            result.current.handleUpdateToolValues(0, { description: "Maletín" });
        });

        expect(mocks.mockUpdateTool).toHaveBeenCalledWith(0, { description: "Maletín" });
        expect(mocks.toolsState.tools[0].quantity).toBe("2");
    });
});
