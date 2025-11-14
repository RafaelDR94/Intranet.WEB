import useToolsForm from "./hooks/useToolsForm";

import { Input } from "@/app/components/Input/Input";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import { FormsInterface } from "../../types";

const ToolsForm: React.FC<FormsInterface> = ({ canUpdateForm }) => {
    const {
        tools,
        draftTool,
        isAddingTool,
        canSubmitTool,
        handleDraftChange,
        handleAddTool,
        handleUpdateTool,
        handleRemoveTool,
        handleOpenAddTool
    } = useToolsForm();

    return (
        <div className="flex flex-col gap-6">
            {isAddingTool && (
                <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                    <Input
                        label="Cantidad"
                        placeholder="Cantidad"
                        value={draftTool.quantity}
                        onChange={(event) => handleDraftChange("quantity", event.target.value)}
                        disabled={!canUpdateForm}
                    />
                    <Input
                        label="Marca"
                        placeholder="Marca"
                        value={draftTool.brand}
                        onChange={(event) => handleDraftChange("brand", event.target.value)}
                        disabled={!canUpdateForm}
                    />
                    <Input
                        label="Descripción"
                        placeholder="Descripción"
                        value={draftTool.description}
                        onChange={(event) => handleDraftChange("description", event.target.value)}
                        disabled={!canUpdateForm}
                    />
                    <Input
                        label="Modelo"
                        placeholder="Modelo"
                        value={draftTool.model}
                        onChange={(event) => handleDraftChange("model", event.target.value)}
                        disabled={!canUpdateForm}
                    />
                    <Button
                        hideIcon
                        onClick={handleAddTool}
                        disabled={!canSubmitTool || !canUpdateForm}
                        className="self-start lg:self-end"
                    >
                        Agregar
                    </Button>
                </div>
            )}

            {tools.length > 0 && (
                <div className="flex flex-col gap-4">
                    {tools.map((tool, index) => (
                        <div
                            key={`${tool.description}-${tool.brand}-${tool.model}-${index}`}
                            className="grid items-start gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
                        >
                            <Input
                                label="Cantidad"
                                value={tool.quantity}
                                onChange={(event) => handleUpdateTool(index, "quantity", event.target.value)}
                                disabled={!canUpdateForm}
                            />
                            <Input
                                label="Marca"
                                value={tool.brand}
                                onChange={(event) => handleUpdateTool(index, "brand", event.target.value)}
                                disabled={!canUpdateForm}
                            />
                            <Input
                                label="Descripción"
                                value={tool.description}
                                onChange={(event) => handleUpdateTool(index, "description", event.target.value)}
                                disabled={!canUpdateForm}
                            />
                            <Input
                                label="Modelo"
                                value={tool.model}
                                onChange={(event) => handleUpdateTool(index, "model", event.target.value)}
                                disabled={!canUpdateForm}
                            />
                            <Button
                                variant="ghost"
                                icon={DeleteIcon}
                                iconOnly
                                aria-label="Eliminar herramienta"
                                onClick={() => handleRemoveTool(index)}
                                disabled={!canUpdateForm}
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button
                disabled={!canUpdateForm}
                icon={AddIcon}
                variant="outline"
                className="self-start"
                onClick={handleOpenAddTool}
            >
                Agregar otra herramienta
            </Button>
        </div>
    );
};

export default ToolsForm;
