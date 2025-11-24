import React, { ChangeEvent, useRef } from "react";

import useToolsForm from "./hooks/useToolsForm";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { Button } from "@/app/components/Button/Button";
import AddIcon from "@/assets/icons/acciones/plus.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import { FormsInterface } from "../../types";

const ToolsForm: React.FC<FormsInterface> = ({ canUpdateForm }) => {
  const submitNewToolRef = useRef<(() => void | Promise<any>) | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

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
    handleDownloadTemplate,
    handleImportToolsFile,
    isDownloadingTemplate,
    isProcessingImport,
  } = useToolsForm();

  const triggerUpload = () => uploadInputRef.current?.click();

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportToolsFile(file);
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            variant="solid"
            onClick={handleDownloadTemplate}
            disabled={!canUpdateForm || isDownloadingTemplate}
            className="sm:w-auto"
            hideIcon
          >
            Descargar Plantilla
          </Button>
          <Button
            variant="solid"
            onClick={triggerUpload}
            disabled={!canUpdateForm || isProcessingImport}
            className="sm:w-auto"
            hideIcon
          >
            Subir Excel
          </Button>
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>

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
              key={`tool-${index}`}
              className="flex flex-col gap-4 lg:flex-row lg:items-center"
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
