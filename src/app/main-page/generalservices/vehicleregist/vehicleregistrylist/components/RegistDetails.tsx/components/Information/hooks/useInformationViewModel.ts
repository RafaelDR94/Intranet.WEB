import { useMemo, useState } from "react";

import type { InfoItem } from "@/app/components/InfoCards/types";
import type { LabelType } from "@/app/components/Label/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { VehicleReassignmentView } from "@/app/mappings/transport/transport.types";
import useVehicleDocuments from "@/app/main-page/generalservices/vehicleregist/hooks/useVehicleDocuments";
import {
  hasPendingVehicleReassignment,
  resolveAssignmentDriverName,
} from "@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/utilities/vehicleRegistryRows";
import { buildResponsiveSegments } from "@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/utilities/responsiveSegments";
import { CreatePDF } from "@/app/utilities/PDF/PDF";

import useChangeDriver from "./useChangeDriver";
import useInformation, { buildVehicleName } from "./useInformation";
import type { TrackingInformation } from "../types";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const formatDate = (iso?: string | null) => {
  if (!iso) return "--";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "--" : DATE_FORMATTER.format(d);
};

export const toLabelType = (status?: string | null): LabelType => {
  const normalized = normalizeText(status ?? "");
  if (normalized === "aceptado") return "valido";
  if (normalized === "pendiente") return "pendiente";
  if (normalized === "rechazado") return "rechazado";
  return "restringido";
};

export const isAcceptedOrApproved = (status?: string | null) => {
  const normalized = normalizeText(status ?? "");
  return normalized === "aceptado" || normalized === "aprobado" || normalized === "aprobada";
};

export const buildChecklistTitle = (baseTitle: string, suffix?: string) => {
  if (!suffix) return baseTitle;
  return `${baseTitle} (${suffix})`;
};

export type UseInformationViewModelResult = {
  assignment: ReturnType<typeof useInformation>["assignment"];
  departure?: ReturnType<typeof useInformation>["departure"];
  arrival?: ReturnType<typeof useInformation>["arrival"];
  checklistDefinitions: ReturnType<typeof useInformation>["checklistDefinitions"];

  active: "info" | "history";
  setActive: (value: "info" | "history") => void;
  sections: Array<{ id: string; label: string; data: TrackingInformation }>;

  departureIso: string;
  arrivalIso: string;
  infoCards: InfoItem[][];
  layoutMatrix: number[][];
  historyRows: VehicleReassignmentView[];

  driverName: string;
  hasPendingReassignment: boolean;
  isDriver: boolean;

  changeDriverOpen: boolean;
  openChangeDriverPopUp: () => void;
  closeChangeDriverPopUp: () => void;
  changeDriverOptions: ReturnType<typeof useChangeDriver>["options"];
  changeDriverSelected: ReturnType<typeof useChangeDriver>["selected"];
  setChangeDriverSelected: ReturnType<typeof useChangeDriver>["setSelected"];
  canChangeDriver: ReturnType<typeof useChangeDriver>["canSubmit"];
  changingDriver: ReturnType<typeof useChangeDriver>["changingDriver"];
  handleChangeDriver: ReturnType<typeof useChangeDriver>["handleSubmit"];

  downloadResponsiveForReassignment: (item: VehicleReassignmentView) => Promise<void>;
  openEvidenceCarousel: (item: VehicleReassignmentView) => void;
};

const useInformationViewModel = (): UseInformationViewModelResult => {
  const { user } = useAuth();
  const { usePrincipalAlert, usePrincipalLoading, usePrincipalImage } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showImage } = usePrincipalImage;
  const { assignment, departure, arrival, checklistDefinitions } = useInformation();
  const [active, setActive] = useState<"info" | "history">("info");
  const { makeResponsive } = useVehicleDocuments();

  const {
    popUpOpen: changeDriverOpen,
    openPopUp: openChangeDriverPopUp,
    closePopUp: closeChangeDriverPopUp,
    options: changeDriverOptions,
    selected: changeDriverSelected,
    setSelected: setChangeDriverSelected,
    canSubmit: canChangeDriver,
    changingDriver,
    handleSubmit: handleChangeDriver,
  } = useChangeDriver();

  const currentUserEmployeeId = (user?.idEmployee ?? "").toString().trim();

  const sections = useMemo<Array<{ id: string; label: string; data: TrackingInformation }>>(() => {
    const next: Array<{ id: string; label: string; data: TrackingInformation }> = [];
    if (departure) next.push({ id: "departure", label: "Salida", data: departure });
    if (arrival) next.push({ id: "arrival", label: "Llegada", data: arrival });
    return next;
  }, [departure, arrival]);

  const hasPendingReassignment = assignment ? hasPendingVehicleReassignment(assignment) : false;
  const driverName = assignment ? resolveAssignmentDriverName(assignment) : "";
  const isDriver =
    Boolean(assignment) &&
    Boolean(currentUserEmployeeId) &&
    (assignment?.employee_id ?? "").toString().trim() === currentUserEmployeeId;

  const departureIso = useMemo(() => {
    if (!assignment) return "";

    const fromField = assignment.departure_date?.trim();
    if (fromField) return fromField;
    const tracking =
      assignment.vehicletrackinglist?.find((t) => t.vehicleEntryExit === false) ??
      assignment.vehicletrackinglist?.[0];
    if (tracking?.date) return tracking.date;
    const firstAccepted = Array.isArray(assignment.vehicle_reassignment)
      ? assignment.vehicle_reassignment.find((r) => normalizeText(r.status ?? "") === "aceptado")
      : undefined;
    return firstAccepted?.date_created ?? "";
  }, [assignment]);

  const arrivalIso = useMemo(() => {
    if (!assignment) return "";

    const fromField = assignment.arrival_date?.trim();
    if (fromField) return fromField;
    const tracking =
      assignment.vehicletrackinglist?.find((t) => t.vehicleEntryExit === true) ??
      assignment.vehicletrackinglist?.[1];
    return tracking?.date ?? "";
  }, [assignment]);

  const infoCards = useMemo<InfoItem[][]>(() => {
    if (!assignment) return [];

    const cards: InfoItem[][] = [];

    cards.push([{ label: "Destino", value: assignment.destination || "--" }]);
    cards.push([{ label: "Placa", value: assignment.transport?.plates || "--" }]);
    cards.push([{ label: "Vehículo", value: buildVehicleName(assignment) }]);

    if (departure) {
      cards.push([{ label: "Kilometraje de salida", value: departure.mileage }]);
    }
    if (arrival) {
      cards.push([{ label: "Kilometraje de llegada", value: arrival.mileage }]);
    }

    if (departure) {
      cards.push([{ label: "Gasolina salida", value: departure.fuelLevel }]);
    }
    if (arrival) {
      cards.push([{ label: "Gasolina llegada", value: arrival.fuelLevel }]);
    }

    if (departure) {
      cards.push([{ label: "Observaciones de salida", value: departure.remarks }]);
    }
    if (arrival) {
      cards.push([{ label: "Observaciones de llegada", value: arrival.remarks }]);
    }

    const reassignments: VehicleReassignmentView[] = Array.isArray(assignment.vehicle_reassignment)
      ? assignment.vehicle_reassignment
      : [];
    reassignments.forEach((item) => {
      const comment = item.comment;
      if (!comment || String(comment).trim().length === 0) return;
      const name = item.new_employee_name ? String(item.new_employee_name) : "--";
      cards.push([
        {
          label: `Observaciones de cambio de conductor ${name}`,
          value: String(comment),
        },
      ]);
    });

    return cards;
  }, [assignment, departure, arrival]);

  const layoutMatrix = useMemo(() => {
    const matrix: number[][] = [
      [5, 5], // Destino / Placa
      [10], // VehÃ­culo
    ];

    const hasPair = Boolean(departure) && Boolean(arrival);

    if (departure || arrival) {
      matrix.push(hasPair ? [5, 5] : [10]); // Kilometraje
      matrix.push(hasPair ? [5, 5] : [10]); // Gasolina
    }

    if (departure) matrix.push([10]); // Obs salida
    if (arrival) matrix.push([10]); // Obs llegada

    return matrix;
  }, [departure, arrival]);

  const historyRows = useMemo(() => {
    if (!assignment) return [] as VehicleReassignmentView[];

    const list: VehicleReassignmentView[] = Array.isArray(assignment.vehicle_reassignment)
      ? [...assignment.vehicle_reassignment]
      : [];
    list.sort((a, b) => {
      const at = Date.parse(a.date_created ?? "");
      const bt = Date.parse(b.date_created ?? "");
      if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
      if (Number.isNaN(at)) return 1;
      if (Number.isNaN(bt)) return -1;
      return bt - at;
    });
    return list;
  }, [assignment]);

  const responsiveSegments = useMemo(() => (assignment ? buildResponsiveSegments(assignment) : []), [
    assignment,
  ]);

  const downloadResponsiveForReassignment = async (item: VehicleReassignmentView) => {
    if (!assignment) return;
    if (!isAcceptedOrApproved(item.status)) return;

    const segment = responsiveSegments.find((s) => s.reassignmentId === item.id);
    if (!segment) {
      showAlert({
        type: "warning",
        title: "Información incompleta",
        description:
          "No se encontró el periodo de esta asignación para generar la responsiva.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    const transportId = assignment.transport?.transport_id;
    if (!transportId) return;

    const normalizeFilename = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .toLowerCase();

    try {
      showSpinner({ message: "Generando responsiva..." });

      const pdfData = await makeResponsive({
        employeeId: segment.employeeId,
        vehicleId: transportId,
        period: segment.period,
        signatureUrl: segment.reassignmentId ? segment.signatureUrl ?? "" : undefined,
      });

      if (!pdfData) {
        throw new Error("No se pudo construir la responsiva");
      }

      const url = await new Promise<string>((resolve, reject) => {
        try {
          CreatePDF(pdfData, resolve);
        } catch (err) {
          reject(err);
        }
        setTimeout(
          () => reject(new Error("Tiempo de espera excedido al generar el PDF")),
          10000,
        );
      });

      const driverSlug = normalizeFilename(segment.employeeName ?? "conductor");
      const filename = `responsiva-vehicular-${assignment.vehicleassignments_id}-${driverSlug}.pdf`;
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      showAlert({
        type: "info",
        title: "Documento generado",
        description: "La responsiva se descargó correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      });
    } catch (error) {
      console.error("[vehicle-documents] Error generando responsiva", error);
      const message =
        error instanceof Error ? error.message : "Intenta nuevamente en unos segundos.";
      showAlert({
        type: "error",
        title: "No se pudo generar la responsiva",
        description: message,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
    } finally {
      hideSpinner();
    }
  };

  const openEvidenceCarousel = (item: VehicleReassignmentView) => {
    if (!assignment) return;
    if (!isAcceptedOrApproved(item.status)) return;

    const title = item.new_employee_name ?? undefined;
    const description = formatDate(item.date_created);
    const images = [
      { label: "Frontal", url: item.front_image },
      { label: "Trasera", url: item.back_image },
      { label: "Lateral derecha", url: item.right_side_image },
      { label: "Lateral izquierda", url: item.left_side_image },
      { label: "Licencia", url: item.circulation_card_image },
      { label: "Firma", url: item.signature },
    ]
      .filter((entry) => typeof entry.url === "string" && entry.url.trim().length > 0)
      .map((entry) => ({
        image: entry.url as string,
        alt: entry.label,
        title,
        description,
      }));

    if (images.length === 0) {
      showAlert({
        type: "warning",
        title: "Sin evidencias",
        description: "No se encontraron imágenes para esta asignación.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2500,
      });
      return;
    }

    showImage({
      items: images,
      initialIndex: 0,
      alt: "Evidencia",
    });
  };

  return {
    assignment,
    departure,
    arrival,
    checklistDefinitions,
    active,
    setActive,
    sections,
    departureIso,
    arrivalIso,
    infoCards,
    layoutMatrix,
    historyRows,
    driverName,
    hasPendingReassignment,
    isDriver,
    changeDriverOpen,
    openChangeDriverPopUp,
    closeChangeDriverPopUp,
    changeDriverOptions,
    changeDriverSelected,
    setChangeDriverSelected,
    canChangeDriver,
    changingDriver,
    handleChangeDriver,
    downloadResponsiveForReassignment,
    openEvidenceCarousel,
  };
};

export default useInformationViewModel;

