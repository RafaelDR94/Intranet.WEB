import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { InternalDevice, InternalDeviceAssignment } from "@/app/mappings/internaldevices/internaldevices.types";
import type {
  DataChartElement,
  FullDocument,
  SignatureElement,
  SingleElement,
  newDocument,
} from "@/app/utilities/PDF/types";
import { currentDateEs, formatDateHour } from "@/app/utilities/DatesHelper/Dateshelper";

type BuildDeviceAssignmentResponsiveParams = {
  assignment: InternalDeviceAssignment;
  device: InternalDevice;
  employee: EmployeeType;
  signatureUrl?: string | null;
};

/**
 * Construye el documento PDF de responsiva para asignacion de dispositivos.
 */
export const buildDeviceAssignmentResponsiveDocument = ({
  assignment,
  device,
  employee,
  signatureUrl,
}: BuildDeviceAssignmentResponsiveParams): FullDocument => {
  const assignmentDate = formatDateHour(
    assignment.date ?? assignment.created_at ?? new Date().toISOString(),
  );

  const locationDate = `Mexico, CDMX a ${currentDateEs(new Date())}`;

  const introText =
    `Por medio de la presente, hago constar que recibo de parte de DR Mexico, ` +
    `S.A. de C.V. para el desempeño de mi trabajo un equipo de computo ` +
    `propiedad de la empresa con las siguientes caracteristicas:`;

  const responsibilitiesIntro =
    "Por mi parte acepto la responsabilidad del cuidado y resguardo del " +
    "mismo cumpliendo con las normas que se detallan a continuacion:";

  const finalStatement =
    "Me comprometo a cuidar, mantener en buen estado y utilizar unica y " +
    "exclusivamente para asuntos relacionados con mi actividad laboral el equipo " +
    "entregado. En caso de extravio, dano o uso inadecuado, me responsabilizo " +
    "a pagar el costo de reparacion o reposicion del equipo.";

  const employeeData: DataChartElement[] = [
    { label: "Usuario", text: employee.fullname },
    { label: "Clave equipo", text: device.charge_sn || device.device_id || "--" },
    { label: "Departamento", text: employee.department?.name ?? "--" },
    { label: "Fecha", text: assignmentDate },
  ];

  const deviceData: DataChartElement[] = [
    { label: "Marca", text: device.device_brand?.name ?? "--" },
    { label: "Modelo", text: device.model ?? "--" },
    { label: "S/N", text: device.serial_number ?? "--" },
    { label: "S/N cargador", text: device.charge_sn ?? "--" },
    { label: "Ethernet", text: device.ip_address ?? "--" },
    { label: "Mac Address", text: device.mac_address ?? "--" },
    { label: "OS", text: device.operating_system ?? "--" },
    { label: "Tipo", text: device.device_type?.name ?? "--" },
  ];

  const observationsText =
    assignment.observations ||
    assignment.delivery_condition ||
    device.description ||
    "Sin observaciones";
  const assignmentData: DataChartElement[] = [
    {
      label: "Observaciones",
      text: observationsText,
      fullWidth: true,
    },
  ];

  const intro: SingleElement = {
    singletitle: "",
    text: introText,
    borderactive: false,
  };

  const paragraph1: SingleElement = {
    singletitle: "",
    text: responsibilitiesIntro,
    borderactive: false,
  };

  const paragraph2: SingleElement = {
    singletitle: "",
    text: finalStatement,
    borderactive: false,
  };

  const signatures: SignatureElement[] = [
    {
      name: employee.fullname,
      charge: employee.workposition?.name,
      signature: signatureUrl ?? undefined,
    },
    {
      name: "___________",
      charge: "Responsable de TI",
      signature: "",
    },
  ];

  const page: newDocument = {
    folio: locationDate,
    title: "CARTA RESGUARDO",
    headerBox: {
      docTitle: "Carta para Resguardo de Activos DR Mexico",
      version: "02",
      docType: "Formato",
      docKey: "FDT-002",
      creationDate: "31/01/2018",
      lastVersionDate: "23/09/2020",
    },
    elements: [
      intro,
      { title: "Descripcion del equipo", data: deviceData },
      { title: "Datos del resguardo", data: employeeData },
      { title: "Observaciones", data: assignmentData },
      paragraph1,
      {
        title: "",
        items: [
          "Respetar antivirus y sistema operativo base original.",
          "No instalar software adicional, salvo previa autorizacion por el area de Soporte Interno de DR.",
        ],
      },
      paragraph2,
      { title: "", signatures },
    ],
  };

  return {
    pages: [page],
  };
};
