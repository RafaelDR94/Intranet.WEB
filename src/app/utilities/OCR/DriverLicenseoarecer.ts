/* eslint-disable no-useless-escape */
/**
 * Parser de Licencias de Conducir (MX, multi-estado) desde texto OCR.
 * - Robusto a "ruido" de OCR (acentos, saltos de línea, mayúsculas).
 * - Evita falsos positivos ("LICENCIA DE CONDUCIR", "TIPO DE SANGRE").
 * - Soporta etiquetas en línea y en bloque (Antigüedad/Expedición/Vigencia).
 * - Enfocado en extraer correctamente: número de licencia y vigencia.
 */

export interface LicenseDocumentData {
  tipo: 'Licencia de Conducir';
  licencia_numero?: string;
  clase_o_tipo?: string;        // A, B, C, CHOFER, MOTOCICLISTA, etc.
  categoria?: string;
  antiguedad_desde?: string;    // ISO yyyy-mm-dd
  fecha_expedicion?: string;    // ISO yyyy-mm-dd
  fecha_vigencia?: string;      // ISO yyyy-mm-dd (campo prioritario)
  folio?: string;
}

export interface LicenseHolderData {
  nombre_completo?: string;
  nombres?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  curp?: string;
  rfc?: string;
  nacionalidad?: string;
  tipo_sangre?: string | null;
  domicilio?: string;
  fecha_nacimiento?: string;    // ISO
}

export interface ParsedDriverLicense {
  entidad?: string;
  pais: 'México';
  institucion?: string;
  documento: LicenseDocumentData;
  titular: LicenseHolderData;
  seguridad?: { qr?: string; chip?: boolean; mrz?: string; };
  raw?: { text: string };
  warnings: string[];
}

// ----------------- Helpers -----------------

const toUpper = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

const normLines = (txt: string) =>
  txt
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => toUpper(l).replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const _pickFirst = <T extends string | undefined | null>(...vals: T[]) =>
  vals.find(Boolean);

const DATE_RAW_RE =
  /\b(\d{2}[\/\-.]\d{2}[\/\-.]\d{4}|\d{4}[\/\-.]\d{2}[\/\-.]\d{2})\b/;

const parseDateIso = (s?: string) => {
  if (!s) return undefined;
  const m1 = s.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/);
  const m2 = s.match(/(\d{4})[\/\-\.](\d{2})[\/\-\.](\d{2})/);
  if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return undefined;
};

const detectCURP = (text: string) => {
  const m = text.match(
    /\b([A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}\d{2})\b/
  );
  return m?.[1];
};

const detectRFC = (text: string) => {
  const m = text.match(/\b([A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3})\b/);
  return m?.[1];
};

/** Tipos de sangre; tolera errores comunes de OCR: "8"->"B", "0"->"O" y orden "+B" */
const detectBloodType = (lines: string[]) => {
  const txt = lines.join(' ');
  const cleaned = txt.replace(/\s+/g, ' ');
  const m1 = cleaned.match(
    /\b(AB|A|B|O|8|0)\s*(\+|\-|POSITIVO|NEGATIVO)\b/
  );
  const m2 = cleaned.match(/(\+|\-)\s*(AB|A|B|O|8|0)\b/);
  const pick = m1 ?? m2;
  if (!pick) return undefined;

  const group = (pick[1] ?? pick[2]).replace('8', 'B').replace('0', 'O');
  const sign =
    (pick[2] ?? pick[1]) === '+' || /POSITIVO/.test(pick[2] ?? pick[1])
      ? '+'
      : '-';
  if (!/^(AB|A|B|O)$/.test(group)) return undefined;
  return `${group}${sign}`;
};

/** Nombre: 2–4 tokens, sin dígitos, y excluyendo etiquetas/instituciones */
const detectFullNameLine = (lines: string[]) => {
  const banned = [
    'CIUDAD', 'MEXICO', 'GOBIERNO', 'SECRETARIA', 'SUBSECRETARIA',
    'ESTADOS', 'UNIDOS', 'LICENCIA', 'CONDUCIR', 'ANTIGUEDAD',
    'EXPEDICION', 'VIGENCIA', 'NACIONALIDAD', 'CURP', 'SANGRE',
    'TIPO', 'FOLIO', 'OFICIAL', 'TRANSITO', 'TRANSPORTE', 'MEXICANA'
  ];
  const isCandidate = (l: string) =>
    /^[A-Z Ñ'.-]{6,}$/.test(l) &&
    !/\d/.test(l) &&
    !banned.some((w) => l.includes(w)) &&
    (((): boolean => {
      const tokens = l.split(' ').filter((t) => !['DE', 'DEL', 'LA', 'Y'].includes(t));
      return tokens.length >= 2 && tokens.length <= 4;
    })());

  // Ancla cerca de "LICENCIA NO.", un ID tipo "N123...", o "TIPO".
  const anchors = lines
    .map((l, i) =>
      (/\bLICENCIA\b.*\bN[Oº\.]/.test(l) || /^[A-Z]\d{7,}$/.test(l) || l === 'TIPO')
        ? i
        : -1
    )
    .filter((i) => i >= 0);

  for (const a of anchors) {
    for (const off of [1, 2, -1, -2, 3, 4]) {
      const idx = a + off;
      if (idx >= 0 && idx < lines.length && isCandidate(lines[idx])) {
        return lines[idx];
      }
    }
  }
  return lines.find(isCandidate);
};

/** Mapea una tanda de etiquetas (ANTIGUEDAD/EXPEDICION/VIGENCIA) con fechas en las líneas siguientes. */
const mapBlockLabelsToDates = (lines: string[]) => {
  const isLabel = (l: string) =>
    /^(ANTIG|ANTIGUEDAD|EXPED|EXPEDICION|VIGENCIA|VENCE|VALIDEZ)\b/.test(l);
  const pairs: Array<{ label: string; date: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    if (isLabel(lines[i]) && !DATE_RAW_RE.test(lines[i])) {
      // juntamos etiquetas consecutivas
      const labels: string[] = [];
      while (i < lines.length && isLabel(lines[i]) && !DATE_RAW_RE.test(lines[i])) {
        labels.push(lines[i]);
        i++;
      }
      // recogemos N fechas siguientes
      const dates: string[] = [];
      let j = i;
      while (j < lines.length && dates.length < labels.length) {
        const m = lines[j].match(DATE_RAW_RE);
        if (m) dates.push(m[0]);
        j++;
      }
      // pareamos en orden
      labels.forEach((l, idx) => {
        if (dates[idx]) pairs.push({ label: l, date: dates[idx] });
      });
    }
  }
  return pairs;
};

/** Busca fecha vinculada a una etiqueta (misma línea o en las 3 posteriores) */
const findDateNearLabel = (lines: string[], label: RegExp) => {
  for (let i = 0; i < lines.length; i++) {
    if (label.test(lines[i])) {
      const same = lines[i].match(DATE_RAW_RE)?.[0];
      if (same) return same;
      for (let k = 1; k <= 3; k++) {
        const m = lines[i + k]?.match(DATE_RAW_RE)?.[0];
        if (m) return m;
      }
    }
  }
  return undefined;
};

/** Número de licencia – patrones robustos y sin falsos positivos con "LICENCIA DE CONDUCIR". */
const detectLicenseNumber = (text: string, lines: string[]) => {
  const t = text.replace(/\bLICENCIA\s+DE\s+CONDUCIR\b/g, ' ');

  // 1) "Licencia No/Num/Número/No."
  const patterns = [
    /\bLICENCIA\s*(?:N[Oº\.]|NUM(?:ERO)?\.?|#)?\s*[:#\-]?\s*([A-Z0-9\-]{6,})\b/,
    /\bN[Oº]\.?\s*LICENCIA\s*[:#\-]?\s*([A-Z0-9\-]{6,})\b/,
    /\bID(?:ENTIFICACION)?\s*[:#\-]?\s*([A-Z0-9\-]{6,})\b/,
    /\bFOLIO\s*[:#\-]?\s*([A-Z0-9\-]{6,})\b/
  ];

  for (const p of patterns) {
    const m = t.match(p);
    if (m) return m[1];
  }

  // 2) Una línea aislada con patrón típico (CDMX: "N\d{7,}")
  const alone = lines.find((l) => /^[A-Z]\d{7,}$/.test(l));
  if (alone) return alone;

  // 3) Cerca de la línea "LICENCIA NO."
  const idx = lines.findIndex((l) => /\bLICENCIA\b.*\bN[Oº\.]/.test(l));
  if (idx >= 0) {
    for (const j of [idx - 2, idx - 1, idx + 1, idx + 2]) {
      const m = lines[j]?.match(/\b[A-Z]?\d{6,}\b/);
      if (m) return m[0];
    }
  }

  // 4) Fallback: "N\d{7,}"
  return text.match(/\bN\d{7,}\b/)?.[0];
};

/** TIPO/CATEGORÍA – ignora "TIPO DE SANGRE" y tolera que la letra esté en línea vecina. */
const detectClassOrType = (text: string, lines: string[]) => {
  const m1 = text.match(/\bTIPO(?!\s+DE\s+SANGRE)\s*[: ]*([A-Z0-9]{1,3})\b/);
  if (m1) return m1[1];

  const i = lines.findIndex((l) => /^TIPO$/.test(l));
  if (i >= 0) {
    const neigh = [lines[i - 1], lines[i + 1]].find(
      (s) => s && /^[A-Z0-9]{1,3}$/.test(s)
    );
    if (neigh) return neigh;
  }

  const m2 =
    text.match(/\bCATEGORIA\s*[: ]*([A-Z0-9]{1,3})\b/) ||
    text.match(/\bCLASE\s*[: ]*([A-Z0-9]{1,3})\b/);

  return m2?.[1];
};

// ----------------- Parsers por estado -----------------

type StateParser = (text: string, lines: string[]) => Partial<ParsedDriverLicense>;

const parserCDMX: StateParser = (text, lines) => {
  const out: Partial<ParsedDriverLicense> = {
    entidad: 'CDMX',
    institucion: 'SECRETARIA DE MOVILIDAD DE LA CIUDAD DE MEXICO'
  };

  const licencia_numero = detectLicenseNumber(text, lines);

  const clase_o_tipo = detectClassOrType(text, lines);

  // Fechas: intentamos el bloque (Antigüedad/Expedición/Vigencia) y luego "near label"
  let antiguedad: string | undefined;
  let exped: string | undefined;
  let vig: string | undefined;

  const pairs = mapBlockLabelsToDates(lines);
  if (pairs.length) {
    antiguedad = pairs.find((p) => /^ANTIG/.test(p.label))?.date;
    exped = pairs.find((p) => /^EXPED/.test(p.label))?.date;
    vig = pairs.find((p) => /^VIGENCIA|^VENCE|^VALIDEZ/.test(p.label))?.date;
  }
  exped ??= findDateNearLabel(lines, /EXPED|EXPEDICION/);
  vig ??= findDateNearLabel(lines, /VIGENCIA|VENCE|VALIDEZ/);

  // Titular
  const nombre_line = detectFullNameLine(lines);
  const curp = detectCURP(text);
  const rfc = detectRFC(text);
  const nacionalidad =
    text.match(/\bNACIONALIDAD[: ]+([A-Z ]+)/)?.[1]?.split('TIPO')[0]?.trim() ||
    (lines.includes('MEXICANA') ? 'MEXICANA' : undefined);
  const tipo_sangre = detectBloodType(lines) ?? null;

  out.documento = {
    tipo: 'Licencia de Conducir',
    licencia_numero,
    clase_o_tipo: clase_o_tipo?.trim(),
    antiguedad_desde: parseDateIso(antiguedad),
    fecha_expedicion: parseDateIso(exped),
    fecha_vigencia: parseDateIso(vig)
  };

  out.titular = {
    nombre_completo: nombre_line?.trim(),
    curp,
    rfc,
    nacionalidad,
    tipo_sangre
  };

  return out;
};

// Parser genérico (vale para la mayoría de estados)
const parserGenerico: StateParser = (text, lines) => {
  const licencia_numero = detectLicenseNumber(text, lines);
  const clase_o_tipo = detectClassOrType(text, lines);

  // fechas (bloque o "near label")
  const pairs = mapBlockLabelsToDates(lines);
  const exped =
    pairs.find((p) => /^EXPED/.test(p.label))?.date ||
    findDateNearLabel(lines, /EXPED|EXPEDICION/);
  const vig =
    pairs.find((p) => /^VIGENCIA|^VENCE|^VALIDEZ/.test(p.label))?.date ||
    findDateNearLabel(lines, /VIGENCIA|VENCE|VALIDEZ/);
  const antiguedad =
    pairs.find((p) => /^ANTIG/.test(p.label))?.date ||
    findDateNearLabel(lines, /ANTIG|ANTIGUEDAD/);

  const nombre_line = detectFullNameLine(lines);
  const curp = detectCURP(text);
  const rfc = detectRFC(text);
  const nacionalidad =
    text.match(/\bNACIONALIDAD[: ]+([A-Z ]+)/)?.[1]?.split('TIPO')[0]?.trim() ||
    (lines.includes('MEXICANA') ? 'MEXICANA' : undefined);
  const tipo_sangre = detectBloodType(lines) ?? null;

  return {
    documento: {
      tipo: 'Licencia de Conducir',
      licencia_numero,
      clase_o_tipo: clase_o_tipo?.trim(),
      antiguedad_desde: parseDateIso(antiguedad),
      fecha_expedicion: parseDateIso(exped),
      fecha_vigencia: parseDateIso(vig)
    },
    titular: {
      nombre_completo: nombre_line?.trim(),
      curp,
      rfc,
      nacionalidad,
      tipo_sangre
    }
  };
};

// ----------------- Detección de estado y orquestación -----------------

const STATE_PARSERS: Record<string, StateParser> = {
  CDMX: parserCDMX
  // Agrega aquí parsers específicos (Jalisco, EdoMex, Puebla, etc.) si fuese necesario.
};

function detectEntidad(lines: string[]): string | undefined {
  if (lines.some((l) => /CIUDAD DE MEXICO|CDMX|SEMOVI|SECRETARIA DE MOVILIDAD/.test(l)))
    return 'CDMX';
  // añade más detectores según necesidades
  return undefined;
}

/**
 * Punto de entrada principal.
 * @param rawText Texto plano del OCR de la licencia.
 */
export function parseDriverLicense(rawText: string): ParsedDriverLicense {
  const text = toUpper(rawText);
  const lines = normLines(rawText);

  const entidad = detectEntidad(lines);
  const base: ParsedDriverLicense = {
    entidad,
    pais: 'México',
    institucion: undefined,
    documento: { tipo: 'Licencia de Conducir' },
    titular: {},
    warnings: [],
    raw: { text: rawText }
  };

  const parser =
    (entidad && STATE_PARSERS[entidad]) ? STATE_PARSERS[entidad] : parserGenerico;

  const parsed = parser(text, lines);

  const out: ParsedDriverLicense = {
    ...base,
    ...parsed,
    entidad: parsed.entidad ?? base.entidad,
    institucion: parsed.institucion ?? base.institucion,
    documento: { ...base.documento, ...(parsed.documento || {}) },
    titular: { ...base.titular, ...(parsed.titular || {}) },
    warnings: base.warnings,
    raw: base.raw
  };

  // Avisos por campos faltantes (prioridad: número y vigencia)
  if (!out.documento.licencia_numero) out.warnings.push('Número de licencia no detectado.');
  if (!out.documento.fecha_vigencia) out.warnings.push('Fecha de vigencia no detectada.');
  if (!out.documento.fecha_expedicion) out.warnings.push('Fecha de expedición no detectada.');
  if (!out.titular.nombre_completo) out.warnings.push('Nombre del titular no detectado.');
  if (!out.titular.curp) out.warnings.push('CURP no detectado.');
  if (!out.titular.tipo_sangre) out.warnings.push('Tipo de sangre no detectado.');

  return out;
}

