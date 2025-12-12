"use client";

import React from "react";

import { useRequisitionForm } from "./hooks/useRequisitionsForm";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Requisition } from "@/app/mappings/requisitions/requisitions.types";
/**
 * Props for the {@link RequisitionsForm} component.
 * @property mode define si el formulario crea o edita.
 * @property initialValues valores iniciales cuando se edita.
 * @property onClose callback para cerrar panel o modal contenedor.
 */
type Props = {
  /** Define si el formulario se usa para crear o editar */
  mode?: "create" | "edit";
  /** Valores iniciales cuando mode === 'edit' */
  initialValues?: Requisition;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
  /** Para controlar la distribucion */
  responsiveLayoutMatrix?: ResponsiveLayoutMatrix | undefined;
  /** Inicia con el componente deshabilitado */
  startDisabled?: boolean;
  /** Habolita la tabla collapsable */
  enableCollaps?: boolean;
  /**Inicia la tabla colapsada */
  startCollaps?: boolean;
  showEditForm?: boolean;
};

/**
 * Formulario para crear o editar requisiciones.
 * Envuelve un {@link DynamicForm} dentro de {@link FormsLayout} y usa
 * {@link useRequisitionForm} para manejar estado y envío.
 */
const RequisitionsForm: React.FC<Props> = ({
  mode = "create",
  enableCollaps = false,
  startCollaps = false,
  initialValues,
  onClose,
  responsiveLayoutMatrix,
  startDisabled,
  showEditForm = false,
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
  } = useRequisitionForm(mode, initialValues, startDisabled);

  if (currentPagePermissions?.requisitionForm)
    return (
      <>
        {currentPagePermissions?.sapprofile ? (
          <div className="bg-white-100 flex gap-6 rounded-lg p-6 shadow-md h-[100%]">
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
              disabled={disableForm}
            />
          </div>
        ) : (
          <FormsLayout
            title={
              mode === "create"
                ? "Solicitud de Requisiciones"
                : "Editar Requisición"
            }
            primaryLabel="Guardar"
            onPrimaryClick={onSubmit}
            primaryDisabled={buttonDisabled || (startDisabled && disableForm)}
            enableCollapse={true}
            showSecondaryButton={mode === "edit" || startDisabled}
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
              disabled={disableForm}
            />
          </FormsLayout>
        )}
      </>
    );
};

export default RequisitionsForm;
