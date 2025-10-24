import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext"
import { useVehicleRegistryImagesStore } from "@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore";
import { base64ToBlob } from "@/app/utilities/PicturesHelper/PictureHelper";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

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
        await submitUpdate(values, currentAssignment.vehicleassignments_id);
        return;
      }

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

      if (!urlsignature) {
        await firebasestorage?.uploadFile(
          base64ToBlob(signature),
          `VehicleRequest/${assignament.vehicleassignments_id}/departure/signature`,
          true
        );
      }

      await submitUpdate(values, assignament.vehicleassignments_id || "");
    } finally {
      // Garantiza que se cierre el spinner pase lo que pase (éxito o error).
      hideSpinner();
    }
  };

  const submitUpdate = async (values: Record<string, any>, idVehicleAssigment: string) => {
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

      const VehicleTrakingPostModel = {
        idVehicleAssigment,
        vehicleEntryExit: !!currentAssignment,
        fuelLevel: intlevel.toString(),
        mileage: values.mileage,
        remarks: values.destination,
        date: values.date,
        circulationcard,
        fuelCard,
        tagOrpas,
        insurancePolicy,
        platesDelYtra,
        mechanicalOrhydraulicjack,
        keytoRemoveStuds,
        sparetire
      };

      const vehicletraking = await createVehicleTracking(VehicleTrakingPostModel);

      if (!vehicletraking) {
        throw new Error("No se pudo registrar");
      }

      // Sube imágenes correctamente esperando a que terminen todas.
      await Promise.all(
        slots.map(picture =>
          firebasestorage?.uploadFile(
            base64ToBlob(picture.imageSrc),
            `VehicleRequest/${idVehicleAssigment}/${place}/${picture.title}`,
            true
          )
        )
      );
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
