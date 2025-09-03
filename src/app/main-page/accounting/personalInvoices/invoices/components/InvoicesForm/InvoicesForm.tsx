"use client";

import React from "react";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { InvoicesFormProps } from "../types";
import useInvoicesForm from "./hooks/useInvoicesForm";
import { Button } from "@/app/components/Button/Button";
import CancelIncon from "@/assets/icons/acciones/cancel.svg"
import { useAuth } from "@/app/context/AuthContext/AuthContext";

const InvoicesForm: React.FC<InvoicesFormProps> = ({
  responsiveLayoutMatrix,
  externalSubmitRef,
  dataEdit,
  withoutName,
  billingImages,
  onCloseImage,
}) => {
  const {
    fields,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
    ResetForm,
    handleImageClick
  } = useInvoicesForm({ dataEdit, withoutName, billingImages, onCloseImage, })
  const { currentPagePermissions } = useAuth();
  if(!currentPagePermissions.canAddDocuments) return;
  if (externalSubmitRef) {
    return (
      <DynamicForm
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        responsiveLayoutMatrix={responsiveLayoutMatrix}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={externalSubmitRef}
        showSubmitIf={() => false}
      >

      </DynamicForm>

    );
  }

  return (
    <FormsLayout
      title="Si ya cuentas con la factura, sube aquí tus archivos XML y PDF"
      primaryLabel="Subir Archivos"
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      enableCollapse={false}
    >
      {/* En móvil se apilan; desde md son columnas 3/4 y 1/4 */}

      <DynamicForm
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        responsiveLayoutMatrix={billingImages ? {
          sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
          md: [[5, 5], [5, 5], [5, 2.5, 2.5], [5, 5]],
          lg: [[5, 5], [5, 5], [4.9, 1.3, 1.3], [5, 5]],
        } : responsiveLayoutMatrix}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />



      {/* Vista previa (1/4) */}
      {billingImages?.Image && (
        <div className="md:basis-1/4 md:pl-2 md:shrink-0" >
          <figure
            className="relative mx-auto flex items-center justify-center overflow-hidden rounded-md bg-white-40 shadow-400"
            style={{ width: 172, height: 250 }}
          >
            {/* Botón centrado sobre la imagen */}
            <Button
              onClick={() => { ResetForm(); onCloseImage?.(); }}
              size="xsmall"
              icon={CancelIncon}
              className="absolute left-1/2 bottom-2 -translate-x-1/2 z-10 rounded-full"
            />


            <button
              type="button"
              aria-label="Ver comprobante en grande"
              onClick={() => handleImageClick(billingImages.Image)}
              className="block h-full w-full focus:outline-none"
            >
              <img
                src={billingImages.Image}
                alt="Comprobante de pago"
                className="max-h-full max-w-full object-contain cursor-zoom-in"
              />
            </button>
          </figure>
        </div>
      )}
    </FormsLayout>
  );
};

export default InvoicesForm;
