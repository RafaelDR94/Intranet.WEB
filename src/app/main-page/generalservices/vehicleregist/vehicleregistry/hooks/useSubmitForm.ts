/**
 * Gestiona el envio del formulario de registro vehicular tanto para salidas como llegadas.
 * Orquesta la creacion de asignaciones, el seguimiento vehicular y la carga de evidencias.
 */
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext"
import { useVehicleRegistryImagesStore } from "@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore";
import { base64ToBlob } from "@/app/utilities/PicturesHelper/PictureHelper";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { VehicleImageSlot } from "@/app/stores/useVehicleRegistryImagesStore/types";
import type { VehicleTrakingPost } from "@/app/mappings/transport/transport.types";

const useSubmitForm = () => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { firebasestorage } = useFirebase();

  const { createAssignment, currentAssignment, error, createVehicleTracking } = useTransportStore(
    s => ({
      createAssignment: s.createAssignment,
      createVehicleTracking: s.createVehicleTracking,
      currentAssignment: s.currentAssignment,
      error: s.error,
      resetFlags: s.resetFlags
    }),
    shallow
  );

  const sumbitPost = async (values: Record<string, any>) => {
    showSpinner({ message: "Registrando salida" });
    try {
      if (currentAssignment) {
        await submitUpdate(values, currentAssignment.vehicleassignments_id, "");

      }
      else {
        const { signature } = useVehicleRegistryImagesStore.getState();
        const urlsignature = signature.startsWith("data:image") ? "" : signature; // prefer-const

        const AsignamentPostModel = {
          employee_id: String(values.driver),
          transport_id: String(values.vehicle),
          destination: String(values.destination),
          signature_leader: "",
          signature_employee: urlsignature
        };

        const assignament = await createAssignment(AsignamentPostModel);

        if (!assignament) {
          throw new Error("No se pudo registrar");
        }

        let signatureUrl = urlsignature;
        if (!signatureUrl) {
          signatureUrl = await firebasestorage?.uploadFile(
            base64ToBlob(signature),
            `VehicleRequest/${assignament.vehicleassignments_id}/departure/signature`,
            true
          );
        }

        await submitUpdate(values, assignament.vehicleassignments_id || "", signatureUrl || "");
      }


    } finally {
      // Garantiza que se cierre el spinner pase lo que pase (éxito o error).
      hideSpinner();
    }
  };

  const submitUpdate = async (
    values: Record<string, any>,
    idVehicleAssigment: string,
    signatureUrl: string
  ) => {
    showSpinner({ message: "Registrando información" });
    try {
      const { slots } = useVehicleRegistryImagesStore.getState();

      const documentsChecklist: string[] = values.documentsChecklist;
      const toolsChecklist: string[] = values.toolsChecklist;
      const place = currentAssignment ? "arrive" : "departure";

      const circulationcard = documentsChecklist.includes("card");
      const fuelCard = documentsChecklist.includes("fuel_card");
      const tagOrpas = documentsChecklist.includes("tag");
      const insurancePolicy = documentsChecklist.includes("insurance");
      const platesDelYtra = documentsChecklist.includes("plates");

      const mechanicalOrhydraulicjack = toolsChecklist.includes("jack");
      const keytoRemoveStuds = toolsChecklist.includes("lug_wrench");
      const sparetire = toolsChecklist.includes("spare_tire");

      const floatLevel = parseFloat(values.fuelLevel);
      const intlevel = Math.floor(floatLevel);

      if (!firebasestorage) {
        throw new Error("Firebase no configurado correctamente");
      }

      const slotsFiltered = currentAssignment
        ? slots.filter((slot) => slot.title !== "Licencia de conducir")
        : slots;

      const slotUrls = await Promise.all(
        slotsFiltered.map(async (picture) => {
          if (!picture.imageSrc) {
            return { slotId: picture.id, url: "" };
          }
          const url = await firebasestorage.uploadFile(
            base64ToBlob(picture.imageSrc),
            `VehicleRequest/${idVehicleAssigment}/${place}/${picture.title}`,
            true
          );
          return { slotId: picture.id, url };
        })
      );

      const urlBySlotId = new Map<VehicleImageSlot["id"], string>(
        slotUrls.map(({ slotId, url }) => [slotId, url])
      );

      const VehicleTrakingPostModel: VehicleTrakingPost = {
        vehicle_assignment_id: idVehicleAssigment,
        vehicle_entry_exit: !!currentAssignment,
        full_level: intlevel.toString(),
        mileage: String(values.mileage),
        remarks: String(values.destination),
        date: String(values.date),
        circulation_card: circulationcard,
        fuel_card: fuelCard,
        tag_orpas: tagOrpas,
        insurance_policy: insurancePolicy,
        plates_del_ytra: platesDelYtra,
        mechanical_orhydraulic_jack: mechanicalOrhydraulicjack,
        keyto_remove_studs: keytoRemoveStuds,
        spare_tire: sparetire,
        front_image: urlBySlotId.get("front") ?? "",
        back_image: urlBySlotId.get("rear") ?? "",
        right_side_image: urlBySlotId.get("right-side") ?? "",
        left_side_image: urlBySlotId.get("left-side") ?? "",
        circulation_card_image: currentAssignment
          ? ""
          : urlBySlotId.get("license") ?? "",
        signature: signatureUrl,
      };

      const vehicletraking = await createVehicleTracking(VehicleTrakingPostModel);

      if (!vehicletraking) {
        throw new Error("No se pudo registrar");
      }
    } finally {
      // Cierra spinner siempre.
      hideSpinner();
    }
  };

  useEffect(() => {
    if (error) {
      showAlert({
        type: "error",
        title: "No se registró la salida correctamente",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500
      });
    }
  }, [error, showAlert]);

  return { sumbitPost };
};

export default useSubmitForm;


