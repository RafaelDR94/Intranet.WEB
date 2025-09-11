"use client";

import React from "react";

import { useVoucherBlue } from "./hooks/useVoucherBlue";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { PettyCashVoucherData } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";

/**
 * Props para el componente {@link VoucherBlue}.
 */
type Props = {
  /** Define si el formulario se usa para crear o editar */
  mode?: "create" | "edit";
  /** Valores iniciales cuando mode === 'edit' */
  initialValues?: PettyCashVoucherData;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
  /** Para controlar la distribucion */
  responsiveLayoutMatrix?: ResponsiveLayoutMatrix | undefined;
  /** Inicia con el componente deshabilitado */
  startDisabled?: boolean;
  /** Habilita la tabla colapsable */
  enableCollaps?: boolean;
  /** Inicia la tabla colapsada */
  startCollaps?: boolean;
};

/**
 * Formulario para crear o editar vales azules de caja chica.
 * Usa {@link useVoucherBlue} para su lógica interna.
 */
const VoucherBlue: React.FC<Props> = ({
  mode = "create",
  enableCollaps = false,
  startCollaps = false,
  initialValues,
  onClose,
  responsiveLayoutMatrix,
  startDisabled,
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
  } = useVoucherBlue(mode, initialValues, startDisabled);

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
        responsiveLayoutMatrix={
          responsiveLayoutMatrix ?? {
            sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
            md: [
              [5, 5],
              [5, 5],
              [2.5, 2.5, 5],
              [5, 5],
            ],
            lg: [
              [3.3, 3.3, 3.3],
              [3.3, 3.3, 3.3],
              [3.3, 3.3],
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

export default VoucherBlue;
