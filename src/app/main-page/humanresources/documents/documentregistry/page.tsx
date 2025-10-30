"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import useDocumentRegistry from "./hooks/useDocumentRegistry";
import DocumentViewer from "@/app/components/DocumentViewer/DocumentViewer";
import { Button } from "@/app/components/Button/Button";
import DocIcon from "@/assets/icons/Docs/page.svg";

const DocumentRegistry = () => {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") ?? undefined;

  const {
    title,
    submitLabel,
    submitRef,
    formReady,
    setFormReady,
    fields,
    responsiveLayoutMatrix,
    handleSubmit,
    handleValuesChange,
    uploadingFile,
  } = useDocumentRegistry(documentId);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <FormsLayout
      title={title}
      primaryLabel={submitLabel}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={false}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
        onValidChange={setFormReady}
        responsiveLayoutMatrix={responsiveLayoutMatrix}
        dataTestId="document-registry-form"
        loading={uploadingFile}
        // 🔹 Escucha los cambios del formulario para cargar archivos
        onValuesChange={(values) => {
          void handleValuesChange(values);
        }}
      >
        <div>
          <Button
            onClick={handleOpen}
            variant="ghost"
            icon={DocIcon}
          > 
          </Button>

          {open && (
            <DocumentViewer
              fileUrl="/ruta/al/archivo.pdf"
              title="Formato Universal de Incidencias"
              onClose={handleClose}
            />
          )}
        </div>
      </DynamicForm>
    </FormsLayout>
  );
};

export default DocumentRegistry;
