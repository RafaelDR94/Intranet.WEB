"use client";

import React from "react";

import { InvoicesFormProps } from "../types";

import useInvoicesForm from "./hooks/useInvoicesForm";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import CancelIncon from "@/assets/icons/acciones/cancel.svg";
/* eslint-disable @next/next/no-img-element */

const defaultTitle =
  "Si ya cuentas con la factura, sube aqui tus archivos XML y PDF";

const InvoicesForm: React.FC<InvoicesFormProps> = ({
  responsiveLayoutMatrix,
  externalSubmitRef,
  submitRequestRef,
  dataEdit,
  withoutName,
  formId,
  billingImages,
  onCloseImage,
  disabled,
  refreshRequisitionId,
  formClassName,
  rowClassName,
  layoutTitle,
  layoutPrimaryLabel,
  headerContent,
  onValidChange,
}) => {
  const {
    fields,
    formVersion,
    loadingFormInfo,
    submitRef,
    formReady,
    setFormReady,
    handleSubmit,
    ResetForm,
    handleImageClick,
    handleValuesChange,
    submitCurrentValues,
  } = useInvoicesForm({
    dataEdit,
    withoutName,
    formId,
    billingImages,
    onCloseImage,
    disabled,
    refreshRequisitionId,
  });

  const handleValidChange = React.useCallback(
    (isValid: boolean) => {
      setFormReady(isValid);
      onValidChange?.(isValid);
    },
    [onValidChange, setFormReady],
  );

  React.useEffect(() => {
    if (!submitRequestRef) return;
    submitRequestRef.current = submitCurrentValues;
    return () => {
      submitRequestRef.current = null;
    };
  }, [submitCurrentValues, submitRequestRef]);

  if (externalSubmitRef) {
    return (
      <DynamicForm
        key={`invoice-form-${formVersion}`}
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        responsiveLayoutMatrix={responsiveLayoutMatrix}
        onSubmit={handleSubmit}
        onValidChange={handleValidChange}
        onValuesChange={handleValuesChange}
        valuesVersion={formVersion}
        valuesVersionActive
        externalSubmitRef={externalSubmitRef}
        showSubmitIf={() => false}
        formClassName={formClassName}
        rowClassName={rowClassName}
      />
    );
  }

  return (
    <div data-tour="requisitions-invoice-form">
      <FormsLayout
        title={layoutTitle ?? defaultTitle}
        primaryLabel={layoutPrimaryLabel ?? "Subir Archivos"}
        onPrimaryClick={() => submitRef.current?.()}
        primaryDisabled={!formReady}
        enableCollapse={true}
        primaryButtonDataTour="requisitions-invoice-submit"
      >
        <div
          className={
            billingImages?.Image
              ? "flex w-full flex-col gap-4 md:flex-row md:items-start"
              : "flex w-full flex-col"
          }
        >
          <div className={billingImages?.Image ? "w-full md:flex-1" : "w-full"}>
            {headerContent}
            <DynamicForm
              key={`invoice-form-${formVersion}`}
              fields={fields}
              loadingFormInfo={loadingFormInfo}
              responsiveLayoutMatrix={
                billingImages
                  ? {
                      sm: [
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                      ],
                      md: [
                        [5, 5],
                        [3.3, 3.3, 3.3],
                        [2.5, 2.5, 2.5, 2.5],
                      ],
                      lg: [
                        [5, 5],
                        [3.3, 3.3, 3.3],
                        [2.5, 2.5, 2.5, 2.5],
                      ],
                    }
                  : responsiveLayoutMatrix
              }
              onSubmit={handleSubmit}
              onValidChange={handleValidChange}
              onValuesChange={handleValuesChange}
              valuesVersion={formVersion}
              valuesVersionActive
              externalSubmitRef={submitRef}
              showSubmitIf={() => false}
              formClassName={formClassName}
              rowClassName={rowClassName}
            />
          </div>

          {billingImages?.Image && (
            <div
              className="w-full md:ml-auto md:w-[190px] md:shrink-0 md:self-start md:pl-2"
              data-tour="requisitions-invoice-preview"
            >
              <figure
                className="bg-white-40 shadow-400 relative mx-auto flex items-center justify-center overflow-hidden rounded-md"
                style={{ width: 172, height: 250 }}
              >
                <Button
                  onClick={() => {
                    ResetForm();
                    onCloseImage?.();
                  }}
                  size="xsmall"
                  icon={CancelIncon}
                  className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full"
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
                    className="max-h-full max-w-full cursor-zoom-in object-contain"
                  />
                </button>
              </figure>
            </div>
          )}
        </div>
      </FormsLayout>
    </div>
  );
};

export default InvoicesForm;
