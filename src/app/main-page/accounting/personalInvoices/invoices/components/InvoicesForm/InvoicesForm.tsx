"use client";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { InvoicesFormProps } from "../types";
import useInvoicesForm from "./hooks/useInvoicesForm";

const InvoicesForm: React.FC<InvoicesFormProps> = ({
  layoutMatrix,
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
    
  } = useInvoicesForm({ dataEdit, withoutName, billingImages,onCloseImage })

  if (externalSubmitRef) {
    return (
      <DynamicForm
        fields={fields}
        loadingFormInfo={loadingFormInfo}
        layoutMatrix={layoutMatrix}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={externalSubmitRef}
        showSubmitIf={() => false}
      />
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
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10]],
          md: [[10], [5, 5], [5, 5]],
          lg: [[10], [5, 5], [5, 5]],
        }}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />

      {/* Vista previa (1/4) */}
      {billingImages?.Image && (
        <div className="relative md:basis-1/4 md:pl-2 md:shrink-0">
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onCloseImage}
            aria-label="Cerrar imagen"
            className="absolute right-2 top-2 z-10 rounded-full bg-white-100 px-2 py-1 text-black-100 shadow-400 hover:shadow-500 focus:outline-none focus:ring-2 focus:ring-blue-50"
            title="Cerrar"
          >
            ×
          </button>

          {/* Marco fijo y contenido responsivo */}
          <figure
            className="flex items-center justify-center overflow-hidden rounded-md bg-white-100 shadow-400 mx-auto"
            // Altura/anchura máximas para respetar vertical u horizontal sin deformar
            style={{ width: 220, height: 320 }}
          >
            <img
              src={billingImages.Image}
              alt="Comprobante de pago"
              className="max-h-full max-w-full object-contain"
            />
          </figure>
        </div>
      )}
    </FormsLayout>
  );
};

export default InvoicesForm;
