"use client";

import React, { useEffect } from "react";

import { useTreasuryVoucherPink } from "./hooks/useTreasuryVoucherPink";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { VoucherFormProps } from "@/app/main-page/request/pettycash/pettycashrequest/components/types";

/**
 * Formulario para crear o editar vales rosa desde Tesorería.
 * Replica el comportamiento de {@link VoucherPink} de caja chica,
 * con la diferencia de que el campo de nombre es un select de empleados.
 */
const TreasuryVoucherPink: React.FC<VoucherFormProps> = ({
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
  } = useTreasuryVoucherPink({ mode, dataEdit, startDisabled });

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
              [5, 5],
              [5, 5],
              [5],
              [5, 5],
            ],
            lg: [
              [3,3],
              [3, 3, 3],
              [3, 3.3, 3.3],
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

export default TreasuryVoucherPink;
