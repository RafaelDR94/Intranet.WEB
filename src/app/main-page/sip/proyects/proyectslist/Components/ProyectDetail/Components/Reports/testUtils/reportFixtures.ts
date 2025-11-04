
import type { ReportView } from "@/app/mappings/reports/reports.types";

const baseDepartment = {
  department_id: "DEP-1",
  name: "Operaciones",
  enterprise_id: "ENT-1",
  enterprice_name: "DR Security",
};

const baseWorkPosition = {
  workposition_id: "WP-1",
  name: "Supervisora",
};

const buildEmployee = (id: string, fullname: string) => ({
  employee_id: id,
  employee_number: `EMP-${id}`,
  firstname: fullname.split(" ")[0] ?? fullname,
  secondname: "",
  lastname: fullname.split(" ")[1] ?? "Apellido",
  motherlast_name: null,
  gender: "F",
  email: `${id}@example.com`,
  phone_number: "555-0101",
  extension: "100",
  image_url: "",
  manager_id: "MGR-1",
  department: baseDepartment,
  workposition: baseWorkPosition,
  user: null,
  is_active: true,
  fullname,
});

export const sampleProyect: any = {
  id: "PROY-1",
  name: "Instalacion de CCTV",
  proyectKey: "CCTV-001",
  client: "Cliente Demo",
  manager: buildEmployee("emp-1", "Laura Campos"),
  collaborators: [buildEmployee("emp-2", "Diego Torres")],
};

const baseReport: ReportView = {
  id: "REP-1",
  model: {
    maps: true,
    diagnostic: true,
    solution: true,
    refactions: true,
    clientsign: true,
    ticket: true,
  },
  startdate: "2024-05-01T08:00:00",
  enddate: "2024-05-02T17:00:00",
  datecreate: "2024-05-02T18:30:00",
  proyect: sampleProyect,
  type: "Mantenimiento",
  reportcategories: {
    id: "CAT-1",
    name: "Correctivo",
    typesofreports: {
      id: "TYPE-1",
      name: "Servicio",
      description: "Servicio general",
    },
  },
  location: {
    id: "LOC-1",
    name: "Edificio Norte",
    linkmaps: "https://maps.example.com/norte",
    address: "Av. Principal 123, Ciudad",
    proyect: [],
  },
  employe: buildEmployee("emp-3", "Rosa Medina") as any,
  workposition: baseWorkPosition,
  remarks: "Se realizaron ajustes y limpieza.",
  progress: "75",
  ticket: "TK-001",
  employeesignurl: "https://cdn.example.com/signatures/employee.png",
  activities: [
    {
      title: "Inspeccion de camaras",
      date: "2024-05-01",
      description: "Verificacion del estado de los dispositivos.",
      urlimage: "https://cdn.example.com/images/activity-1.png",
    },
  ],
  maps: [
    {
      title: "Mapa de areas revisadas",
      date: "2024-05-01",
      description: "Resumen de ubicaciones intervenidas.",
      urlimage: "https://cdn.example.com/images/map-1.png",
    },
  ],
  diagnostic: "Camaras con perdida de enfoque por suciedad.",
  solution: "Limpieza de lentes y recalibracion.",
  refactions: [
    {
      description: "Kit de limpieza de lentes",
      brand: "OptiClean",
      model: "OC-200",
      serialnumber: "SN-100",
      partnumber: "PN-200",
    },
  ],
  clientsign: {
    clientname: "Carlos Perez",
    clientworkposition: "Jefe de seguridad",
    datetime: "2024-05-02 18:45",
    url: "https://cdn.example.com/signatures/client.png",
  },
  front_identifier: "FR-001",
  reportDeviceView: [
    {
      id: "DV-1",
      device_external_view: {
        id: "DEV-1",
        brand: "Axis",
        model: "M2026",
        serialnumber: "SN-AX-1",
        fullInformation: "Axis M2026 SN-AX-1",
      },
    },
  ] as any,
};

export const createSampleReport = (overrides: Partial<ReportView> = {}): ReportView => ({
  ...baseReport,
  ...overrides,
  model: { ...baseReport.model, ...overrides.model },
  reportcategories: {
    ...baseReport.reportcategories,
    ...(overrides.reportcategories ?? {}),
    typesofreports: {
      ...baseReport.reportcategories.typesofreports,
      ...((overrides.reportcategories?.typesofreports) ?? {}),
    },
  },
  location: { ...baseReport.location, ...overrides.location },
  employe: { ...baseReport.employe, ...overrides.employe },
  workposition: { ...baseReport.workposition, ...overrides.workposition },
  proyect: { ...baseReport.proyect, ...overrides.proyect },
  activities: overrides.activities ?? baseReport.activities,
  maps: overrides.maps ?? baseReport.maps,
  refactions: overrides.refactions ?? baseReport.refactions,
  reportDeviceView: overrides.reportDeviceView ?? baseReport.reportDeviceView,
  clientsign: { ...baseReport.clientsign, ...(overrides.clientsign ?? {}) },
});

export const sampleReports: ReportView[] = [
  baseReport,
  createSampleReport({
    id: "REP-2",
    ticket: "TK-002",
    type: "Instalacion",
    reportcategories: {
      id: "CAT-2",
      name: "Preventivo",
      typesofreports: {
        id: "TYPE-2",
        name: "Inspeccion",
        description: "Inspeccion rutinaria",
      },
    },
    reportDeviceView: [
      {
        id: "DV-2",
        device_external_view: {
          id: "DEV-2",
          brand: "Hikvision",
          model: "DS-2",
          serialnumber: "SN-HK-2",
          fullInformation: "Hikvision DS-2 SN-HK-2",
        },
      },
    ] as any,
    activities: [
      {
        title: "Configuracion de NVR",
        date: "2024-05-03",
        description: "Se ajustaron los perfiles de grabacion.",
        urlimage: "https://cdn.example.com/images/activity-2.png",
      },
    ],
  }),
];
