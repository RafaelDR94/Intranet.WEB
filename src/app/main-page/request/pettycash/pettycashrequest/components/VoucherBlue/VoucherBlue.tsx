"use client";

import React, { useEffect } from "react";

import { VoucherFormProps } from "../types";

import { useVoucherBlue } from "./hooks/useVoucherBlue";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

/**
 * Formulario para crear o editar vales azules de caja chica.
 * Usa {@link useVoucherBlue} para su lógica interna.
 */
const VoucherBlue: React.FC<VoucherFormProps> = ({
  mode = "create",
  enableCollaps = false,
  startCollaps = false,
  dataEdit,
  onClose,
  responsiveLayoutMatrix,
  startDisabled,
  readOnlyFieldNames,
  externalSubmitRef,
}) => {
  const {
    fields,
    loadingFormInfo,
    setFormReady,
    submitRef,
    handleSubmit,
    onSubmit,
    buttonDisabled,
    currentPagePermissions,
    disableForm,
    setDisableForm,
  } = useVoucherBlue({
    mode,
    dataEdit,
    startDisabled,
    readOnlyFieldNames,
  });

  useEffect(() => {
    if (!externalSubmitRef) return;
    externalSubmitRef.current = () => submitRef.current?.() ?? undefined;
    return () => {
      externalSubmitRef.current = null;
    };
  }, [externalSubmitRef, submitRef]);

  if (externalSubmitRef) {
    return (
      <DynamicForm
        loadingFormInfo={loadingFormInfo}
        fields={fields}
        disabled={disableForm}
        responsiveLayoutMatrix={
          responsiveLayoutMatrix ?? {
            sm: [[10], [10], [10], [10]],
            md: [[10], [10], [10], [10]],
            lg: [[10], [10], [10], [10]],
          }
        }
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    );
  }

  return (
    <FormsLayout
      title="GASTOS NO DEDUCIBLES (Vale Azul)"
      primaryLabel="Enviar Vale"
      onPrimaryClick={onSubmit}
      primaryDisabled={buttonDisabled || (startDisabled && disableForm)}
      enableCollapse={enableCollaps}
      showSecondaryButton={
        currentPagePermissions?.updaterequisitionForm &&
        (mode === "edit" || startDisabled)
      }
      secondaryLabel={disableForm ? "Editar información" : "Cancelar"}
      onSecondaryClick={() => {
        onClose?.();
        setDisableForm((prev) => !prev);
      }}
      startCollaps={startCollaps}
    >
      <DynamicForm
        loadingFormInfo={loadingFormInfo}
        fields={fields}
        disabled={disableForm}
        responsiveLayoutMatrix={
          responsiveLayoutMatrix ?? {
            sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
            md: [[10], [5, 5], [5.5, 5.5], [5, 5]],
            lg: [[10], [3.3, 3.3, 3.3], [3.3, 3.3]],
          }
        }
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    </FormsLayout>
  );
};

export default VoucherBlue;
