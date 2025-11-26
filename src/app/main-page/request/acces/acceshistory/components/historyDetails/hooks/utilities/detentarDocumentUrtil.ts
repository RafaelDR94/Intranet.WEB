// accesrequest.detentar.mapper.ts
import type {
  FullDocument,
  newDocument,
  SingleElement,
  Table,
  PageElement,
} from '@/app/utilities/PDF/types';
import type {
  AccesRequirmentGet,
  Tools,
} from '@/app/mappings/accesrequest/accesrequest.types';

export interface DetentarLetterConfig {
  /** Ej: "Mtro. Joel Castuera Hophann" */
  recipientName: string;
  /** Ej: "Titular de la Aduana Progreso." */
  recipientTitle: string;
  /** Ej: "30 de Septiembre de 2025" (se muestra arriba a la derecha) */
  cityAndDate: string;
  /**
   * Descripción de los trabajos:
   * Ej: "Instalación de los equipos portales de rayos X"
   */
  workDescription: string;
  /**
   * Nombre de quien firma (por defecto usa access.dr_responsiblename)
   */
  signerName?: string;
  /**
   * Cargo de quien firma (por defecto "Residente de Obra")
   */
  signerRole?: string;
}

/**
 * Número de filas de herramientas permitidas en una página que solo tiene tabla.
 * (Sin cierre ni firma).
 */
const DETENTAR_FULL_PAGE_ROWS = 17;

/**
 * Número de filas de herramientas permitidas en la página final
 * que además tiene texto de cierre + bloque de firma.
 */
const DETENTAR_LAST_PAGE_ROWS = 12;

/**
 * Genera el párrafo principal de la carta de detentar.
 */
const buildIntroParagraph = (
  access: AccesRequirmentGet,
  cfg: DetentarLetterConfig,
  signerName: string,
  signerRole: string,
): string => {
  return (
    `Por la presente, quien suscribe ${signerName}, en mi carácter de ${signerRole}, ` +
    `para los trabajos referentes a ${cfg.workDescription}, hago constar y bajo protesta ` +
    `de decir verdad, manifiesto que detento la posesión legítima de los bienes ` +
    `presentados para los trabajos antes descritos y que se describen en la siguiente ` +
    `lista de materiales:`
  );
};

/**
 * Encabezado con destinatario.
 */
const buildHeaderBlock = (cfg: DetentarLetterConfig): SingleElement => {
  const text =
    `${cfg.recipientName}\n` +
    `${cfg.recipientTitle}\n\n`;

  return {
    text,
  };
};

/**
 * Texto de cierre de la carta.
 */
const buildClosingBlock = (): SingleElement => ({
  text:
    'Sin más por el momento, agradezco de antemano el apoyo brindado para la realización de dichos trabajos.',
});

/**
 * Estructura usada para dividir las herramientas en:
 * - fullTables: páginas solo de tabla
 * - lastTable: tabla que irá en la página final junto con cierre + firma
 */
interface DetentarToolsSplit {
  fullTables: Table[];
  lastTable?: Table;
}

/**
 * Divide las herramientas en tablas para:
 * - Páginas "llenas" solo con tabla (DETENTAR_FULL_PAGE_ROWS)
 * - Última página (DETENTAR_LAST_PAGE_ROWS) que también lleva cierre + firma.
 */
const splitToolsForDetentar = (tools: Tools[]): DetentarToolsSplit => {
  if (!tools || tools.length === 0) {
    return { fullTables: [], lastTable: undefined };
  }

  const headers = ['Cantidad', 'Descripción', 'Marca', 'No. Serie'];

  const rows: string[][] = tools.map((t) => [
    t.quantity ?? '',
    t.description ?? '',
    t.brand ?? '',
    t.model ?? 'N/A', // aquí estás usando model como No. de serie
  ]);

  const fullTables: Table[] = [];

  // Mientras queden más filas que las que caben en la página con firma,
  // vamos sacando páginas completas solo con tabla.
  while (rows.length > DETENTAR_LAST_PAGE_ROWS) {
    const chunk = rows.splice(0, DETENTAR_FULL_PAGE_ROWS);
    fullTables.push({
      title: 'Lista de materiales:',
      headers,
      datatable: chunk,
    });
  }

  // Lo que queda va en la última página junto con cierre + firma.
  const lastTable: Table | undefined =
    rows.length > 0
      ? {
          title: 'Lista de materiales:',
          headers,
          datatable: rows,
        }
      : undefined;

  return { fullTables, lastTable };
};

/**
 * Mapper principal: AccesRequirmentGet -> FullDocument (Carta de Detentar).
 */
export const buildDetentarDocumentFromAccess = (
  access: AccesRequirmentGet,
  cfg: DetentarLetterConfig,
): FullDocument => {
  const pages: newDocument[] = [];

  const signerName = cfg.signerName ?? access.dr_responsiblename;
  const signerRole = cfg.signerRole ?? 'Responsable';

  const headerBlock = buildHeaderBlock(cfg);
  const introBlock: SingleElement = {
    text: buildIntroParagraph(access, cfg, signerName, signerRole),
  };
  const closingBlock = buildClosingBlock();

  const { fullTables, lastTable } = splitToolsForDetentar(access.tools ?? []);

  // Firma (SignatureChart)
  const signatureSection: PageElement = {
    title: 'Atentamente:',
    signatures: [
      {
        name: signerName,
        charge: signerRole,
        signature: access.dr_responsiblesignature, // URL de la firma si la tienes
      },
    ],
  };

  /**
   * PÁGINA 1 — destinatario + intro + (tal vez) tabla/cierre/firma
   */
  const firstPageElements: PageElement[] = [
    headerBlock as PageElement,
    introBlock as PageElement,
  ];

  if (!fullTables.length && lastTable) {
    // Caso: todas las herramientas caben en una sola tabla
    // → todo va en la primera página con cierre + firma.
    firstPageElements.push(lastTable as PageElement);
    firstPageElements.push(closingBlock as PageElement);
    firstPageElements.push(signatureSection);
  } else if (fullTables.length > 0) {
    // Caso: hay al menos una tabla "llena"
    // → la primera tabla va en la primera página.
    firstPageElements.push(fullTables[0] as PageElement);
  } else if (!fullTables.length && !lastTable) {
    // Caso: no hay herramientas
    // → solo cierre + firma.
    firstPageElements.push(closingBlock as PageElement);
    firstPageElements.push(signatureSection);
  }

  pages.push({
    title: 'CARTA DE DETENTAR',
    folio: cfg.cityAndDate, // se ve arriba a la derecha
    orientation: 'vertical',
    elements: firstPageElements,
  });

  /**
   * PÁGINAS INTERMEDIAS — solo tablas llenas
   */
  if (fullTables.length > 1) {
    for (let i = 1; i < fullTables.length; i++) {
      pages.push({
        title: 'CARTA DE DETENTAR',
        folio: cfg.cityAndDate,
        orientation: 'vertical',
        elements: [fullTables[i] as PageElement],
      });
    }
  }

  /**
   * ÚLTIMA PÁGINA — tabla final + cierre + firma
   * (solo aplica si hubo tablas llenas y además quedó una tabla final).
   */
  if (fullTables.length && lastTable) {
    const finalPageElements: PageElement[] = [
      lastTable as PageElement,
      closingBlock as PageElement,
      signatureSection,
    ];

    pages.push({
      title: 'CARTA DE DETENTAR',
      folio: cfg.cityAndDate,
      orientation: 'vertical',
      elements: finalPageElements,
    });
  }

  return { pages };
};
