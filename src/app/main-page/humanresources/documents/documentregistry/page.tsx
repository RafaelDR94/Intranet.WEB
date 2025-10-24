"use client";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

import useDocumentRegistry from "./hooks/useDocumentRegistry";

const DocumentRegistry = () => {
  const {
    title,
    submitLabel,
    submitRef,
    formReady,
    setFormReady,
    fields,
    responsiveLayoutMatrix,
    handleSubmit,
  } = useDocumentRegistry();

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
      />
    </FormsLayout>
  );
};

export default DocumentRegistry;
