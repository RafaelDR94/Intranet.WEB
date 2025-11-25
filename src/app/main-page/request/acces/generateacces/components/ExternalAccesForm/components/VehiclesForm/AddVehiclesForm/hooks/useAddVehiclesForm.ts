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

import type {
  TransportPost,
  TransportPut,
} from "@/app/mappings/transport/transport.types";

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
    shallow,
  );

  const { createExternalTransport, updateTransport, transportError } =
    useTransportStore(
      (s) => ({
        createExternalTransport: s.createExternalTransport,
        updateTransport: s.updateTransport,
        transportError: s.error,
      }),
      shallow,
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
          type: "file",
          name: "insurance_policy_doc",
          label: "Póliza de seguro",
          value: null,
          initialFile: currentTransport?.insurance_policy_doc
            ? {
                name: "insurance_policy_doc",
                url: currentTransport.insurance_policy_doc,
              }
            : undefined,
          accept: ".pdf",
          preview: true,
          validations: [{ type: "required" }],
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
          validations: [{ type: "required" }],
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
          validations: [{ type: "required" }],
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
          validations: [{ type: "required" }],
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
          validations: [{ type: "required" }],
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
          name: "vehicle_color",
          label: "Color del vehículo",
          value: currentTransport?.vehicle_color ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "engine_number",
          label: "No. de motor",
          value: currentTransport?.engine_number ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "serial_number",
          label: "No. de serie",
          value: currentTransport?.serial_number ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "circulation_card",
          label: "Tarjeta de circulación",
          value: currentTransport?.circulation_card ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "circulation_card_expiration",
          label: "Vencimiento tarjeta de circulación",
          value: currentTransport?.circulation_card_expiration ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "insurance_policy",
          label: "Póliza",
          value: currentTransport?.insurance_policy ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "insurance_company",
          label: "Aseguradora",
          value: currentTransport?.insurance_company ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "policy_issue_date",
          label: "Fecha de expedición de la póliza",
          value: currentTransport?.policy_issue_date ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "policy_expiration",
          label: "Vigencia póliza",
          value: currentTransport?.policy_expiration ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "payment_type",
          label: "Tipo de pago",
          value: currentTransport?.payment_type ?? "",
          validations: [{ type: "required" }],
        },
        {
          type: "input",
          name: "coverage",
          label: "Cobertura",
          value: currentTransport?.coverage ?? "",
          validations: [{ type: "required" }],
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
    }, 500);
  }, [resetFields]);

  const handleUploadCiruculationCard: NonNullable<FieldModel["onChange"]> = (
    value,
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
    if (
      !hasInitCiruclationCard.current &&
      currentTransport?.image_circulation_card
    ) {
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

  // Dentro de tu hook/componente, arriba de handleSubmit

  const uploadOrKeepUrl = async (
    fileOrUrl: any,
    path: string,
    previousUrl?: string,
    type?: string,
  ): Promise<string> => {
    // Si no hay valor, regresa la URL previa o vacío
    if (!fileOrUrl) return previousUrl ?? "";

    // Si ya es URL https, la dejamos tal cual
    if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
      return fileOrUrl;
    }

    // Si es File / Blob u otro tipo soportado, subimos
    try {
      const url =
        type == "File"
          ? await firebasestorage.uploadFile(fileOrUrl, path)
          : await firebasestorage.uploadImage(fileOrUrl, path);
      if (!url) {
        throw new Error("El servicio de almacenamiento no devolvió una URL.");
      }
      return url;
    } catch (err) {
      console.error(`[vehicle] Error subiendo imagen ${path}`, err);
      throw new Error(`Error al subir la imagen (${path}).`);
    }
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

      const [
        image_plates_url,
        image_circulation_card_url,
        front_image_url,
        back_image_url,
        right_side_image_url,
        left_side_image_url,
        insurance_policy_doc_url,
      ] = await Promise.all([
        uploadOrKeepUrl(
          values.image_plates,
          `${basePath}/image_plates`,
          currentTransport?.image_plates,
          "Image",
        ),
        uploadOrKeepUrl(
          values.image_circulation_card,
          `${basePath}/image_circulation_card`,
          currentTransport?.image_circulation_card,
          "Image",
        ),
        uploadOrKeepUrl(
          values.front_image,
          `${basePath}/front_image`,
          currentTransport?.front_image,
          "Image",
        ),
        uploadOrKeepUrl(
          values.back_image,
          `${basePath}/back_image`,
          currentTransport?.back_image,
          "Image",
        ),
        uploadOrKeepUrl(
          values.right_side_image,
          `${basePath}/right_side_image`,
          currentTransport?.right_side_image,
          "Image",
        ),
        uploadOrKeepUrl(
          values.left_side_image,
          `${basePath}/left_side_image`,
          currentTransport?.left_side_image,
          "Image",
        ),
        uploadOrKeepUrl(
          values.insurance_policy_doc,
          `${basePath}/insurance_policy_doc`,
          currentTransport?.insurance_policy_doc,
          "File",
        ),
      ]);

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
          vehicle_color: values.vehicle_color ?? "",
          engine_number: values.engine_number ?? "",
          serial_number: values.serial_number ?? "",
          // seguro
          insurance_policy: values.insurance_policy ?? "",
          insurance_company: values.insurance_company ?? "",
          policy_issue_date: values.policy_issue_date ?? "",
          policy_expiration: values.policy_expiration ?? "",
          payment_type: values.payment_type ?? "",
          coverage: values.coverage ?? "",
          // tarjeta circulación
          circulation_card: values.circulation_card ?? "",
          circulation_card_expiration: values.circulation_card_expiration ?? "",
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
        if (updated) {
          // reflejar cambios en el AccessRequestStore
          updateVehicle(updated.transport_id, updated);

          showAlert({
            type: "success",
            title: "Vehículo actualizado",
            description:
              "La información del vehículo se actualizó correctamente.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2000,
          });
        } else {
          showAlert({
            type: "error",
            title: "No se pudo actualizar el vehículo",
            description:
              transportError ??
              "Intenta nuevamente o comunícate con soporte si el problema persiste.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 4000,
          });
        }
      } else {
        const createPayload: TransportPost = {
          brand: values.brand ?? "",
          model: values.model ?? "",
          plates: values.plates ?? "",
          year: values.year ?? "",
          vehicle_color: values.vehicle_color ?? "",
          engine_number: values.engine_number ?? "",
          serial_number: values.serial_number ?? "",
          insurance_policy: values.insurance_policy ?? "",
          insurance_company: values.insurance_company ?? "",
          policy_issue_date: values.policy_issue_date ?? "",
          policy_expiration: values.policy_expiration ?? "",
          payment_type: values.payment_type ?? "",
          coverage: values.coverage ?? "",
          circulation_card: values.circulation_card ?? "",
          circulation_card_expiration: values.circulation_card_expiration ?? "",
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
        } else {
          showAlert({
            type: "error",
            title: "No se pudo registrar el vehículo",
            description:
              transportError ??
              "Revisa la información e intenta nuevamente en unos minutos.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 4000,
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
