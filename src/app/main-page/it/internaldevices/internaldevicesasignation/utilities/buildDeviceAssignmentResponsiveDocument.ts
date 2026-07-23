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
  membret?: 'DR' | 'VIP';
};

const hasContent = (value: string | null | undefined): value is string =>
  Boolean(value?.trim());

const createDataRow = (
  label: string,
  text: string | null | undefined,
  fullWidth = false,
): DataChartElement | null =>
  hasContent(text) ? { label, text: text.trim(), fullWidth } : null;

const hasDataRow = (item: DataChartElement | null): item is DataChartElement =>
  item !== null;

/**
 * Construye el documento PDF de responsiva para asignacion de dispositivos.
 */
export const buildDeviceAssignmentResponsiveDocument = ({
  assignment,
  device,
  employee,
  signatureUrl,
  membret = 'DR',
}: BuildDeviceAssignmentResponsiveParams): FullDocument => {
  const isVip = membret === 'VIP';
  const assignmentDate = formatDateHour(
    assignment.date ?? assignment.created_at ?? new Date().toISOString(),
  );

  const locationDate = `Mexico, CDMX a ${currentDateEs(new Date())}`;

  const introText =
    `Por medio de la presente, hago constar que recibo de parte de ${
      isVip ? 'VIP INGENIERIA' : 'DR Mexico, S.A. de C.V.'
    } para el desempeño de mi trabajo un equipo de computo ` +
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
    createDataRow("Usuario", employee.fullname),
    createDataRow("Clave equipo", device.name),
    createDataRow("Departamento", employee.department?.name),
    createDataRow("Fecha", assignmentDate),
  ].filter(hasDataRow);

  const deviceData: DataChartElement[] = [
    createDataRow("Marca", device.device_brand?.name),
    createDataRow("Modelo", device.model),
    createDataRow("S/N", device.serial_number),
    createDataRow("S/N cargador", device.charge_sn),
    createDataRow("Ethernet", device.ip_address),
    createDataRow("Mac Address", device.mac_address),
    createDataRow("OS", device.operating_system),
    createDataRow("Tipo", device.device_type?.name),
  ].filter(hasDataRow);

  const observationsText =
    assignment.observations ||
    assignment.delivery_condition ||
    device.description;
  const assignmentData: DataChartElement[] = [
    createDataRow("Observaciones", observationsText, true),
  ].filter(hasDataRow);

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
      docTitle: isVip
        ? "Carta para Resguardo de Activos VIP INGENIERIA"
        : "Carta para Resguardo de Activos DR Mexico",
      version: "02",
      docType: "Formato",
      docKey: isVip ? "CLAVE VIP-ING" : "FDT-002",
      creationDate: "31/01/2018",
      lastVersionDate: "23/09/2020",
    },
    elements: [
      intro,
      { title: "Descripcion del equipo", data: deviceData },
      { title: "Datos del resguardo", data: employeeData },
      ...(assignmentData.length > 0
        ? [{ title: "Observaciones", data: assignmentData }]
        : []),
      paragraph1,
      {
        title: "",
        items: [
          "Respetar antivirus y sistema operativo base original.",
          `No instalar software adicional, salvo previa autorizacion por el area de Soporte Interno de ${
            isVip ? 'VIP ingenieria' : 'DR'
          }.`,
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
