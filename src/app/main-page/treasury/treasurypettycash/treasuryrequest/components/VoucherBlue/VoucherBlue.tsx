"use client";

import React, { useEffect } from "react";

import { useTreasuryVoucherBlue } from "./hooks/useTreasuryVoucherBlue";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import { VoucherFormProps } from "@/app/main-page/request/pettycash/pettycashrequest/components/types";

/**
 * Formulario para crear o editar vales azules desde Tesoreria.
 * Mantiene la estructura del formulario original pero permite seleccionar empleados.
 */
const TreasuryVoucherBlue: React.FC<VoucherFormProps> = ({
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
    authorizerOptions,
    authorizerSelected,
    setAuthorizerSelected,
    authorizerPopUpOpen,
    authorizerError,
    handleAuthorizerConfirm,
    handleAuthorizerCancel,
  } = useTreasuryVoucherBlue({ mode, dataEdit, startDisabled });

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
        title="GASTOS NO DEDUCIBLES (Vale Azul)"
        primaryLabel="Enviar Vale"
        onPrimaryClick={onSubmit}
        primaryDisabled={buttonDisabled || (startDisabled && disableForm)}
        enableCollapse={enableCollaps}
        showSecondaryButton={
          currentPagePermissions?.updaterequisitionForm &&
          (mode === "edit" || startDisabled)
        }
        secondaryLabel={disableForm ? "Editar informacion" : "Cancelar"}
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
                [3, 3],
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

      <PopUp
        open={authorizerPopUpOpen}
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
          options={authorizerOptions}
          selected={authorizerSelected ? [authorizerSelected] : []}
          className="mb-4"
          onChange={(values) => {
            const next = Array.isArray(values) ? values[0] ?? "" : "";
            setAuthorizerSelected(next);
          }}
        />
        {authorizerError ? (
          <p className="mt-2 text-b4 text-alert-red-100">{authorizerError}</p>
        ) : null}
      </PopUp>
    </>
  );
};

export default TreasuryVoucherBlue;
