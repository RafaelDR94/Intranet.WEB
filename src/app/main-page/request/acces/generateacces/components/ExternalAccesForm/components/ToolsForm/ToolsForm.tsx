import { useRef } from "react";

import useToolsForm from "./hooks/useToolsForm";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import { FormsInterface } from "../../types";

const ToolsForm: React.FC<FormsInterface> = ({ canUpdateForm }) => {
  const submitNewToolRef = useRef<(() => void | Promise<any>) | null>(null);

  const {
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
  } = useToolsForm();

  return (
    <div className="flex flex-col gap-6">
      {isAddingTool && (
        <div className="flex flex-col gap-4">
          <DynamicForm
            dataTestId="tools-form-create"
            fields={newToolFields}
            onSubmit={handleSubmitNewTool}
            onValuesChange={handleDraftValuesChange}
            responsiveLayoutMatrix={responsiveLayout}
            showSubmitIf={() => false}
            externalSubmitRef={submitNewToolRef}
            disabled={!canUpdateForm}
            valuesVersion={formVersion}
          />
          <Button
            hideIcon
            disabled={!canUpdateForm || !canSubmitNewTool}
            onClick={() => submitNewToolRef.current?.()}
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
