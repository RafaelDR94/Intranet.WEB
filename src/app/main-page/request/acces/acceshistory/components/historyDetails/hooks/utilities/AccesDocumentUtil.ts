// accesrequest.document.mapper.ts
import type {
  FullDocument,
  newDocument,
  DataChart,
  ImageElement,
  Table,
} from '@/app/utilities/PDF/types'; // 👈 ajusta esta ruta a donde tengas los tipos/creador de PDF

import type {
  AccesRequirmentGet,
  Tools,
} from '@/app/mappings/accesrequest/accesrequest.types';
import { CompleteTransport } from '@/app/mappings/transport/transport.types';
import { ExternalPersonModel } from '@/app/mappings/externalperson/externalperson.types';
import { EmployeeType } from '@/app/mappings/employees/employee.types';

/**
 * Formatea una fecha en algo tipo DD-MM-YYYY.
 * Si ya te llega formateada, puedes devolver el string tal cual.
 */
const formatDate = (raw: string | undefined | null): string => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw; // ya viene formateada
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Crea la portada "Solicitud de Acceso".
 */
const buildCoverPage = (access: AccesRequirmentGet): newDocument => {
  const periodoInicio = formatDate(access.start_date);
  const periodoFin = formatDate(access.end_date);

  const motivoChart: DataChart = {
    title: 'MOTIVO:',
    data: [
      {
        label: '',
        text: access.motive,
        fullWidth: true,
      },
    ],
  };

  const periodoChart: DataChart = {
    title: 'PERIODO DE ACCESO:',
    data: [
      {
        label: 'Fecha de inicio',
        text: periodoInicio,
      },
      {
        label: 'Fecha de término',
        text: periodoFin,
      },
    ],
  };

  return {
    title: 'Solicitud de Acceso',
    folio: access.id,
    orientation: 'vertical',
    elements: [motivoChart, periodoChart],
  };
};

/**
 * Página para cada persona EXTERNA (INE + Licencia + Foto).
 */
const buildExternalPersonPage = (person: ExternalPersonModel): newDocument => {
  const fullName = `${person.name} ${person.lastname} ${person.motherslastname}`;

  const data: DataChart = {
    title: 'DATOS DEL COLABORADOR EXTERNO',
    data: [
      { label: 'Nombre completo', text: fullName, fullWidth: true },
      { label: 'Empresa', text: person.enterprise?.name ?? '', fullWidth: true },
      { label: 'CURP', text: person.curp },
      { label: 'Clave de elector', text: person.electorkey },
      { label: 'NSS', text: person.nss },
      { label: 'No. licencia', text: person.license_number },
      { label: 'Vigencia licencia', text: person.vigence },
    ],
  };

  const pictures: ImageElement[] = [
    person.pictureURL && {
      title: 'Fotografía',
      urlimage: person.pictureURL,
    },
    person.frontal_ine_url && {
      title: 'INE Frontal',
      urlimage: person.frontal_ine_url,
    },
    person.back_ine_url && {
      title: 'INE Reverso',
      urlimage: person.back_ine_url,
    },
    person.license_url && {
      title: 'Licencia',
      urlimage: person.license_url,
    },
  ].filter((p): p is ImageElement => Boolean(p));

  const imageList = {
    title: 'Documentos de identificación',
    pictures,
  };

  return {
    title: undefined,
    folio: undefined,
    orientation: 'vertical',
    elements: [data, imageList],
  };
};

/**
 * Página para cada EMPLEADO INTERNO.
 * (No tienes INE/licencia en el modelo, así que se usa info laboral + foto).
 */
const buildInternalEmployeePage = (employee: EmployeeType): newDocument => {
  const data: DataChart = {
    title: 'DATOS DEL COLABORADOR INTERNO',
    data: [
      { label: 'Nombre completo', text: employee.fullname, fullWidth: true },
      { label: 'Número de empleado', text: employee.employee_number },
      { label: 'Correo', text: employee.email, fullWidth: true },
      { label: 'Teléfono', text: employee.phone_number },
      { label: 'Extensión', text: employee.extension },
      {
        label: 'Departamento',
        text: employee.department?.name ?? '',
        fullWidth: true,
      },
      {
        label: 'Puesto',
        text: employee.workposition?.name ?? '',
        fullWidth: true,
      },
    ],
  };

  const pictures: ImageElement[] = employee.image_url
    ? [
      {
        title: 'Fotografía',
        urlimage: employee.image_url,
      },
    ]
    : [];

  const imageList =
    pictures.length > 0
      ? {
        title: 'Identificación interna',
        pictures,
      }
      : null;

  return {
    title: undefined,
    folio: undefined,
    orientation: 'vertical',
    elements: imageList ? [data, imageList] : [data],
  };
};

/**
 * Página por vehículo (datos + fotos + docs).
 */
const buildVehiclePage = (vehicle: CompleteTransport): newDocument => {
  const infoChart: DataChart = {
    title: 'DATOS DEL VEHÍCULO',
    data: [
      { label: 'Placas', text: vehicle.plates },
      { label: 'Marca', text: vehicle.brand },
      { label: 'Modelo', text: vehicle.model },
      { label: 'Año', text: vehicle.year },
      { label: 'No. de serie', text: vehicle.serial_number },
      { label: 'No. de motor', text: vehicle.engine_number },
      { label: 'Póliza', text: vehicle.insurance_policy },
      {
        label: 'Vigencia póliza',
        text: vehicle.policy_expiration ? formatDate(vehicle.policy_expiration) : '',
      },
      { label: 'Tarjeta de circulación', text: vehicle.circulation_card },
      {
        label: 'Vigencia tarjeta',
        text: vehicle.circulation_card_expiration
          ? formatDate(vehicle.circulation_card_expiration)
          : '',
      },
    ],
  };

  const pictures: ImageElement[] = [];

  if (vehicle.front_image) {
    pictures.push({
      title: 'Frontal',
      urlimage: vehicle.front_image,
      width: 180,
      height: 110,
    });
  }

  if (vehicle.right_side_image) {
    pictures.push({
      title: 'Lateral derecho',
      urlimage: vehicle.right_side_image,
      width: 180,
      height: 110,
    });
  }

  if (vehicle.left_side_image) {
    pictures.push({
      title: 'Lateral izquierdo',
      urlimage: vehicle.left_side_image,
      width: 180,
      height: 110,
    });
  }

  if (vehicle.back_image) {
    pictures.push({
      title: 'Trasera',
      urlimage: vehicle.back_image,
      width: 180,
      height: 110,
    });
  }

  if (vehicle.image_plates) {
    pictures.push({
      title: 'Placas',
      urlimage: vehicle.image_plates,
      width: 180,
      height: 110,
    });
  }

  if (vehicle.image_circulation_card) {
    pictures.push({
      title: 'Tarjeta de circulación',
      urlimage: vehicle.image_circulation_card,
      width: 180,
      height: 110,
    });
  }

  const elements: newDocument['elements'] = [infoChart];

  if (pictures.length > 0) {
    elements.push({
      title: 'Imágenes del vehículo',
      pictures,
    });
  }

  // Si quieres la póliza como página aparte (PDF o imagen), puedes manejarla aquí
  // suponiendo que `insurance_policy_doc` sea una URL de imagen.
  // Si fuera un PDF real, necesitarías otra estrategia.
  // (opcional, por ahora lo dejamos solo en esta página).

  return {
    title: undefined,
    orientation: 'vertical',
    folio: undefined,
    elements,
  };
};

/**
 * Página de herramientas (solo se agrega si hay herramientas).
 */

const ACCESS_TOOLS_FULL_PAGE_ROWS = 17;
const ACCESS_TOOLS_LAST_PAGE_ROWS = 14;

interface AccessToolsSplit {
  fullTables: Table[];
  lastTable?: Table;
}

/**
 * Divide las herramientas en páginas seguras:
 * - fullTables: páginas llenas de tabla
 * - lastTable: última página con pocas filas
 */
const splitToolsForAccess = (tools: Tools[]): AccessToolsSplit => {
  if (!tools || tools.length === 0) {
    return { fullTables: [], lastTable: undefined };
  }

  const headers = ['Cantidad', 'Descripción', 'Marca', 'Modelo'];

  const rows: string[][] = tools.map((t) => [
    t.quantity,
    t.description,
    t.brand,
    t.model ?? 'N/A',
  ]);

  const fullTables: Table[] = [];

  // Mientras haya demasiadas filas para caber en la última página
  while (rows.length > ACCESS_TOOLS_LAST_PAGE_ROWS) {
    const chunk = rows.splice(0, ACCESS_TOOLS_FULL_PAGE_ROWS);
    fullTables.push({
      title: 'Lista de herramientas',
      headers,
      datatable: chunk,
    });
  }

  // Lo que queda es para la última página
  const lastTable: Table | undefined =
    rows.length > 0
      ? {
        title: 'Lista de herramientas',
        headers,
        datatable: rows,
      }
      : undefined;

  return { fullTables, lastTable };
};
const buildToolsPages = (access: AccesRequirmentGet): newDocument[] => {
  const tools = access.tools ?? [];
  const { fullTables, lastTable } = splitToolsForAccess(tools);

  const pages: newDocument[] = [];

  // Páginas completas (solo tabla)
  fullTables.forEach((tbl) => {
    pages.push({
      title: 'Lista de Herramientas',
      orientation: 'vertical',
      elements: [tbl],
    });
  });

  // Última página
  if (lastTable) {
    pages.push({
      title: 'Lista de Herramientas',
      orientation: 'vertical',
      elements: [lastTable],
    });
  }

  return pages;
};

/**
 * Mapper principal: AccesRequirmentGet -> FullDocument
 */
export const buildAccessRequirementDocument = (
  access: AccesRequirmentGet,
): FullDocument => {
  const pages: newDocument[] = [];

  // 1) Portada
  pages.push(buildCoverPage(access));

  // 2) Personas externas
  access.externalpersons.forEach((p) => {
    pages.push(buildExternalPersonPage(p));
  });

  // 3) Empleados internos
  access.internalpersons.forEach((e) => {
    pages.push(buildInternalEmployeePage(e));
  });

  // 4) Vehículos
  access.vehicles.forEach((v) => {
    pages.push(buildVehiclePage(v));
  });

  // 5) Herramientas (solo si hay al menos una)
  if (access.tools && access.tools.length > 0) {
    pages.push(...buildToolsPages(access));
  }

  return { pages };
};
