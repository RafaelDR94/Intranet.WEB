import { useCallback, useMemo } from "react";

import type { ActivitiesViewerItem } from "@/app/components/ActivitiesViewer/types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { SingleElement } from "@/app/utilities/PDF/types";
import {
  DOCUMENT_CHECKLIST,
  TOOL_CHECKLIST,
  buildVehicleName,
  findDepartureAndArrival,
  formatFuelLevel,
  formatMileage,
  formatRemarks,
} from "@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/components/RegistDetails.tsx/components/Information/hooks/useInformation";
import {
  buildSignatureErrorMessage,
  fetchVehicleSignature,
} from "@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/components/RegistDetails.tsx/components/Signatures/hooks/useSignatures";
import {
  buildVehiclePicturesErrorMessage,
  fetchVehiclePictures,
} from "@/app/main-page/generalservices/vehicleregist/vehicleregistrylist/components/RegistDetails.tsx/hooks/useVehiclePictures";
import useVehicleMediaStore from "@/app/stores/useVehicleMediaStore/useVehicleMediaStore";
import type {
  VehicleMediaKey,
  VehiclePictureType,
} from "@/app/stores/useVehicleMediaStore/useVehicleMediaStore";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import type { CompleteTransport, VehicleTraking } from "@/app/mappings/transport/transport.types";
import type {
  ImageElement,
  CheckElement,
  DataChartElement,
  SignatureElement,
  FullDocument,
  newDocument,
} from "@/app/utilities/PDF/types";
import { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { formatDateHour } from "@/app/utilities/DatesHelper/Dateshelper";

type ResponsivePeriod = {
  startIso: string;
  endIso?: string | null;
};

type MakeResponsiveParams = {
  employeeId?: string;
  vehicleId?: string;
  period?: ResponsivePeriod;
  /**
   * Si se pasa (aunque sea string vacío), se usa tal cual en el PDF.
   * Si NO se pasa, se intenta obtener la firma desde el assignment actual.
   */
  signatureUrl?: string | null;
};

const buildResponsivePeriodLabel = (period: ResponsivePeriod): string => {
  const hasStart = Boolean(period.startIso && period.startIso.trim().length > 0);
  const hasEnd = Boolean(period.endIso && String(period.endIso).trim().length > 0);
  if (!hasStart && !hasEnd) return "";

  const start = hasStart ? formatDateHour(period.startIso) : "--";
  const end = hasEnd ? formatDateHour(period.endIso as string) : "--";
  return `Periodo: ${start} - ${end}`;
};

const buildChecklist = <Key extends keyof VehicleTraking>(
  tracking: VehicleTraking | undefined,
  options: { label: string; field: Key }[]
): CheckElement[] =>
  options.map((option) => ({
    label: option.label,
    state: Boolean(tracking?.[option.field]),
  }));

const mapPicturesToImages = (items: ActivitiesViewerItem[]): ImageElement[] =>
  items.map((item, index) => ({
    title: `Evidencia ${index + 1}`,
    description: item.description ?? item.title,
    urlimage: item.image ?? "",
  }));

const splitPictures = (
  items: ImageElement[]
): { firstHalf: ImageElement[]; secondHalf: ImageElement[] } => {
  if (!items.length) return { firstHalf: [], secondHalf: [] };
  const midIndex = Math.ceil(items.length / 2);
  return {
    firstHalf: items.slice(0, midIndex),
    secondHalf: items.slice(midIndex),
  };
};

const useVehicleDocuments = () => {
  const { firebasestorage } = useFirebase();
  const { currentAssignment, fetchTransportById } = useTransportStore();
  const { fetchEmployeeById } = useEmployeesStore();

  const assignmentId = currentAssignment?.vehicleassignments_id ?? "";
  const assignmentSignature = currentAssignment?.signature_employee ?? null;

  const mediaEntry = useVehicleMediaStore(
    (state) => (assignmentId ? state.mediaByAssignment[assignmentId] : undefined),
    (a, b) => a === b
  );

  const { setPictures, setSignature, setLoading, setError } =
    useVehicleMediaStore((state) => ({
      setPictures: state.setPictures,
      setSignature: state.setSignature,
      setLoading: state.setLoading,
      setError: state.setError,
    }));

  const ensurePictures = useCallback(
    async (type: VehiclePictureType): Promise<ActivitiesViewerItem[]> => {
      if (!assignmentId) return [];

      const cached = mediaEntry?.pictures?.[type];
      if (cached && cached.length) return cached;

      if (!firebasestorage?.storage) {
        return cached ?? [];
      }

      const key = type as VehicleMediaKey;

      try {
        setLoading(assignmentId, key, true);
        setError(assignmentId, key, undefined);
        const items = await fetchVehiclePictures(
          firebasestorage,
          assignmentId,
          type
        );
        setPictures(assignmentId, type, items);
        return items;
      } catch (err) {
        console.warn(
          `[vehicle-documents] No se pudieron obtener imagenes (${type})`,
          err
        );
        setError(
          assignmentId,
          key,
          buildVehiclePicturesErrorMessage(err)
        );
        return cached ?? [];
      } finally {
        setLoading(assignmentId, key, false);
      }
    },
    [
      assignmentId,
      firebasestorage,
      mediaEntry?.pictures,
      setError,
      setLoading,
      setPictures,
    ]
  );

  const ensureSignature = useCallback(async (): Promise<string | null> => {
    if (!assignmentId) return null;

    const cached = mediaEntry?.signature;

    if (assignmentSignature) {
      if (cached !== assignmentSignature) {
        setSignature(assignmentId, assignmentSignature);
        setError(assignmentId, "signature", undefined);
      }
      return assignmentSignature;
    }

    if (cached !== undefined) {
      return cached;
    }

    if (!firebasestorage?.storage) {
      return null;
    }

    const key: VehicleMediaKey = "signature";

    try {
      setLoading(assignmentId, key, true);
      setError(assignmentId, key, undefined);
      const url = await fetchVehicleSignature(
        firebasestorage,
        assignmentId,
        "departure"
      );
      setSignature(assignmentId, url ?? null);
      return url ?? null;
    } catch (err) {
      console.warn(
        `[vehicle-documents] No se pudo obtener la firma (${assignmentId})`,
        err
      );
      setSignature(assignmentId, null);
      setError(assignmentId, key, buildSignatureErrorMessage(err));
      return null;
    } finally {
      setLoading(assignmentId, key, false);
    }
  }, [
    assignmentId,
    assignmentSignature,
    firebasestorage,
    mediaEntry?.signature,
    setError,
    setLoading,
    setSignature,
  ]);

  const computeTracking = useCallback(
    (arrival: boolean): VehicleTraking | undefined => {
      if (!currentAssignment?.vehicletrackinglist?.length) return undefined;
      const { arrival: arrivalTracking, departure } = findDepartureAndArrival(
        currentAssignment.vehicletrackinglist
      );
      return arrival ? arrivalTracking : departure;
    },
    [currentAssignment?.vehicletrackinglist]
  );

  const makeDocument = useCallback(
    async (arrival: boolean): Promise<FullDocument | null> => {
      if (!currentAssignment || !assignmentId) return null;

      const tracking = computeTracking(arrival);
      if (!tracking) return null;

      const pictureItems = arrival
        ? await ensurePictures("arrive")
        : await ensurePictures("departure");
      const pictureImages = mapPicturesToImages(pictureItems);
      const { firstHalf, secondHalf } = splitPictures(pictureImages);

      const signatureUrl = await ensureSignature();
      const driverName = currentAssignment.name ?? "Conductor";

      let documentdata: DataChartElement[] = [
        { label: "Gasolina", text: formatFuelLevel(tracking.fuelLevel) },
      ];

      const fields: {
        id: string;
        label: string;
        value: string;
        fullWidth?: boolean;
      }[] = [
          { id: "Conductor", label: "Conductor", value: driverName },
          {
            id: "Vehiculo",
            label: "Vehiculo",
            value: buildVehicleName(currentAssignment),
          },
          {
            id: "Destino",
            label: "Destino",
            value: currentAssignment.destination ?? "--",
          },
          {
            id: "Kilometraje",
            label: "Kilometraje",
            value: formatMileage(tracking.mileage),
          },
          {
            id: "date",
            label: "Fecha",
            value: formatDateHour(tracking.date),
          },
          {
            id: "Observaciones",
            label: "Observaciones",
            value: formatRemarks(tracking.remarks),
            fullWidth: true,
          },
        ];

      const signatures: SignatureElement[] = [
        {
          name: driverName,
          signature: signatureUrl ?? undefined,
        },
      ];

      fields.forEach((field) => {
        const label = field.id === "date" ? "Fecha" : field.label;
        const text = field.value ?? "--";
        const fullWidth = field.fullWidth ?? field.id === "Observaciones";

        documentdata.push({
          label,
          text,
          fullWidth: fullWidth || undefined,
        });
      });

      const observaciones = documentdata.find(
        (item) => item.label === "Observaciones"
      );
      if (observaciones) {
        documentdata = documentdata
          .filter((item) => item.label !== "Observaciones")
          .concat(observaciones);
      }

      const documentscheck = buildChecklist(tracking, DOCUMENT_CHECKLIST);
      const toolscheck = buildChecklist(tracking, TOOL_CHECKLIST);

      const infoSection = {
        title: arrival ? "Informacion de llegada" : "Informacion de salida",
        data: documentdata,
      };
      const picturesSection = {
        title: "Evidencias",
        pictures: firstHalf,
      };
      const picturesSection2 = {
        title: "Evidencias",
        pictures: secondHalf,
      };
      const documentsSection = {
        title: "Documentos",
        checks: documentscheck,
      };
      const toolsSection = {
        title: "Herramientas",
        checks: toolscheck,
      };
      const signatureSection = {
        title: "Firma de responsable",
        signatures,
      };

      const page1: newDocument = {
        title: arrival
          ? "Reporte de llegada vehicular"
          : "Reporte de salida vehicular",
        elements: [infoSection, documentsSection, toolsSection, picturesSection2],
      };

      const page2: newDocument = {
        title: "",
        elements: [picturesSection, signatureSection],
      };

      const document: FullDocument = {
        pages: [page1, page2],
      };

      return document;
    },
    [
      assignmentId,
      currentAssignment,
      computeTracking,
      ensurePictures,
      ensureSignature,
    ]
  );

  const makeResponsive = useCallback(
    async (params?: MakeResponsiveParams): Promise<FullDocument | null> => {
      const employeeId = params?.employeeId ?? currentAssignment?.employee_id ?? "";
      const vehicleId =
        params?.vehicleId ?? currentAssignment?.transport?.transport_id ?? "";

      if (!employeeId || !vehicleId) return null;

      const period: ResponsivePeriod =
        params?.period ??
        (() => {
          const trackings = currentAssignment?.vehicletrackinglist ?? [];
          const { departure, arrival } = findDepartureAndArrival(trackings);
          return {
            startIso: departure?.date ?? currentAssignment?.departure_date ?? "",
            endIso: arrival?.date ?? currentAssignment?.arrival_date ?? null,
          };
        })();

      const signaturePromise =
        params?.signatureUrl !== undefined
          ? Promise.resolve(params.signatureUrl ?? "")
          : ensureSignature();

      const [employee, vehicle, signatureUrl] = await Promise.all([
        fetchEmployeeById(employeeId, true),
        fetchTransportById(vehicleId, true),
        signaturePromise,
      ]);

      if (!employee || !vehicle) {
        return null;
      }

      const periodLabel = buildResponsivePeriodLabel(period);

      return makeResponsivedocument(
        employee,
        vehicle,
        signatureUrl ?? "",
        periodLabel,
      );
    },
    [currentAssignment, ensureSignature, fetchEmployeeById, fetchTransportById],
  );


  const makeResponsivedocument = async (
    employe: EmployeeType,
    vehicle: CompleteTransport,
    employesignature: string,
    periodLabel: string,
  ) => {
    const introduction = "El que suscribe, con número de empleado " + employe?.employee_number + ", hago constar que el área de Administración de Servicios Generales me hace entrega de un vehículo propiedad de la empresa con las siguientes características:"
    const paragraph1 = `De esta forma, me comprometo a utilizar dicho vehículo para el desarrollo de las funciones que me fueron autorizadas, mantenerlo en condiciones óptimas de funcionamiento y entregarlo al área de Administración de Servicios Generales en las fechas asignadas de acuerdo con el programa de mantenimiento y/o cuando se tenga una necesidad de reparación o ajuste. La empresa se reserva el derecho de verificar el correcto uso del vehículo.`;
    const paragraph2 = `En caso de siniestro, me obligo a dar aviso a la brevedad posible al área de Administración de Servicios Generales y al líder del área de adscripción, así como a proporcionar la ubicación del siniestro y una breve narración de los hechos ocurridos relacionados con el mismo para el deslinde de responsabilidades. Además, me comprometo a proporcionar al área de Administración de Servicios Generales la "Orden de Reparación" gestionada por el ajustador de la aseguradora correspondiente.`;
    const paragraph3 = `Asimismo, manifiesto y declaro libremente que he entendido que queda estrictamente prohibido hacer alguna modificación y/o adaptación a la unidad asignada, como, por ejemplo: polarización de vidrios, colocación de bocinas extras, luces, etc. Acepto que cualquier accesorio adicional que se le instale al vehículo sin el consentimiento expreso de la empresa se tomará como una donación de mi parte.`;
    const paragraph4 = '“Autorizo a la empresa que me ha contratado a que se realice descuento sobre nómina en virtud de resarcir el daño causado, ya sea por robo, extravió, multas o avería en el vehículo entregado para la ejecución de mis actividades laborales”'
    const carData: DataChartElement[] = [
      {
        label: "Marca",
        text: vehicle.brand,
        fullWidth: false
      },
      {
        label: "Modelo",
        text: vehicle.model,
        fullWidth: false
      },
      {
        label: "Placas",
        text: vehicle.plates,
        fullWidth: false
      },
      {
        label: "No. Economico",
        text: vehicle.economic_number,
        fullWidth: false
      },

      {
        label: "No. Motor",
        text: vehicle.engine_number,
        fullWidth: false
      },

      {
        label: "No. Serie",
        text: vehicle.serial_number,
        fullWidth: false
      },

      {
        label: "Poliza de seguro",
        text: vehicle.insurance_policy,
        fullWidth: false
      },
    ];

    const carData2: DataChartElement[] = [
      {
        label: "Copias de llave",
        text: String(vehicle.key_copy),
        fullWidth: false
      },
      {
        label: "Tarjeta de combustible",
        text: vehicle.fuel_card,
        fullWidth: false
      },
      {
        label: "Tarjeta de circulación",
        text: vehicle.circulation_card,
        fullWidth: false
      },
      {
        label: "TAG o Pase",
        text: vehicle.tag_pass,
        fullWidth: false
      },
    ];

    const InfoCar = {
      title: 'Informacion vehicular',
      data: carData
    };
    const InfoCar2 = {
      title: '',
      data: carData2
    };

    const Introduction: SingleElement = {
      singletitle: "",
      text: introduction,
      borderactive: false
    }

    const Paragraph1: SingleElement = {
      singletitle: "",
      text: paragraph1,
      borderactive: false
    }
    const Paragraph2: SingleElement = {
      singletitle: "",
      text: paragraph2,
      borderactive: false
    }
    const Paragraph3: SingleElement = {
      singletitle: "",
      text: paragraph3,
      borderactive: false
    }
    const Paragraph4: SingleElement = {
      singletitle: "",
      text: paragraph4,
      borderactive: false
    }

    const signature: SignatureElement[] = [{
      name: employe.fullname,
      charge: employe.workposition.name,
      signature: employesignature
    }, {
      name: "___________",
      charge: "Administrador de servicios generales",
      signature: ""
    }];
    const Signature = {
      title: '',
      signatures: signature
    };

    const page: newDocument = {
      folio: periodLabel,
      title: "Responsiva vehicular",
      elements: [Introduction, InfoCar, Paragraph1, Paragraph2, Paragraph3, Paragraph4, InfoCar2, Signature]
    };
    const document: FullDocument = {
      pages: [page]
    };

    return document;
  }


  const canGenerate = useMemo(
    () =>
      Boolean(
        assignmentId &&
        currentAssignment?.vehicletrackinglist &&
        currentAssignment.vehicletrackinglist.length > 0
      ),
    [assignmentId, currentAssignment?.vehicletrackinglist]
  );

  return {
    canGenerate,
    makeDocument,
    makeResponsive
  };
};

export default useVehicleDocuments;
