import { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import { FieldModel } from "@/app/components/DynamicForm/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { askForOCR } from "@/app/utilities/OCR/AskForOCR";
import {
  parseCirculationCard,
  ParsedCirculationCard,
} from "@/app/utilities/OCR/CirculationCardparcer";

import type { TransportPost, TransportPut } from "@/app/mappings/transport/transport.types";

import type { AddVehicleFormProps } from "../types";

const useAddVehiclesForm = ({
  formId,
  currentTransport,
}: AddVehicleFormProps) => {
  const hasInitFields = useRef(false);
  const hasInitCiruclationCard = useRef(false);
  const { addVehicle, updateVehicle } = useAccessRequestStore(
    (s) => ({
      addVehicle: s.addVehicle,
      updateVehicle: s.updateVehicle,
    }),
    shallow
  );

  const { createExternalTransport, updateTransport } = useTransportStore(
    (s) => ({
      createExternalTransport: s.createExternalTransport,
      updateTransport: s.updateTransport
    }),
    shallow
  );

  const { all } = useQuery();
  const currentEnterpriseId = all.enterpriseId;

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

  const { fieldsByFormId, setFields, resetFields, updateField } =
    useFormFieldsStore();
  const [canStart, setCanStart] = useState(false);

  const { firebasestorage } = useFirebase();

  const loadInitialFields = () => {
    if (hasInitFields.current) return;

    const initialFields: () => FieldModel[] = () => {
      const model: FieldModel[] = [
        // Imágenes
        {
          type: "imageUploaderExpanded",
          name: "image_plates",
          label: "Imagen placa",
          value: null,
          initialFile: currentTransport?.image_plates
            ? { name: "image_plates.jpg", url: currentTransport.image_plates }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
          validations: [{ type: "required" }],
        },
        {
          type: "imageUploaderExpanded",
          name: "image_circulation_card",
          label: "Imagen tarjeta de circulación",
          value: null,
          initialFile: currentTransport?.image_circulation_card
            ? {
              name: "image_circulation_card.jpg",
              url: currentTransport.image_circulation_card,
            }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
          validations: [{ type: "required" }],
          onChange: handleUploadCiruculationCard,
        },
        {
          type: "imageUploaderExpanded",
          name: "front_image",
          label: "Imagen frontal del automóvil",
          value: null,
          initialFile: currentTransport?.front_image
            ? { name: "front_image.jpg", url: currentTransport.front_image }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
        },
        {
          type: "imageUploaderExpanded",
          name: "right_side_image",
          label: "Imagen lateral derecha",
          value: null,
          initialFile: currentTransport?.right_side_image
            ? {
              name: "right_side_image.jpg",
              url: currentTransport.right_side_image,
            }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
        },
        {
          type: "imageUploaderExpanded",
          name: "left_side_image",
          label: "Imagen lateral izquierda",
          value: null,
          initialFile: currentTransport?.left_side_image
            ? {
              name: "left_side_image.jpg",
              url: currentTransport.left_side_image,
            }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
        },
        {
          type: "imageUploaderExpanded",
          name: "back_image",
          label: "Imagen trasera del vehículo",
          value: null,
          initialFile: currentTransport?.back_image
            ? { name: "back_image.jpg", url: currentTransport.back_image }
            : undefined,
          accept: ".jpg,.jpeg,.png",
          preview: true,
        },
        {
          type: "imageUploaderExpanded",
          name: "insurance_policy_doc",
          label: "Póliza de seguro",
          value: null,
          initialFile: currentTransport?.insurance_policy_doc
            ? {
              name: "insurance_policy_doc.jpg",
              url: currentTransport.insurance_policy_doc,
            }
            : undefined,
          accept: ".jpg,.jpeg,.png,.pdf",
          preview: true,
        },
        // Datos principales
        {
          type: "input",
          name: "plates",
          label: "Placa",
          value: currentTransport?.plates ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "brand",
          label: "Marca",
          value: currentTransport?.brand ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "model",
          label: "Modelo",
          value: currentTransport?.model ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "year",
          label: "Año",
          value: currentTransport?.year ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "engine_number",
          label: "No. de motor",
          value: currentTransport?.engine_number ?? "",
        },
        {
          type: "input",
          name: "serial_number",
          label: "No. de serie",
          value: currentTransport?.serial_number ?? "",
        },
        {
          type: "input",
          name: "circulation_card",
          label: "Tarjeta de circulación",
          value: currentTransport?.circulation_card ?? "",
        },
        {
          type: "input",
          name: "circulation_card_expiration",
          label: "Vencimiento tarjeta de circulación",
          value: currentTransport?.circulation_card_expiration ?? "",
        },
        {
          type: "input",
          name: "insurance_policy",
          label: "Póliza",
          value: currentTransport?.insurance_policy ?? "",
        },
        {
          type: "input",
          name: "policy_expiration",
          label: "Vigencia póliza",
          value: currentTransport?.policy_expiration ?? "",
        },
        {
          type: "input",
          name: "economic_number",
          label: "No. económico",
          value: currentTransport?.economic_number ?? "",
        },
        {
          type: "input",
          name: "fuel_card",
          label: "Tarjeta de combustible",
          value: currentTransport?.fuel_card ?? "",
        },
        {
          type: "input",
          name: "tag_pass",
          label: "TAG / PASE",
          value: currentTransport?.tag_pass ?? "",
        },
        {
          type: "number",
          name: "key_copy",
          label: "Copias de llave",
          value: currentTransport?.key_copy ?? 0,
        },
      ];

      return model;
    };


    setFields(formId, initialFields());
    hasInitFields.current = true;
    setCanStart(true);
  };

  useEffect(() => {
    resetFields(formId);
    setTimeout(() => {
      loadInitialFields();
      setCanStart(true);
    }, 500)
  }, [resetFields])

  const handleUploadCiruculationCard: NonNullable<FieldModel["onChange"]> = (
    value
  ) => {
    if (!(value instanceof File)) {
      showAlert({
        type: "warning",
        title: "Archivo no soportado",
        description:
          "Selecciona una imagen válida en formato JPG o PNG para la tarjeta de circulación.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      return;
    }
    if (!hasInitCiruclationCard.current && currentTransport?.image_circulation_card) {
      hasInitCiruclationCard.current = true;
      return;
    }
    void (async () => {
      showSpinner({ message: "Leyendo tarjeta de circulación..." });
      try {
        const { text } = await askForOCR(value);

        if (!text) {
          throw new Error("El servicio OCR no devolvió texto legible.");
        }

        const parsed: ParsedCirculationCard = parseCirculationCard(text);

        const plates = parsed.vehiculo.placa?.trim();
        const model =
          parsed.vehiculo?.modelo != null
            ? String(parsed.vehiculo.modelo)
            : undefined;
        const brand = parsed.vehiculo?.marca?.trim();
        const serialNumber = parsed.vehiculo?.serie_vehicular?.trim();
        const engineNumber = parsed.vehiculo?.numero_motor?.trim();
        const circulationCard = parsed.documento?.numero_tarjeta?.trim();
        const circulationVigence = parsed.documento?.vigencia?.trim();

        if (plates) {
          updateField(formId, "plates", {
            value: plates,
          });
        }
        if (brand) {
          updateField(formId, "brand", {
            value: brand,
          });
        }
        if (model) {
          updateField(formId, "model", {
            value: model,
          });
        }
        if (serialNumber) {
          updateField(formId, "serial_number", {
            value: serialNumber,
          });
        }
        if (engineNumber) {
          updateField(formId, "engine_number", {
            value: engineNumber,
          });
        }
        if (circulationCard) {
          updateField(formId, "circulation_card", {
            value: circulationCard,
          });
        }
        if (circulationVigence) {
          updateField(formId, "circulation_card_expiration", {
            value: circulationVigence,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[vehicles] Error procesando tarjeta circulación", error);
        const description =
          error instanceof Error
            ? error.message
            : "No se pudo completar el análisis. Intenta nuevamente.";
        showAlert({
          type: "error",
          title: "Error al procesar la tarjeta de circulación",
          description,
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 4000,
        });
      } finally {
        hideSpinner();
      }
    })();
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const enterpriseId = currentEnterpriseId;
      if (!enterpriseId) {
        showAlert({
          type: "warning",
          title: "Empresa no seleccionada",
          description: "Selecciona una empresa antes de registrar el vehículo.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1500,
        });
        return;
      }

      showSpinner({ message: "Guardando vehículo..." });

      const basePath = `Vehicles/${values.plates || "sin-placa"}`;

      const image_plates_url = values.image_plates
        ? await firebasestorage.uploadFile(
          values.image_plates,
          `${basePath}/image_plates`
        )
        : "";

      const image_circulation_card_url = values.image_circulation_card
        ? await firebasestorage.uploadFile(
          values.image_circulation_card,
          `${basePath}/image_circulation_card`
        )
        : "";

      const front_image_url = values.front_image
        ? await firebasestorage.uploadFile(
          values.front_image,
          `${basePath}/front_image`
        )
        : "";

      const back_image_url = values.back_image
        ? await firebasestorage.uploadFile(
          values.back_image,
          `${basePath}/back_image`
        )
        : "";

      const right_side_image_url = values.right_side_image
        ? await firebasestorage.uploadFile(
          values.right_side_image,
          `${basePath}/right_side_image`
        )
        : "";

      const left_side_image_url = values.left_side_image
        ? await firebasestorage.uploadFile(
          values.left_side_image,
          `${basePath}/left_side_image`
        )
        : "";

      const insurance_policy_doc_url = values.insurance_policy_doc
        ? await firebasestorage.uploadFile(
          values.insurance_policy_doc,
          `${basePath}/insurance_policy_doc`
        )
        : "";

      // UPDATE vs CREATE (igual que useAddExternalPersonForm)
      if (currentTransport?.transport_id) {
        const updatePayload: TransportPut = {
          transport_id: currentTransport.transport_id,
          is_external: currentTransport.is_external,
          // datos base
          plates: values.plates ?? "",
          brand: values.brand ?? "",
          model: values.model ?? "",
          year: values.year ?? "",
          engine_number: values.engine_number ?? "",
          serial_number: values.serial_number ?? "",
          // seguro
          insurance_policy: values.insurance_policy ?? "",
          policy_expiration: values.policy_expiration ?? "",
          // tarjeta circulación
          circulation_card: values.circulation_card ?? "",
          circulation_card_expiration:
            values.circulation_card_expiration ?? "",
          // imágenes (si no suben nuevas, conserva las anteriores)
          image_plates: image_plates_url || currentTransport.image_plates || "",
          image_circulation_card:
            image_circulation_card_url ||
            currentTransport.image_circulation_card ||
            "",
          front_image: front_image_url || currentTransport.front_image || "",
          right_side_image:
            right_side_image_url || currentTransport.right_side_image || "",
          left_side_image:
            left_side_image_url || currentTransport.left_side_image || "",
          back_image: back_image_url || currentTransport.back_image || "",
          // póliza doc
          insurance_policy_doc:
            insurance_policy_doc_url ||
            currentTransport.insurance_policy_doc ||
            "",
          // extras
          UnitType: values.UnitType ?? currentTransport.Unit_type ?? "",
          fuel_card: values.fuel_card ?? currentTransport.fuel_card ?? "",
          key_copy: Number(values.key_copy ?? currentTransport.key_copy ?? 0),
          tag_pass: values.tag_pass ?? currentTransport.tag_pass ?? "",
          economic_number:
            values.economic_number ?? currentTransport.economic_number ?? "",
          id_external_enterprise: String(enterpriseId),
        };

        const updated = await updateTransport(updatePayload);
        console.log("updated", updated);
        if (updated) {

          // reflejar cambios en el AccessRequestStore
          updateVehicle(updated.transport_id, updated);

          showAlert({
            type: "success",
            title: "Vehículo actualizado",
            description: "La información del vehículo se actualizó correctamente.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2000,
          });
        }
      } else {
        const createPayload: TransportPost = {
          brand: values.brand ?? "",
          model: values.model ?? "",
          plates: values.plates ?? "",
          year: values.year ?? "",
          engine_number: values.engine_number ?? "",
          serial_number: values.serial_number ?? "",
          insurance_policy: values.insurance_policy ?? "",
          policy_expiration: values.policy_expiration ?? "",
          circulation_card: values.circulation_card ?? "",
          circulation_card_expiration:
            values.circulation_card_expiration ?? "",
          image_plates: image_plates_url,
          image_circulation_card: image_circulation_card_url,
          front_image: front_image_url,
          back_image: back_image_url,
          right_side_image: right_side_image_url,
          left_side_image: left_side_image_url,
          insurance_policy_doc: insurance_policy_doc_url,
          UnitType: values.UnitType ?? "",
          fuel_card: values.fuel_card ?? "",
          key_copy: Number(values.key_copy ?? 0),
          tag_pass: values.tag_pass ?? "",
          economic_number: values.economic_number ?? "",
          id_external_enterprise: String(enterpriseId),
        };

        const created = await createExternalTransport(createPayload);

        if (created) {
          addVehicle(created as any);
          showAlert({
            type: "success",
            title: "Vehículo registrado",
            description: "El vehículo se registró correctamente.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2000,
          });
        }
      }

      resetFields(formId);
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "No se pudo registrar el vehículo, intenta nuevamente.";
      showAlert({
        type: "error",
        title: "Error al registrar el vehículo",
        description,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 4000,
      });
    } finally {
      hideSpinner();
    }
  };




  return {
    fields: fieldsByFormId[formId] ?? [],
    handleSubmit,
    canStart,
  };
};

export default useAddVehiclesForm;
