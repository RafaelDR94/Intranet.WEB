import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { ColumnDef } from "@/app/utilities/Excel/ExportExcel";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { FieldModel, ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import type { Tools } from "@/app/mappings/accesrequest/accesrequest.types";
import DRLogo from "@/assets/images/LogosDR/DRLogoOficial.png";
import type { StaticImageData } from "next/image";

const TOOL_KEYS: Array<keyof Tools> = [
    "quantity",
    "brand",
    "description",
    "model",
    "serialnumber",
    "materialtype",
    "meditiontype",
];
const MATERIAL_TYPES = [
    { label: "Ferretero", value: "Ferretero" },
    { label: "Desechos Inorgánicos", value: "Desechos Inorgánicos" },
    { label: "Líquidos", value: "Líquidos" },
    { label: "Mercancías peligrosas", value: "Mercancías peligrosas" },
    { label: "A granel", value: "A granel" },
] as const;
const MEDITION_TYPES = [
    { label: "Metros", value: "Metros" },
    { label: "Litros", value: "Litros" },
    { label: "Toneladas", value: "Toneladas" },
    { label: "Kilos", value: "Kilos" },
    { label: "Pieza", value: "Pieza" },
    { label: "Gramos", value: "Gramos" },
    { label: "Metros cúbicos", value: "Metros cúbicos" },
    { label: "Metros cuadrados", value: "Metros cuadrados" },
] as const;

const DEFAULT_MATERIAL_TYPE: Tools["materialtype"] = "Ferretero";
const DEFAULT_MEDITION_TYPE: Tools["meditiontype"] = "Pieza";

const TOOL_COLUMNS_WIDTH: Record<keyof Tools, number> = {
    quantity: 12,
    description: 38,
    brand: 18,
    model: 18,
    serialnumber: 22,
    materialtype: 22,
    meditiontype: 18,
};

const TOOL_COLOR_PRIMARY = "FF002A41";
const TOOL_COLOR_ACCENT = TOOL_COLOR_PRIMARY;

const TOOL_TEMPLATE_HEADERS: ColumnDef[] = [
    { key: "quantity", header: "Cantidad" },
    { key: "description", header: "Descripción" },
    { key: "brand", header: "Marca" },
    { key: "model", header: "Modelo" },
    { key: "serialnumber", header: "No. de serie" },
    { key: "materialtype", header: "Tipo de material" },
    { key: "meditiontype", header: "Tipo de medida" },
];

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
};

const isHyperlinkValue = (value: ExcelJS.CellValue): value is ExcelJS.CellHyperlinkValue =>
    typeof value === "object" && value !== null && "text" in value;

const isRichTextValue = (value: ExcelJS.CellValue): value is ExcelJS.CellRichTextValue =>
    typeof value === "object" && value !== null && "richText" in value;

const getLogoAsBase64 = async () => {
    try {
        const logoSource = typeof DRLogo === "string" ? DRLogo : (DRLogo as StaticImageData).src;
        const response = await fetch(logoSource);

        if (!response.ok) return undefined;

        const buffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(buffer);

        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.warn("No se pudo cargar el logo para la plantilla de herramientas.", error);
        return undefined;
    }
};

const applyColumnsLayout = (worksheet: ExcelJS.Worksheet) => {
    worksheet.columns = TOOL_TEMPLATE_HEADERS.map((column) => ({
        key: column.key,
        width: TOOL_COLUMNS_WIDTH[column.key as keyof Tools],
    }));
};

const addWorksheetHeader = (worksheet: ExcelJS.Worksheet) => {
    const headerRow = worksheet.addRow(TOOL_TEMPLATE_HEADERS.map((column) => column.header));
    headerRow.height = 22;

    headerRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: TOOL_COLOR_ACCENT },
        };
        cell.font = {
            color: { argb: "FFFFFFFF" },
            bold: true,
            size: 12,
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
            top: { style: "thin", color: { argb: TOOL_COLOR_PRIMARY } },
            left: { style: "thin", color: { argb: TOOL_COLOR_PRIMARY } },
            bottom: { style: "thin", color: { argb: TOOL_COLOR_PRIMARY } },
            right: { style: "thin", color: { argb: TOOL_COLOR_PRIMARY } },
        };
    });

    worksheet.views = [{ state: "frozen", ySplit: headerRow.number }];

    return headerRow;
};

const setWorksheetTitle = (worksheet: ExcelJS.Worksheet) => {
    const titleRow = worksheet.addRow(["", "Herramientas"]);
    const startColumn = 2;
    const endColumn = TOOL_TEMPLATE_HEADERS.length + 1;

    worksheet.mergeCells(titleRow.number, startColumn, titleRow.number, endColumn);

    const titleCell = titleRow.getCell(startColumn);
    titleCell.value = "Herramientas";
    titleCell.font = { size: 18, bold: true, color: { argb: TOOL_COLOR_PRIMARY } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 30;
};

const decorateWorksheet = async (workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet) => {
    if (worksheet.rowCount > 0) {
        worksheet.spliceRows(1, worksheet.rowCount);
    }

    worksheet.properties.defaultRowHeight = 20;
    applyColumnsLayout(worksheet);

    worksheet.getRow(1).height = 16;
    worksheet.addRow([]);

    await getLogoAsBase64().then((base64) => {
        if (!base64) return;

        const imageId = workbook.addImage({ base64, extension: "png" });
        worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 190, height: 90 },
            editAs: "oneCell",
        });
    });

    setWorksheetTitle(worksheet);
    worksheet.addRow([]);
    addWorksheetHeader(worksheet);
};

const parseToString = (value: unknown) => String(value ?? "").trim();

const parseCellValue = (value: ExcelJS.CellValue): string => {
    if (isHyperlinkValue(value)) {
        return parseToString(value.text);
    }

    if (isRichTextValue(value) && Array.isArray(value.richText)) {
        return parseToString(value.richText.map((part) => part.text ?? "").join(""));
    }

    return parseToString(value);
};

const normalizeOption = <T extends string>(
    value: string,
    allowed: ReadonlyArray<{ value: T }>,
    fallback: T
): T => {
    const normalized = value.trim().toLowerCase();
    const match = allowed.find((option) => option.value.toLowerCase() === normalized);
    return match ? match.value : fallback;
};

const createEmptyTool = (): Tools => ({
    quantity: "",
    brand: "",
    description: "",
    model: "",
    serialnumber: "",
    meditiontype: DEFAULT_MEDITION_TYPE,
    materialtype: DEFAULT_MATERIAL_TYPE,
});

const mapValuesToTool = (values: Record<string, unknown>): Tools => ({
    quantity: parseToString(values.quantity),
    brand: parseToString(values.brand),
    description: parseToString(values.description),
    model: parseToString(values.model),
    serialnumber: parseToString(values.serialnumber),
    meditiontype: normalizeOption(
        parseToString(values.meditiontype),
        MEDITION_TYPES,
        DEFAULT_MEDITION_TYPE
    ),
    materialtype: normalizeOption(
        parseToString(values.materialtype),
        MATERIAL_TYPES,
        DEFAULT_MATERIAL_TYPE
    ),
});

const isToolComplete = (tool: Tools) => TOOL_KEYS.every((key) => tool[key].trim().length > 0);

const createToolFields = (tool: Tools): FieldModel[] => [
    {
        type: "input",
        name: "quantity",
        label: "Cantidad",
        placeholder: "Cantidad",
        value: tool.quantity,
        validations: [{ type: "required" }],
    },
    {
        type: "input",
        name: "brand",
        label: "Marca",
        placeholder: "Marca",
        value: tool.brand,
        validations: [{ type: "required" }],
    },
    {
        type: "input",
        name: "description",
        label: "Descripción",
        placeholder: "Descripción",
        value: tool.description,
        validations: [{ type: "required" }],
    },
    {
        type: "input",
        name: "model",
        label: "Modelo",
        placeholder: "Modelo",
        value: tool.model,
        validations: [{ type: "required" }],
    },
    {
        type: "input",
        name: "serialnumber",
        label: "No. de serie",
        placeholder: "No. de serie",
        value: tool.serialnumber,
        validations: [{ type: "required" }],
    },
    {
        type: "select",
        name: "materialtype",
        label: "Tipo de material",
        placeholder: "Selecciona un tipo",
        value: tool.materialtype || DEFAULT_MATERIAL_TYPE,
        options: [...MATERIAL_TYPES],
        validations: [{ type: "required" }],
    },
    {
        type: "select",
        name: "meditiontype",
        label: "Tipo de medida",
        placeholder: "Selecciona un tipo",
        value: tool.meditiontype || DEFAULT_MEDITION_TYPE,
        options: [...MEDITION_TYPES],
        validations: [{ type: "required" }],
    },
];

const TOOL_FORM_LAYOUT: ResponsiveLayoutMatrix = {
    sm: [[10], [10], [10], [10], [10], [10], [10]],
    md: [[5, 5], [5, 5], [5, 5], [5, 5]],
    lg: [[1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5]],
};

const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const canDecorateWorksheet = (
    worksheet: Partial<ExcelJS.Worksheet>
): worksheet is ExcelJS.Worksheet =>
    typeof worksheet.spliceRows === "function" &&
    typeof worksheet.getRow === "function" &&
    typeof worksheet.addImage === "function" &&
    typeof worksheet.mergeCells === "function";

const useToolsForm = () => {
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;

    const { tools, addTool, updateTool, removeTool, setTools } = useAccessRequestStore((state) => ({
        tools: state.tools,
        addTool: state.addTool,
        updateTool: state.updateTool,
        removeTool: state.removeTool,
        setTools: state.setTools,
    }), shallow);

    const [draftTool, setDraftTool] = useState<Tools>(createEmptyTool());
    const [formVersion, setFormVersion] = useState(0);
    const [isAddingTool, setIsAddingTool] = useState<boolean>(() => tools.length === 0);
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
    const [isProcessingImport, setIsProcessingImport] = useState(false);
    const canSubmitNewTool = useMemo(() => isToolComplete(draftTool), [draftTool]);

    useEffect(() => {
        if (tools.length === 0) {
            setDraftTool(createEmptyTool());
            setFormVersion((prev) => prev + 1);
            setIsAddingTool(true);
        }
    }, [tools.length]);

    const newToolFields = useMemo(() => createToolFields(draftTool), [draftTool]);
    const responsiveLayout = useMemo(() => TOOL_FORM_LAYOUT, []);

    const handleDraftValuesChange = useCallback((values: Record<string, unknown>) => {
        setDraftTool(mapValuesToTool(values));
    }, []);

    const handleSubmitNewTool = useCallback((values: Record<string, unknown>) => {
        const toolToSave = mapValuesToTool(values);
        if (!isToolComplete(toolToSave)) {
            return;
        }

        addTool(toolToSave);
        setDraftTool(createEmptyTool());
        setFormVersion((prev) => prev + 1);
        setIsAddingTool(false);
    }, [addTool]);

    const handleUpdateToolValues = useCallback((index: number, values: Record<string, unknown>) => {
        const currentTool = tools[index];
        if (!currentTool) return;
        const nextTool = mapValuesToTool(values);
        const updates: Partial<Tools> = {};

        TOOL_KEYS.forEach((key) => {
            if (currentTool[key] !== nextTool[key]) {
                (updates as Record<keyof Tools, Tools[keyof Tools]>)[key] = nextTool[key];
            }
        });

        if (Object.keys(updates).length > 0) {
            updateTool(index, updates);
        }
    }, [tools, updateTool]);

    const handleRemoveTool = useCallback((index: number) => {
        removeTool(index);
    }, [removeTool]);

    const handleOpenAddTool = useCallback(() => {
        setDraftTool(createEmptyTool());
        setFormVersion((prev) => prev + 1);
        setIsAddingTool(true);
    }, []);

    const getToolFields = useCallback((tool: Tools) => createToolFields(tool), []);

    const handleDownloadTemplate = useCallback(async () => {
        setIsDownloadingTemplate(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Herramientas", { properties: { defaultRowHeight: 18 } }) as Partial<ExcelJS.Worksheet>;

            if (canDecorateWorksheet(worksheet)) {
                await decorateWorksheet(workbook, worksheet);
            } else {
                worksheet.addRow?.(TOOL_TEMPLATE_HEADERS.map((column) => column.header));
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: MIME_XLSX });
            saveAs(blob, "plantilla_herramientas.xlsx");
        } catch {
            showAlert({
                type: "error",
                title: "No se pudo descargar la plantilla",
                description: "Ocurrió un error al generar el archivo. Intenta nuevamente.",
                showPrimaryButton: true,
                primaryLabel: "Entendido",
            });
        } finally {
            setIsDownloadingTemplate(false);
        }
    }, [showAlert]);

    const readToolsFromWorksheet = useCallback((worksheet: ExcelJS.Worksheet): Tools[] => {
        let headerRowIndex = 0;
        let headerMap: Map<string, number> | null = null;

        for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);
            const currentHeaderMap = new Map<string, number>();

            row.eachCell((cell, colNumber) => {
                const headerValue = parseCellValue((cell as ExcelJS.Cell).value as ExcelJS.CellValue);
                const matched = TOOL_TEMPLATE_HEADERS.find(
                    (column) =>
                        column.header.toLowerCase() === headerValue.toLowerCase() ||
                        String(column.key).toLowerCase() === headerValue.toLowerCase()
                );
                if (matched) {
                    currentHeaderMap.set(String(matched.key), colNumber);
                }
            });

            if (currentHeaderMap.size === TOOL_TEMPLATE_HEADERS.length) {
                headerMap = currentHeaderMap;
                headerRowIndex = rowNumber;
                break;
            }
        }

        if (!headerMap) {
            const missing = TOOL_TEMPLATE_HEADERS.map((column) => column.header).join(", ");
            throw new Error(`La plantilla no tiene todas las columnas requeridas: ${missing}.`);
        }

        const parsedTools: Tools[] = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= headerRowIndex) return;

            const rowValues: Record<string, unknown> = {};
            TOOL_TEMPLATE_HEADERS.forEach((column) => {
                const colIndex = headerMap?.get(String(column.key));
                const cellValue = colIndex ? row.getCell(colIndex).value : "";
                const normalized = parseCellValue(cellValue as ExcelJS.CellValue);
                rowValues[String(column.key)] = normalized;
            });

            const candidate = mapValuesToTool(rowValues);
            const hasContent = TOOL_KEYS.some((key) => candidate[key].trim().length > 0);
            if (!hasContent) return;

            if (!isToolComplete(candidate)) {
                throw new Error(`La fila ${rowNumber} tiene campos vacíos. Todos son requeridos.`);
            }

            parsedTools.push(candidate);
        });

        return parsedTools;
    }, []);

    const handleImportToolsFile = useCallback(
        async (file: File) => {
            setIsProcessingImport(true);
            showSpinner({ message: "Procesando archivo de herramientas..." });

            try {
                const buffer = await file.arrayBuffer();
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(buffer);
                const worksheet = workbook.worksheets[0];

                if (!worksheet) {
                    throw new Error("La plantilla no contiene datos.");
                }

                const importedTools = readToolsFromWorksheet(worksheet);

                if (importedTools.length === 0) {
                    throw new Error("No se encontraron herramientas para importar.");
                }

                setTools(importedTools);
                setDraftTool(createEmptyTool());
                setFormVersion((prev) => prev + 1);
                setIsAddingTool(false);

                showAlert({
                    type: "success",
                    title: "Herramientas cargadas",
                    description: `${importedTools.length} herramienta(s) agregadas desde Excel.`,
                    showPrimaryButton: true,
                    primaryLabel: "Entendido",
                });
            } catch (error) {
                const description = error instanceof Error ? error.message : "No se pudo leer el archivo.";
                showAlert({
                    type: "error",
                    title: "Error al cargar Excel",
                    description,
                    showPrimaryButton: true,
                    primaryLabel: "Entendido",
                });
            } finally {
                setIsProcessingImport(false);
                hideSpinner();
            }
        },
        [hideSpinner, readToolsFromWorksheet, setTools, showAlert, showSpinner]
    );

    return {
        tools,
        newToolFields,
        responsiveLayout,
        isAddingTool,
        formVersion,
        canSubmitNewTool,
        handleSubmitNewTool,
        handleDraftValuesChange,
        handleUpdateToolValues,
        handleRemoveTool,
        handleOpenAddTool,
        getToolFields,
        handleDownloadTemplate,
        handleImportToolsFile,
        isDownloadingTemplate,
        isProcessingImport,
    };
};

export default useToolsForm;
