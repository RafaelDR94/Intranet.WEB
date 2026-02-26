"use client";

import React, { useEffect } from "react";

import { VoucherFormProps } from "../types";

import { useVoucherPink } from "./hooks/useVoucherPink";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";

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
    authorizerOptions,
    authorizerSelected,
    setAuthorizerSelected,
    authorizerPopUpOpen,
    authorizerError,
    handleAuthorizerConfirm,
    handleAuthorizerCancel,
  } = useVoucherPink({
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
    <>
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
          disabled={disableForm}
          responsiveLayoutMatrix={
            responsiveLayoutMatrix ?? {
              sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
              md: [
                [10],
                [5, 5],
                [5.5, 5.5],
                [5, 5], [5, 5],
              ],
              lg: [
                [10],
                [3.3, 3.3, 3.3],
                [3.3, 3.3, 3.3],
                [10]
              ],
            }
          }
          onSubmit={handleSubmit}
          onValidChange={setFormReady}
          externalSubmitRef={submitRef}
          showSubmitIf={() => false}
        />
      </FormsLayout>

      <PopUp
        open={Boolean(authorizerPopUpOpen)}
        onClose={handleAuthorizerCancel}
        title="Solicitud de vale"
        content="Selecciona al responsable de la aprobacion de tu solicitud de vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleAuthorizerCancel}
        showPrimaryButton
        primaryButtonText="Enviar solicitud"
        onPrimaryButtonClick={handleAuthorizerConfirm}
      >
        <Select
          label="Autorizador"
          placeholder="Selecciona una opcion"
          options={authorizerOptions ?? []}
          selected={authorizerSelected ? [authorizerSelected] : []}
          className="mb-4"
          onChange={(values) => {
            const next = Array.isArray(values) ? values[0] ?? "" : "";
            setAuthorizerSelected?.(next);
          }}
        />
        {authorizerError ? (
          <p className="mt-2 text-b4 text-alert-red-100">{authorizerError}</p>
        ) : null}
      </PopUp>
    </>
  );
};

export default VoucherPink;
