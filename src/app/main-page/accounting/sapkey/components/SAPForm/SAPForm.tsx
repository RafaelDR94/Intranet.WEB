"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type {
  SAPKey,
  SAPKeyPost,
  SAPKeyPut,
} from "@/app/mappings/sapkeys/sapkeys.types";

import {
  SAPKEY_FORM_LAYOUT,
  SAPKEY_GTS_TYPE_OPTIONS,
  SAPKEY_IVA_OPTIONS,
  getIvaNumericValue,
  getIvaOptionId,
} from "../../constants";
import type { SAPFormValues } from "../../types";

type SAPFormProps = {
  mode?: "create" | "edit";
  sapKey: SAPKey | null;
  loadingFormInfo?: boolean;
  submitting?: boolean;
  onBack: () => void;
  onSubmit: (payload: SAPKeyPost | SAPKeyPut) => void | Promise<unknown>;
};

const defaultValues: SAPFormValues = {
  internalKey: "",
  descriptionInternalKey: "",
  ivaOptionId: "",
  satKey: "",
  descriptionSatKey: "",
  gtsType: "",
};

const digitsOnly = (value: unknown) => String(value ?? "").replace(/\D/g, "");

const SAPForm = ({
  mode = "create",
  sapKey,
  loadingFormInfo = false,
  submitting = false,
  onBack,
  onSubmit,
}: SAPFormProps) => {
  const isCreate = mode === "create";
  const submitRef = useRef<(() => void | Promise<unknown>) | null>(null);
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert;

  const [formValues, setFormValues] = useState<SAPFormValues>(defaultValues);
  const [valuesVersion, setValuesVersion] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isCreate) {
      setFormValues(defaultValues);
      setValuesVersion((previous) => previous + 1);
      return;
    }

    if (!sapKey) return;

    setFormValues({
      internalKey: digitsOnly(sapKey.internalKey),
      descriptionInternalKey: sapKey.descriptionInternalKey ?? "",
      ivaOptionId: getIvaOptionId(sapKey.iva, sapKey),
      satKey: digitsOnly(sapKey.satKey),
      descriptionSatKey: sapKey.descriptionSatKey ?? "",
      gtsType: sapKey.gtsType ?? "",
    });
    setValuesVersion((previous) => previous + 1);
  }, [isCreate, sapKey]);

  const fields = useMemo<FieldModel[]>(
    () => [
      {
        type: "input",
        name: "internalKey",
        label: "Tipo de gasto",
        placeholder: "Tipo de gasto",
        value: formValues.internalKey,
        onChange: digitsOnly,
        validations: [{ type: "required" }],
      },
      {
        type: "input",
        name: "descriptionInternalKey",
        label: "Denominación de gasto",
        placeholder: "Denominación de gasto",
        value: formValues.descriptionInternalKey,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "ivaOptionId",
        label: "Grupo IVA",
        placeholder: "Selecciona un grupo IVA",
        value: formValues.ivaOptionId,
        options: SAPKEY_IVA_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        })),
        validations: [{ type: "required" }],
      },
      {
        type: "input",
        name: "satKey",
        label: "Clave SAT",
        placeholder: "Clave SAT",
        value: formValues.satKey,
        onChange: digitsOnly,
        validations: [{ type: "required" }],
      },
      {
        type: "input",
        name: "descriptionSatKey",
        label: "Descripción",
        placeholder: "Descripción",
        value: formValues.descriptionSatKey,
        validations: [{ type: "required" }],
      },
      {
        type: "select",
        name: "gtsType",
        label: "Tipo de clave SAP",
        placeholder: "Selecciona un tipo",
        value: formValues.gtsType,
        options: SAPKEY_GTS_TYPE_OPTIONS.map((option) => ({
          label: option.label,
          value: option.value,
        })),
        validations: [{ type: "required" }],
      },
    ],
    [formValues],
  );

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    setFormValues({
      internalKey: digitsOnly(values.internalKey),
      descriptionInternalKey: String(values.descriptionInternalKey ?? ""),
      ivaOptionId: String(values.ivaOptionId ?? ""),
      satKey: digitsOnly(values.satKey),
      descriptionSatKey: String(values.descriptionSatKey ?? ""),
      gtsType: String(values.gtsType ?? ""),
    });
  }, []);

  const handlePrimaryClick = useCallback(() => {
    submitRef.current?.();
  }, []);

  const handleDynamicSubmit = useCallback(
    async (values: Record<string, any>) => {
      const payload = {
        internalKey: digitsOnly(values.internalKey).trim(),
        descriptionInternalKey: String(
          values.descriptionInternalKey ?? "",
        ).trim(),
        satKey: digitsOnly(values.satKey).trim(),
        descriptionSatKey: String(values.descriptionSatKey ?? "").trim(),
        gtsType: String(values.gtsType ?? "")
          .trim()
          .toUpperCase(),
        iva: getIvaNumericValue(String(values.ivaOptionId ?? "")),
      };

      const missingData =
        !payload.internalKey ||
        !payload.descriptionInternalKey ||
        !payload.satKey ||
        !payload.descriptionSatKey ||
        !payload.gtsType ||
        !String(values.ivaOptionId ?? "").trim();

      if (missingData) {
        showAlert({
          type: "warning",
          title: "Datos incompletos",
          description: "Completa todos los campos visibles para continuar.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
        return;
      }

      if (!isCreate && !sapKey) {
        showAlert({
          type: "error",
          title: "Clave no disponible",
          description:
            "No se encontró información para editar la clave seleccionada.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
        return;
      }

      if (isCreate) {
        await onSubmit(payload);
        return;
      }

      const updatePayload: SAPKeyPut = {
        id: sapKey!.id,
        ...payload,
      };

      await onSubmit(updatePayload);
    },
    [isCreate, onSubmit, sapKey, showAlert],
  );

  if (!isCreate && !sapKey && !loadingFormInfo) {
    return (
      <FormsLayout
        title="Edición de clave SAP y SAT"
        primaryLabel="Guardar cambios"
        primaryDisabled
        enableCollapse={false}
        showSecondaryButton
        secondaryLabel="Cancelar"
        onSecondaryClick={onBack}
      >
        <div className="text-b3 text-gray-70 w-full">
          No se encontró información de la clave seleccionada.
        </div>
      </FormsLayout>
    );
  }

  return (
    <FormsLayout
      title={isCreate ? "Nueva clave SAP y SAT" : "Edición de clave SAP y SAT"}
      primaryLabel={isCreate ? "Registrar clave" : "Guardar cambios"}
      onPrimaryClick={handlePrimaryClick}
      primaryDisabled={!isFormValid || submitting || (!sapKey && !isCreate)}
      enableCollapse={false}
      showSecondaryButton
      secondaryLabel="Cancelar"
      onSecondaryClick={onBack}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleDynamicSubmit}
        responsiveLayoutMatrix={SAPKEY_FORM_LAYOUT}
        onValidChange={setIsFormValid}
        onValuesChange={handleValuesChange}
        valuesVersion={valuesVersion}
        valuesVersionActive
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
        loadingFormInfo={loadingFormInfo}
        disabled={submitting}
        dataTestId="sapkey-form"
      />
    </FormsLayout>
  );
};

export default SAPForm;
