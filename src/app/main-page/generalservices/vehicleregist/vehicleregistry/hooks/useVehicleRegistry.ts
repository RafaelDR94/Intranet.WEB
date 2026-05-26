/**
 * Orquesta el flujo del registro vehicular y expone handlers para el formulario y la carga de evidencias.
 * Determina el tipo de registro, sincroniza la vista activa y gestiona los mensajes al usuario.
 */
import useQuery from "@/app/hooks/useQuery/useQuery";
import useInitForm from "./useInitForm";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicleRegistryImagesStore } from "@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore";
import useSubmitForm from "./useSubmitForm";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
const responsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [5, 5],
    [5, 5],
    [10],
    [10],
    [10],
    [10],
    [10],
  ],
  lg: [
    [4, 4, 2],
    [5, 5],
    [10],
    [3.5, 3.5, 3],
  ],
};

const useVehicleRegistry = () => {
  const {
    slots,
    signature,
  } = useVehicleRegistryImagesStore((state) => ({
    slots: state.slots,
    signature: state.signature,
  }), shallow);

  const { currentAssignment, resetCurrentAssignment } = useTransportStore(
    (s) => ({
      currentAssignment: s.currentAssignment,
      resetCurrentAssignment: s.resetCurrentAssignment
    }),
    shallow
  );
  const { sumbitPost } = useSubmitForm();
  const { all } = useQuery();
  const [currentView, setCurrentView] = useState<"form" | "pictures">("form");
  const place = String(all.place);
  const id = String(all.id);
  const formType = place === "arrive" ? "arrive" : "departure";
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const router = useRouter();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    submitRef,
    formReady,
    setFormReady,
    fields,
    formVersion,
    syncFormValues,
    formId,
  } = useInitForm(formType);
  const title =
    place === "arrive"
      ? "Registro Vehicular de Llegada"
      : "Registro Vehicular de Salida";
  const submitLabel =
    place === "arrive" ? "Registrar Llegada" : "Registrar Salida";

  const hasSignature = Boolean(signature);

  const slotstoreview = currentAssignment?slots.filter(slot=>slot.title!="Licencia de conducir"):slots
  const allImagesCaptured = useMemo(
    () => slotstoreview.length > 0 && slotstoreview.every((slot) => Boolean(slot.file) || Boolean(slot.imageSrc)),
    [slotstoreview]
  );
  const {
    resetAll
  } = useVehicleRegistryImagesStore((state) => ({
    resetAll: state.resetAll
  }), shallow);

  const formIsCompleted = formReady && (hasSignature || currentAssignment?.vehicleassignments_id) && allImagesCaptured;

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      await sumbitPost(values);
      showAlert({
        type: "success",
        title: "Se registro correctamente",
        description: "El registro vehicular tuvo exito",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/main-page/generalservices/vehicleregist/vehicleregistrylist/");
      }, 1500);
    } catch (error) {
       showAlert({
        type: "warning",
        title: "Su registro tuvo el siguiente problema",
        description: String(error),
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
  };
  const handleNext = () => {
    setCurrentView("pictures");
  }
  const handleBack = () => {
    setCurrentView("form");
  }


  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (id == "undefined") {
      resetCurrentAssignment();
    }
    resetAll();
  }, [id,resetAll,resetCurrentAssignment])


  return {
    title,
    submitRef,
    submitLabel,
    formReady,
    fields,
    syncFormValues,
    formId,
    formVersion,
    setFormReady,
    responsiveLayoutMatrix,
    handleSubmit,
    currentView,
    handleNext,
    handleBack,
    formIsCompleted,
  };
};

export default useVehicleRegistry;




