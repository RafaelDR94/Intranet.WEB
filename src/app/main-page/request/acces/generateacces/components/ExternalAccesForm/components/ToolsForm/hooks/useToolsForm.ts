import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel, ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import type { Tools } from "@/app/mappings/accesrequest/accesrequest.types";

const TOOL_KEYS: Array<keyof Tools> = ["quantity", "brand", "description", "model","materialtype","meditiontype"];
const MATERIAL_TYPES = [
    { label: "Ferretero", value: "Ferretero" },
    { label: "Desechos Inorgánicos", value: "Desechos Inorgánicos" },
    { label: "Líquidos", value: "Líquidos" },
    { label: "Mercancías peligrosas", value: "Mercancías peligrosas" },
    { label: "A granel", value: "A granel" },
];
const MEDITION_TYPES = [
    { label: "Metros", value: "Metros" },
    { label: "Litros", value: "Litros" },
    { label: "Toneladas", value: "Toneladas" },
    { label: "Kilos", value: "Kilos" },
    { label: "Pieza", value: "Pieza" },
    { label: "Gramos", value: "Gramos" },
    { label: "Metros cúbicos", value: "Metros cúbicos" },
    { label: "Metros cuadrados", value: "Metros cuadrados" },
];
const createEmptyTool = (): Tools => ({
    quantity: "",
    brand: "",
    description: "",
    model: "",
    meditiontype: "Pieza",
    materialtype: "Ferretero"
});

const mapValuesToTool = (values: Record<string, unknown>): Tools => ({
    quantity: String(values.quantity ?? ""),
    brand: String(values.brand ?? ""),
    description: String(values.description ?? ""),
    model: String(values.model ?? ""),
    meditiontype: values.meditiontype as any,
    materialtype: values.materialtype as any
});

const isToolComplete = (tool: Tools) => TOOL_KEYS.every((key) => tool[key].trim().length > 0);

const createToolFields = (tool: Tools): FieldModel[] => [
    {
        type: "input",
        name: "quantity",
        label: "Cantidad",
        placeholder: "Cantidad",
        value: tool.quantity,
        validations: [{ type: "required" }]
    },
    {
        type: "input",
        name: "brand",
        label: "Marca",
        placeholder: "Marca",
        value: tool.brand,
        validations: [{ type: "required" }]
    },
    {
        type: "input",
        name: "description",
        label: "Descripción",
        placeholder: "Descripción",
        value: tool.description,
        validations: [{ type: "required" }]
    },
    {
        type: "input",
        name: "model",
        label: "Modelo",
        placeholder: "Modelo",
        value: tool.model,
        validations: [{ type: "required" }]
    },
    {
        type: "select",
        name: "materialtype",
        label: "Tipo de material",
        placeholder: "Selecciona un tipo",
        value: tool.materialtype || "Ferretero",
        options: MATERIAL_TYPES,
        validations: [{ type: "required" }]
    },
    {
        type: "select",
        name: "meditiontype",
        label: "Tipo de medida",
        placeholder: "Selecciona un tipo",
        value: tool.meditiontype || "Pieza",
        options: MEDITION_TYPES,
        validations: [{ type: "required" }]
    }
];

const TOOL_FORM_LAYOUT: ResponsiveLayoutMatrix = {
    sm: [[10], [10], [10], [10], [10], [10]],
    md: [[5, 5], [5, 5], [5, 5]],
    lg: [[1.6, 1.6, 1.6, 1.6, 1.6, 1.6]]
};

const useToolsForm = () => {
    const { tools, addTool, updateTool, removeTool } = useAccessRequestStore((state) => ({
        tools: state.tools,
        addTool: state.addTool,
        updateTool: state.updateTool,
        removeTool: state.removeTool
    }), shallow);

    const [draftTool, setDraftTool] = useState<Tools>(createEmptyTool());
    const [formVersion, setFormVersion] = useState(0);
    const [isAddingTool, setIsAddingTool] = useState<boolean>(() => tools.length === 0);
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
        const updates = TOOL_KEYS.reduce<Partial<Tools>>((acc: any, key) => {
            if (currentTool[key] !== nextTool[key]) {
                acc[key] = nextTool[key];
            }
            return acc;
        }, {});

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
        getToolFields
    };
};

export default useToolsForm;
