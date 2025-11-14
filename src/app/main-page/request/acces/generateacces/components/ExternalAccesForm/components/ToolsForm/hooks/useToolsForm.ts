import { useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import type { Tools } from "@/app/mappings/accesrequest/accesrequest.types";

const createEmptyTool = (): Tools => ({
    quantity: "",
    brand: "",
    description: "",
    model: ""
});

const useToolsForm = () => {
    const { tools, addTool, updateTool, removeTool } = useAccessRequestStore((state) => ({
        tools: state.tools,
        addTool: state.addTool,
        updateTool: state.updateTool,
        removeTool: state.removeTool
    }), shallow);

    const [draftTool, setDraftTool] = useState<Tools>(createEmptyTool());
    const [isAddingTool, setIsAddingTool] = useState<boolean>(true);

    const handleDraftChange = (field: keyof Tools, value: string) => {
        setDraftTool((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTool = () => {
        if (!canSubmitTool) return;
        addTool(draftTool);
        setDraftTool(createEmptyTool());
        setIsAddingTool(false);
    };

    const handleUpdateTool = (index: number, field: keyof Tools, value: string) => {
        updateTool(index, { [field]: value });
    };

    const handleRemoveTool = (index: number) => {
        if (tools.length <= 1) {
            setIsAddingTool(true);
        }
        removeTool(index);
    };

    const handleOpenAddTool = () => {
        setDraftTool(createEmptyTool());
        setIsAddingTool(true);
    };

    const canSubmitTool = useMemo(() => {
        return Object.values(draftTool).every((value) => value.trim().length > 0);
    }, [draftTool]);

    return {
        tools,
        draftTool,
        isAddingTool,
        canSubmitTool,
        handleDraftChange,
        handleAddTool,
        handleUpdateTool,
        handleRemoveTool,
        handleOpenAddTool
    };
};

export default useToolsForm;
