"use client";

import React from "react";

import { InvoicesFormProps } from "../types";

import useInvoicesForm from "./hooks/useInvoicesForm";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import CancelIncon from "@/assets/icons/acciones/cancel.svg"
/* eslint-disable @next/next/no-img-element */

const InvoicesForm: React.FC<InvoicesFormProps> = ({
  responsiveLayoutMatrix,
  externalSubmitRef,
  dataEdit,
  withoutName,
  billingImages,
  onCloseImage,
  disabled,
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
  } = useInvoicesForm({ dataEdit, withoutName, billingImages, onCloseImage, disabled })
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
      enableCollapse={true}
    >
      {/* En movil se apilan; desde md son columnas 3/4 y 1/4 */}
      <div
        className={
          billingImages?.Image
            ? "flex flex-col gap-4 md:flex-row md:items-start"
            : "flex flex-col"
        }
      >
        <div className={billingImages?.Image ? "w-full md:flex-1" : "w-full"}>
          <DynamicForm
            fields={fields}
            loadingFormInfo={loadingFormInfo}
            responsiveLayoutMatrix={
              billingImages
                ? {
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [[5, 5], [5, 5], [3, 3, 3], [3, 3, 3]],
                    lg: [[5, 5], [5, 5], [3, 3, 3], [3, 3, 3]],
                  }
                : responsiveLayoutMatrix
            }
            onSubmit={handleSubmit}
            onValidChange={setFormReady}
            externalSubmitRef={submitRef}
            showSubmitIf={() => false}
          />
        </div>

        {/* Vista previa (1/4) */}
        {billingImages?.Image && (
          <div className="w-full md:w-[190px] md:pl-2 md:shrink-0 md:ml-auto md:self-start">
            <figure
              className="relative mx-auto flex items-center justify-center overflow-hidden rounded-md bg-white-40 shadow-400"
              style={{ width: 172, height: 250 }}
            >
              {/* Boton centrado sobre la imagen */}
              <Button
                onClick={() => {
                  ResetForm();
                  onCloseImage?.();
                }}
                size="xsmall"
                icon={CancelIncon}
                className="absolute left-1/2 bottom-2 -translate-x-1/2 z-10 rounded-full"
              />

              <button
                type="button"
                aria-label="Ver comprobante en grande"
                onClick={() => handleImageClick(billingImages?.Image)}
                className="block h-full w-full focus:outline-none"
              >
                <img
                  src={billingImages?.Image}
                  alt="Comprobante de pago"
                  className="max-h-full max-w-full object-contain cursor-zoom-in"
                />
              </button>
            </figure>
          </div>
        )}
      </div>
    </FormsLayout>
  );
};

export default InvoicesForm;
