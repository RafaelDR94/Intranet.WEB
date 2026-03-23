"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel, ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import type { SelectedImage } from "@/app/components/ImageUploaderExpanded/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import type { VehicleReassignmentApprovePayload } from "@/app/stores/useTransportStore/types";
import { base64ToBlob } from "@/app/utilities/PicturesHelper/PictureHelper";

export type UseVehicleReassignmentTrackingFormParams = {
  assignmentId: string;
  reassignmentId: string;
  signature: string; // base64
  onClose: () => void;
};

const buildFormId = (reassignmentId: string) =>
  `vehicle-reassignment-approve:${reassignmentId}`;

const buildTrackingImagePath = (assignmentId: string, slotTitle: string) =>
  `VehicleRequest/${assignmentId}/departure/${slotTitle}`;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("No fue posible leer la imagen seleccionada."));
    };
    reader.onerror = () => reject(new Error("Ocurrió un error al cargar la imagen."));
    reader.readAsDataURL(file);
  });

const extractDataUrl = async (value: unknown): Promise<string> => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof File) {
    return readFileAsDataUrl(value);
  }

  if (Array.isArray(value)) {
    const first = value[0] as SelectedImage | undefined;
    if (!first) return "";
    if (first.url) return first.url;
    if (first.file) return readFileAsDataUrl(first.file);
    return "";
  }

  return "";
};

const createFields = (signature: string): FieldModel[] => [
  {
    type: "imageUploaderExpanded",
    name: "front_image",
    label: "Subir imagen frontal de vehículo",
    placeholder: "",
    value: null,
    preview: true,
    validations: [{ type: "required" }],
  },
  {
    type: "imageUploaderExpanded",
    name: "left_side_image",
    label: "Subir imagen lateral izquierda de vehículo",
    placeholder: "",
    value: null,
    preview: true,
    validations: [{ type: "required" }],
  },
  {
    type: "imageUploaderExpanded",
    name: "right_side_image",
    label: "Subir imagen lateral derecha de vehículo",
    placeholder: "",
    value: null,
    preview: true,
    validations: [{ type: "required" }],
  },
  {
    type: "imageUploaderExpanded",
    name: "back_image",
    label: "Subir imagen de atrás del vehículo",
    placeholder: "",
    value: null,
    preview: true,
    validations: [{ type: "required" }],
  },
  {
    type: "imageUploaderExpanded",
    name: "circulation_card_image",
    label: "Subir imagen de la Licencia de conducir",
    placeholder: "",
    value: null,
    preview: true,
    validations: [{ type: "required" }],
  },
  {
    type: "imageUploaderExpanded",
    name: "signature",
    label: "Firma",
    placeholder: "",
    value: null,
    disabled: true,
    preview: true,
    initialFile: {
      name: "Firma",
      ...(signature.startsWith("http://") || signature.startsWith("https://")
        ? { url: signature }
        : { base64: signature }),
    },
  },
  {
    type: "textarea",
    name: "comment",
    label: "Observaciones",
    placeholder: "Si tienes algún comentario sobre el estado del vehículo, descríbela aquí",
    value: "",
    rows: 4,
    validations: [{ type: "required" }],
  },
];

const responsiveLayoutMatrix: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10]],
  md: [[5, 5], [5, 5], [5, 5], [10]],
  lg: [[3, 3, 3], [3, 3, 3], [10]],
};

const isHttpUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

const useVehicleReassignmentTrackingForm = ({
  assignmentId,
  reassignmentId,
  signature,
  onClose,
}: UseVehicleReassignmentTrackingFormParams) => {
  const formId = useMemo(() => buildFormId(reassignmentId), [reassignmentId]);
  const submitRef = useRef<(() => void | Promise<void>) | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { setFields, resetFields, updateField } = useFormFieldsStore.getState();
  const fields = useFormFieldsStore((s) => s.fieldsByFormId[formId] ?? []);
  const formVersion = useFormFieldsStore((s) => s.formVersionsByFormId?.[formId] ?? 0);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { firebasestorage } = useFirebase();

  const { vehicleReassignmentApprove } = useTransportStore(
    (s) => ({
      vehicleReassignmentApprove: s.vehicleReassignmentApprove,
    }),
    shallow
  );

  useEffect(() => {
    setFields(formId, createFields(signature));
    return () => {
      resetFields(formId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, signature]);

  const syncFormValues = useCallback(
    (values: Record<string, unknown>) => {
      Object.entries(values).forEach(([name, value]) => {
        updateField(formId, name, { value: value as FieldModel["value"] });
      });
    },
    [formId, updateField]
  );

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {

            showSpinner({ message: "Subiendo evidencias..." });
      if (!firebasestorage) {
        showAlert({
          type: "error",
          title: "Firebase no configurado",
          description: "No se pudo enviar la aprobación.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        });
        onClose();
              hideSpinner();
             
        return;
      }

      const comment = typeof values.comment === "string" ? values.comment.trim() : "";
      if (!comment){hideSpinner(); return;}

      try {
        setSubmitting(true);
        showSpinner({ message: "Subiendo evidencias..." });

        const [
          frontDataUrl,
          leftDataUrl,
          rightDataUrl,
          backDataUrl,
          cardDataUrl,
        ] = await Promise.all([
          extractDataUrl(values.front_image),
          extractDataUrl(values.left_side_image),
          extractDataUrl(values.right_side_image),
          extractDataUrl(values.back_image),
          extractDataUrl(values.circulation_card_image),
        ]);

        const titleByField: Record<string, string> = {
          front_image: "Frontal "+reassignmentId,
          left_side_image: "Lateral Izquierda "+reassignmentId,
          right_side_image: "Lateral Derecha "+reassignmentId,
          back_image: "Trasera "+reassignmentId,
          circulation_card_image: "Licencia de conducir "+reassignmentId,
        };

        const uploadImage = async (fieldName: keyof typeof titleByField, dataUrl: string) => {
          if (!dataUrl) {
            throw new Error("Faltan evidencias para autorizar el cambio.");
          }
          if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
            return dataUrl;
          }
          const title = titleByField[fieldName];
          return firebasestorage.uploadFile(
            base64ToBlob(dataUrl),
            buildTrackingImagePath(assignmentId, title),
            true
          );
        };

        const [frontUrl, leftUrl, rightUrl, backUrl, cardUrl] = await Promise.all([
          uploadImage("front_image", frontDataUrl),
          uploadImage("left_side_image", leftDataUrl),
          uploadImage("right_side_image", rightDataUrl),
          uploadImage("back_image", backDataUrl),
          uploadImage("circulation_card_image", cardDataUrl),
        ]);

        if (!isHttpUrl(signature)) {
          throw new Error("La firma no es válida.");
        }

        const payload: VehicleReassignmentApprovePayload = {
          id: reassignmentId,
          comment,
          front_image: frontUrl ?? "",
          back_image: backUrl ?? "",
          right_side_image: rightUrl ?? "",
          left_side_image: leftUrl ?? "",
          circulation_card_image: cardUrl ?? "",
          signature: signature,
        };

        showSpinner({ message: "Autorizando cambio..." });
        const ok = await vehicleReassignmentApprove(payload);
        if (!ok) throw new Error("No se pudo autorizar el cambio de conductor");

        showAlert({
          type: "success",
          title: "Cambio exitoso",
          description: "Se ha generado el cambio de conductor exitosamente.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Intenta nuevamente.";
        showAlert({
          type: "error",
          title: "Error",
          description: message,
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        });
      } finally {

        hideSpinner();
        setSubmitting(false);
        onClose();
      }
    },
    [
      assignmentId,
      firebasestorage,
      hideSpinner,
      onClose,
      reassignmentId,
      showAlert,
      showSpinner,
      signature,
      vehicleReassignmentApprove,
    ]
  );

  return {
    fields,
    formVersion,
    formReady,
    setFormReady,
    submitting,
    handleSubmit,
    syncFormValues,
    submitRef,
    responsiveLayoutMatrix,
  };
};

export default useVehicleReassignmentTrackingForm;
