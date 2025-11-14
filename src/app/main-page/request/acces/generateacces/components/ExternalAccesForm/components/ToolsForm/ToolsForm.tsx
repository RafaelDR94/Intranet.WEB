import useToolsForm from "./hooks/useToolsForm";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import { FormsInterface } from "../../types";

const ToolsForm: React.FC<FormsInterface> = ({ canUpdateForm }) => {
    const {
        tools,
        newToolFields,
        responsiveLayout,
        isAddingTool,
        formVersion,
        handleSubmitNewTool,
        handleDraftValuesChange,
        handleUpdateToolValues,
        handleRemoveTool,
        handleOpenAddTool,
        getToolFields
    } = useToolsForm();

    return (
        <div className="flex flex-col gap-6">
            {isAddingTool && (
                <DynamicForm
                    dataTestId="tools-form-create"
                    fields={newToolFields}
                    onSubmit={handleSubmitNewTool}
                    onValuesChange={handleDraftValuesChange}
                    responsiveLayoutMatrix={responsiveLayout}
                    submitLabel="Agregar"
                    showSubmitIf={() => canUpdateForm}
                    disabled={!canUpdateForm}
                    valuesVersion={formVersion}
                />
            )}

            {tools.length > 0 && (
                <div className="flex flex-col gap-4">
                    {tools.map((tool, index) => (
                        <div
                            key={`${tool.description}-${tool.brand}-${tool.model}-${index}`}
                            className="flex flex-col gap-4 lg:flex-row lg:items-start"
                        >
                            <div className="flex-1">
                                <DynamicForm
                                    dataTestId={`tools-form-${index}`}
                                    fields={getToolFields(tool)}
                                    onSubmit={() => undefined}
                                    onValuesChange={(values) => {
                                        if (canUpdateForm) {
                                            handleUpdateToolValues(index, values);
                                        }
                                    }}
                                    responsiveLayoutMatrix={responsiveLayout}
                                    showSubmitIf={() => false}
                                    disabled={!canUpdateForm}
                                />
                            </div>
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
