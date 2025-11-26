// accesrequest.manifest.mapper.ts
import type {
    FullDocument,
    newDocument,
    ListElement,
    SingleElement,
    Table,
    PageElement,
} from '@/app/utilities/PDF/types'; // ajusta ruta
import type {
    AccesRequirmentGet,
    Tools,
} from '@/app/mappings/accesrequest/accesrequest.types';
import { CompleteTransport } from '@/app/mappings/transport/transport.types';
import { EmployeeType } from '@/app/mappings/employees/employee.types';
import { ExternalPersonModel } from '@/app/mappings/externalperson/externalperson.types';

export interface ManifestConfig {
    /** Ej: "Mtro. Joel Castuera Hophann" */
    recipientName: string;
    /** Ej: "Titular de la Aduana de Progreso" */
    recipientTitle: string;
    /** Ej: "Aduana de Progreso" */
    locationName: string;
    /** Ej: "15 de septiembre de 2025" (se muestra arriba a la derecha) */
    cityAndDate: string;
    /**
     * Texto libre de la actividad/obra.
     * Ej: "la obra civil de los equipos Portales de Rayos X"
     */
    workDescription: string;
    /**
     * Texto de cierre (opcional).
     * Por defecto replica el que usas en los manifiestos.
     */
    closingText?: string;
}

const formatDate = (raw: string | undefined | null): string => {
    if (!raw) return '';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const buildIntroParagraph = (
    access: AccesRequirmentGet,
    cfg: ManifestConfig,
): string => {
    const inicio = formatDate(access.start_date);
    const fin = formatDate(access.end_date);

    return (
        `A través de este medio solicitamos su autorización y apoyo para el acceso y retiro ` +
        `del siguiente personal, vehículos y herramientas, para el período del ${inicio} al ${fin}, ` +
        `para la realización de ${cfg.workDescription} en ${cfg.locationName}.`
    );
};



// Personas
const MAX_PEOPLE_WITH_TOOLS_ON_FIRST_PAGE = 8;  // si hay más, herramientas van a otra hoja
const PEOPLE_FIRST_PAGE_LIMIT = 18;             // máx. bullets en la 1ª página
const PEOPLE_OTHER_PAGES_LIMIT = 30;            // máx. bullets en páginas solo de personas
/**
 * Devuelve todas las líneas de personas+vehículos como strings.
 */
const buildPeopleVehiclesItems = (access: AccesRequirmentGet): string[] => {
  const personItems: string[] = [];

  // Personas externas
  access.externalpersons.forEach((p: ExternalPersonModel) => {
    const fullName = `${p.name} ${p.lastname} ${p.motherslastname}`;
    const enterprise = p.enterprise?.name ? ` (${p.enterprise.name})` : "";
    personItems.push(`• ${fullName}${enterprise}`);
  });

  // Personas internas
  access.internalpersons.forEach((e: EmployeeType) => {
    personItems.push(`• ${e.fullname} (${e.department?.name ?? "Sin depto."})`);
  });

  // Vehículos
  access.vehicles.forEach((v: CompleteTransport) => {
    const desc = `• Vehículo ${v.Unit_type} marca ${v.brand} modelo ${v.model} con placas ${v.plates}`;
    personItems.push(desc);
  });

  return personItems;
};

/**
 * Corta un array en chunks de tamaño fijo.
 */
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

// Herramientas
const TOOLS_ROWS_PER_FULL_PAGE = 17;  // páginas solo tabla
const TOOLS_ROWS_LAST_PAGE = 14;      // tabla + cierre + firma

interface ManifestToolsSplit {
  fullTables: Table[];
  lastTable?: Table;
}

/**
 * Divide herramientas en:
 * - fullTables: páginas solo con tabla
 * - lastTable: tabla que irá con cierre + firma
 */
const splitToolsForManifest = (tools: Tools[]): ManifestToolsSplit => {
  if (!tools || tools.length === 0) {
    return { fullTables: [], lastTable: undefined };
  }

  const headers = ["Cantidad", "Descripción", "Marca", "No. de serie"];

  const rows: string[][] = tools.map((t) => [
    t.quantity ?? "",
    t.description ?? "",
    t.brand ?? "",
    t.model ?? "N/A",
  ]);

  const fullTables: Table[] = [];

  // Mientras queden más filas que las que caben en la hoja con firma,
  // sacamos páginas "llenas"
  while (rows.length > TOOLS_ROWS_LAST_PAGE) {
    const chunk = rows.splice(0, TOOLS_ROWS_PER_FULL_PAGE);
    fullTables.push({
      title: "Quienes ingresarán con los siguientes materiales y herramientas:",
      headers,
      datatable: chunk,
    });
  }

  const lastTable: Table | undefined =
    rows.length > 0
      ? {
          title: "Quienes ingresarán con los siguientes materiales y herramientas:",
          headers,
          datatable: rows,
        }
      : undefined;

  return { fullTables, lastTable };
};

export const buildManifestDocumentFromAccess = (
  access: AccesRequirmentGet,
  cfg: ManifestConfig,
): FullDocument => {
  const pages: newDocument[] = [];

  // Encabezado: destinatario
  const headerSingle: SingleElement = {
    text: `${cfg.recipientName}\n${cfg.recipientTitle}\n\n`,
  };

  const introParagraph: SingleElement = {
    text: buildIntroParagraph(access, cfg),
  };

  const peopleItems = buildPeopleVehiclesItems(access);
  const { fullTables, lastTable } = splitToolsForManifest(access.tools ?? []);

  const signatureSection: PageElement = {
    title: "Atentamente",
    signatures: [
      {
        name: access.dr_responsiblename,
        charge: "Responsable",
        signature: access.dr_responsiblesignature,
      },
    ],
  };

  const closingBlock: SingleElement = {
    text:
      cfg.closingText ??
      "Sin más por el momento, agradecemos su apoyo para la realización de dichos trabajos.",
  };

  // ==========
  // CASO A: POCAS PERSONAS (se pueden mezclar con herramientas)
  // ==========
  if (peopleItems.length <= MAX_PEOPLE_WITH_TOOLS_ON_FIRST_PAGE) {
    const elements: PageElement[] = [
      headerSingle as PageElement,
      introParagraph as PageElement,
    ];

    // Lista de personas/vehículos completa
    if (peopleItems.length > 0) {
      const list: ListElement = { title: "", items: peopleItems };
      elements.push(list as PageElement);
    }

    if (!fullTables.length && !lastTable) {
      // Sin herramientas → cierre + firma en la misma hoja
      elements.push(closingBlock as PageElement);
      elements.push(signatureSection);
    } else if (!fullTables.length && lastTable) {
      // Todas las herramientas + firma en la misma hoja
      elements.push(lastTable as PageElement);
      elements.push(closingBlock as PageElement);
      elements.push(signatureSection);
    } else if (fullTables.length) {
      // Primera tabla llena en esta página
      elements.push(fullTables[0] as PageElement);
    }

    pages.push({
      title: "MANIFIESTO",
      folio: cfg.cityAndDate,
      orientation: "vertical",
      elements,
    });

    // Páginas intermedias de herramientas
    if (fullTables.length > 1) {
      for (let i = 1; i < fullTables.length; i++) {
        pages.push({
          title: "MANIFIESTO",
          folio: cfg.cityAndDate,
          orientation: "vertical",
          elements: [fullTables[i] as PageElement],
        });
      }
    }

    // Última página de herramientas + firma
    if (fullTables.length && lastTable) {
      const lastElements: PageElement[] = [lastTable as PageElement];
      lastElements.push(closingBlock as PageElement);
      lastElements.push(signatureSection);

      pages.push({
        title: "MANIFIESTO",
        folio: cfg.cityAndDate,
        orientation: "vertical",
        elements: lastElements,
      });
    }

    return { pages };
  }

  // ==========
  // CASO B: MUCHAS PERSONAS → PERSONAS PAGINADAS, HERRAMIENTAS EN HOJA NUEVA
  // ==========

  // 1) Paginamos personas
  const firstChunk = peopleItems.slice(0, PEOPLE_FIRST_PAGE_LIMIT);
  const rest = peopleItems.slice(PEOPLE_FIRST_PAGE_LIMIT);
  const otherChunks = chunkArray(rest, PEOPLE_OTHER_PAGES_LIMIT);

  // Página 1: encabezado + intro + primeras personas
  const firstPageElements: PageElement[] = [
    headerSingle as PageElement,
    introParagraph as PageElement,
    { title: "", items: firstChunk } as PageElement,
  ];

  // Si NO hay herramientas y solo hay estas personas → cierre + firma aquí
  if (!fullTables.length && !lastTable && otherChunks.length === 0) {
    firstPageElements.push(closingBlock as PageElement);
    firstPageElements.push(signatureSection);
  }

  pages.push({
    title: "MANIFIESTO",
    folio: cfg.cityAndDate,
    orientation: "vertical",
    elements: firstPageElements,
  });

  // Páginas solo de personas (sin herramientas aún)
  otherChunks.forEach((chunk, idx) => {
    const isLastPeoplePage =
      idx === otherChunks.length - 1 && !fullTables.length && !lastTable;

    const elements: PageElement[] = [
      { title: "", items: chunk } as PageElement,
    ];

    if (isLastPeoplePage) {
      elements.push(closingBlock as PageElement);
      elements.push(signatureSection);
    }

    pages.push({
      title: "MANIFIESTO",
      folio: cfg.cityAndDate,
      orientation: "vertical",
      elements,
    });
  });

  // Si no hay herramientas, ya terminamos (las personas finales ya llevan firma)
  if (!fullTables.length && !lastTable) {
    return { pages };
  }

  // 2) HERRAMIENTAS: SIEMPRE EN HOJAS NUEVAS
  // Páginas de fullTables
  fullTables.forEach((tbl) => {
    pages.push({
      title: "MANIFIESTO",
      folio: cfg.cityAndDate,
      orientation: "vertical",
      elements: [tbl as PageElement],
    });
  });

  // Página final con lastTable + cierre + firma
  if (lastTable) {
    const elements: PageElement[] = [lastTable as PageElement];
    elements.push(closingBlock as PageElement);
    elements.push(signatureSection);

    pages.push({
      title: "MANIFIESTO",
      folio: cfg.cityAndDate,
      orientation: "vertical",
      elements,
    });
  }

  return { pages };
};
