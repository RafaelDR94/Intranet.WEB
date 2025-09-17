"use client";

import React, { useEffect } from "react";

import { useVoucherPink } from "./hooks/useVoucherPink";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { VoucherFormProps } from "../types";

/**
 * Formulario para crear o editar vales de caja chica.
 * Envuelve un {@link DynamicForm} dentro de {@link FormsLayout} y usa
 * {@link useVoucherPink} para manejar estado y envío.
 */
const VoucherPink: React.FC<VoucherFormProps> = ({
  mode = "create",
  enableCollaps = false,
  startCollaps = false,
  dataEdit,
  onClose,
  responsiveLayoutMatrix,
  startDisabled,
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
  } = useVoucherPink({ mode, dataEdit, startDisabled });

  useEffect(() => {
    if (!externalSubmitRef) return;
    externalSubmitRef.current = () => submitRef.current?.() ?? undefined;
    return () => {
      externalSubmitRef.current = null;
    };
  }, [externalSubmitRef, submitRef]);

  return (
    <FormsLayout
      title="GASTOS DEDUCIBLES (Vale Rosa)"
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
        responsiveLayoutMatrix={
          responsiveLayoutMatrix ?? {
            sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
            md: [
              [10],
              [5, 5],
              [5.5, 5.5],
              [5, 5],
            ],
            lg: [
              [10],
              [3.3, 3.3, 3.3],
              [3.3, 3.3, 3.3],
            ],
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

export default VoucherPink;
