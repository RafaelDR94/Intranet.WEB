/* eslint-disable no-useless-escape */
// src/utilities/vehicle/parseCirculationCard.ts
export type FuelType =
  | 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico' | 'Gas LP' | 'Gas Natural' | 'Otro';

export interface VehicleData {
  marca?: string;
  linea?: string;
  modelo?: number;
  cilindros?: number;
  litros?: number;
  combustible?: FuelType | string;
  clase_tipo?: string | null;
  origen?: string;
  serie_vehicular?: string;  // VIN
  numero_motor?: string;
  clave_vehicular?: string;
  placa?: string;
  placa_anterior?: string | null;
  repuve?: string;
}

export interface DocumentData {
  tipo: 'Tarjeta de Circulación';
  numero_tarjeta?: string;
  vigencia?: string;
  fecha_expedicion?: string;     // ISO yyyy-mm-dd
  oficina_expedidora?: string;
  tipo_servicio?: string;
}

export interface OwnerData {
  nombre?: string;
  rfc?: string;
  curp?: string;
  razon_social?: string;
}

export interface ParsedCirculationCard {
  entidad?: string;
  pais: 'México';
  institucion?: string;
  documento: DocumentData;
  vehiculo: VehicleData;
  propietario: OwnerData;
  funcionarios?: { nombre?: string; cargo?: string };
  raw?: { text: string };
  warnings: string[];
}

// ----------------- Helpers -----------------

const toUpper = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

const normLines = (txt: string) =>
  txt.replace(/\r/g, '')
    .split('\n')
    .map(l => toUpper(l).replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const pickFirst = <T>(...vals: (T)[]) =>
  vals.find(v => v !== undefined && v !== null && String(v).trim() !== '');

const readNumber = (s?: string) => (s && /^\d+$/.test(s) ? Number(s) : undefined);

const parseDateIso = (s?: string) => {
  if (!s) return undefined;
  const m1 = s.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/); // 14/08/2018
  const m2 = s.match(/(\d{4})[\/\-\.](\d{2})[\/\-\.](\d{2})/); // 2018-08-14
  if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return undefined;
};

const detectVIN = (text: string) => text.match(/\b([A-HJ-NPR-Z0-9]{17})\b/)?.[1];
const detectPlate = (text: string) => text.match(/\b([A-Z]{3}\d{3,4}|[A-Z]{1,2}\d{5}|[A-Z]{1}\d{6}|[A-Z]{2}\d{4}[A-Z]{1})\b/)?.[1];
const detectRFC = (text: string) => text.match(/\b([A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3})\b/)?.[1];
const detectRFCLoose = (text: string) => text.match(/\b([A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{0,3})\b/)?.[1]; // permite incompleto
const detectREPUVE = (text: string) => text.match(/\b([A-Z0-9]{8,14})\b/)?.[1];

const LABEL_RE = /^(CVE\.? VEHICULAR|CLAVE VEHICULAR|NUMERO DE MOTOR|MOTOR|PLACA( ANT)?|FECHA|OFICINA EXPEDIDORA|RFC|REPUVE|NOMBRE DEL PROPIETARIO|RAZON SOCIAL|VEHICULO|MODELO|CILINDROS|LITROS|CLASE Y TIPO|COMBUSTIBLE|VIGENCIA|NO\.? ?TARJETA|TARJETA|USA VEHICULO|USO VEHICULAR|ORIGEN VEHICULO|SERIE VEHICULAR|VIN|TIPO DE SERVICIO)\b/;
const NOT_VALUE_RE = /^(0|00|A|NA|N\/A|SIN DATO|S\/D)$/;

// Busca el primer valor plausible tras la etiqueta (saltando etiquetas intermedias y ruido).
function valueAfterLabel(
  lines: string[],
  labelRegex: RegExp,
  opts?: { maxLookahead?: number; preferPattern?: RegExp; coalesceTwoLinesAsFloat?: boolean }
): string | undefined {
  const idx = lines.findIndex(l => labelRegex.test(l));
  if (idx === -1) return undefined;

  const max = opts?.maxLookahead ?? 6;
  for (let i = 1; i <= max && (idx + i) < lines.length; i++) {
    const cand = lines[idx + i];
    if (!cand || LABEL_RE.test(cand) || NOT_VALUE_RE.test(cand)) continue;

    if (opts?.preferPattern) {
      const m = cand.match(opts.preferPattern);
      if (m) return m[1] ?? m[0];
      continue;
    }
    if (opts?.coalesceTwoLinesAsFloat && /^\d$/.test(cand)) {
      const next = lines[idx + i + 1];
      if (next && /^\d$/.test(next)) return `${cand}.${next}`;
    }
    return cand;
  }
  return undefined;
}

// Elige el número MÁS LARGO tras la etiqueta (útil para No. Tarjeta y Clave Vehicular).
function valueDigitsAfterLabelLongest(
  lines: string[],
  labelRegex: RegExp,
  minLen = 5,
  lookahead = 8
): string | undefined {
  const idx = lines.findIndex(l => labelRegex.test(l));
  if (idx === -1) return undefined;

  let best: string | undefined;
  let maxLen = 0;

  for (let i = 1; i <= lookahead && (idx + i) < lines.length; i++) {
    const cand = lines[idx + i];
    if (!cand || LABEL_RE.test(cand)) continue;
    const digits = (cand.match(/\d+/g) || []).join('');
    if (digits.length >= minLen && digits.length > maxLen) {
      best = digits; maxLen = digits.length;
      if (maxLen >= 10) break; // típico 10–12 para No. Tarjeta
    }
  }
  return best;
}

// Mapea bloques tipo columna: [PLACA, PLACA ANT, FECHA EXP...] seguidos por [VAL1, VAL2, VAL3...]
function mapContiguousLabelValueBlock(lines: string[], startLabelRegex: RegExp) {
  const start = lines.findIndex(l => startLabelRegex.test(l));
  if (start === -1) return null;

  // recolecta etiquetas contiguas
  const labels: string[] = [];
  let i = start;
  while (i < lines.length && LABEL_RE.test(lines[i])) { labels.push(lines[i]); i++; }

  // valores contiguos que siguen a las etiquetas
  const values: string[] = [];
  let j = i;
  while (j < lines.length && !LABEL_RE.test(lines[j]) && values.length < labels.length) {
    if (!NOT_VALUE_RE.test(lines[j])) values.push(lines[j]);
    else values.push(lines[j]); // conserva '0' para poder decidir después (placa_ant)
    j++;
  }

  return { labels, values, startIndex: start, endIndex: j - 1 };
}

// ----------------- Parsers por estado -----------------

type StateParser = (text: string, lines: string[]) => Partial<ParsedCirculationCard>;

const parserCDMX: StateParser = (text, lines) => {
  const out: Partial<ParsedCirculationCard> = {
    entidad: 'CDMX',
    institucion: 'SECRETARIA DE MOVILIDAD DE LA CIUDAD DE MEXICO',
  };

  // Documento
  const numero_tarjeta =
    pickFirst(
      valueDigitsAfterLabelLongest(lines, /^NO\.? ?TARJETA\b/, 6, 10),
      valueDigitsAfterLabelLongest(lines, /^TARJETA\b/, 6, 10)
    ) || undefined;

  // Bloque PLACA / PLACA ANT / FECHA EXP...
  const placaBlock = mapContiguousLabelValueBlock(lines, /^PLACA\b/);
  let placa: string | undefined;
  let placa_anterior: string | null | undefined;
  let fecha_expedicion: string | undefined;

  if (placaBlock) {
    const labelIndex = (name: RegExp) => placaBlock.labels.findIndex(l => name.test(l));
    const idxPlaca = labelIndex(/^PLACA\b/);
    const idxPlacaAnt = labelIndex(/^PLACA ANT\b/);
    const idxFecha = labelIndex(/^FECHA\b/);

    if (idxPlaca >= 0 && placaBlock.values[idxPlaca]) placa = placaBlock.values[idxPlaca];
    if (idxPlacaAnt >= 0 && placaBlock.values[idxPlacaAnt]) {
      const v = placaBlock.values[idxPlacaAnt];
      placa_anterior = /^(0|NA|N\/A|SIN PLACA|S\/P)$/i.test(v) ? null : v;
    }
    if (idxFecha >= 0 && placaBlock.values[idxFecha]) {
      fecha_expedicion = parseDateIso(placaBlock.values[idxFecha]);
    }
  }

  // Si no la obtuvimos por bloque, intenta por etiqueta simple
  if (!fecha_expedicion) {
    fecha_expedicion = parseDateIso(pickFirst(
      valueAfterLabel(lines, /^FECHA EXP/i, { preferPattern: /([0-9]{2}[\/\-\.][0-9]{2}[\/\-\.][0-9]{4})/ })
    ) || "");
  }

  const oficina_expedidora =
    pickFirst(
      valueAfterLabel(lines, /^OFICINA EXPEDIDORA\b/),
      text.match(/OFICINA\s+EXPEDIDORA[: ]+([A-Z0-9 .,'&Ñ]+)/)?.[1]
    ) || undefined;

  const vigencia =
    pickFirst(
      valueAfterLabel(lines, /^VIGENCIA\b/),
      text.match(/VIGENCIA[: ]+([A-Z0-9 ]+)/)?.[1]
    ) || undefined;

  const tipo_servicio =
    pickFirst(
      valueAfterLabel(lines, /^(USA VEHICULO|USO VEHICULAR|TIPO DE SERVICIO)\b/),
      text.match(/(USA VEHICULO|USO VEHICULAR|TIPO DE SERVICIO)[: ]+([A-Z ]+)/)?.[2]
    ) || undefined;

  // Vehículo
  const numero_motor =
    pickFirst(
      valueAfterLabel(lines, /^NUMERO DE MOTOR\b/),
      text.match(/NUMERO\s+DE\s+MOTOR[: ]+([A-Z0-9\-]+)/)?.[1]
    ) || undefined;

  const clave_vehicular =
    pickFirst(
      valueDigitsAfterLabelLongest(lines, /^CVE\.? VEHICULAR\b/, 5, 10),
      text.match(/CLAVE\s+VEHICULAR[: ]+([A-Z0-9]+)/)?.[1]
    ) || undefined;

  if (!placa) placa = pickFirst(
    valueAfterLabel(lines, /^PLACA(?! ANT)\b/, { preferPattern: /\b([A-Z0-9\-]{5,8})\b/ }),
    detectPlate(text)
  );

  const repuve =
    pickFirst(
      valueAfterLabel(lines, /^REPUVE\b/),
      text.includes('REPUVE') ? detectREPUVE(text) : undefined
    ) || undefined;

  const serie_vehicular =
    pickFirst(
      valueAfterLabel(lines, /^(SERIE VEHICULAR|VIN|SERIE)\b/, { preferPattern: /\b([A-HJ-NPR-Z0-9]{17})\b/ }),
      detectVIN(text)
    ) || undefined;

  // Marca y línea (siguiente línea a la etiqueta "Vehiculo (Marca y Linea)")
  let marca: string | undefined;
  let lineaVeh: string | undefined;
  const idxMarca = lines.findIndex(l => /VEHICULO/.test(l) && /(MARCA|LINEA|LINES)/.test(l));
  if (idxMarca >= 0 && lines[idxMarca + 1]) {
    const raw = lines[idxMarca + 1];
    // separa razón social larga de la línea (marca vs modelo/línea)
    const corp = /(S\.?A\.?( DE)? (DE )?C\.?V\.?)/;
    const pos = raw.search(corp);
    if (pos >= 0) {
      const end = pos + raw.slice(pos).match(corp)![0].length;
      marca = raw.slice(0, end).trim();
      const resto = raw.slice(end).trim().replace(/^[,.\- ]+/, '');
      lineaVeh = resto || undefined;
    } else {
      const m2 = raw.match(/^([A-Z0-9 .,&\-]+?)\s+(.*)$/);
      if (m2) { marca = m2[1].trim(); lineaVeh = m2[2].trim(); }
      else { marca = raw; }
    }
  }

  // Modelo / cilindros / litros
  const modelo =
    readNumber(text.match(/MODELO[: ]+((19|20)\d{2})/)?.[1]) ??
    readNumber(text.match(/\b(19|20)\d{2}\b/)?.[0]);
  const cilindros =
    readNumber(text.match(/CILINDROS[: ]+(\d{1,2})/)?.[1]) ??
    readNumber(lines.find(l => /^CILINDROS\b/.test(l))?.replace(/^CILINDROS[: ]+/, '')) ??
    // heurística: si aparece "2012 4" tras CVE. Vehicular, toma el 2º número como cilindros
    (() => {
      const idx = lines.findIndex(l => /^CVE\.? VEHICULAR\b/.test(l));
      if (idx >= 0 && lines[idx + 1]) {
        const nums = lines[idx + 1].match(/\d+/g);
        if (nums && nums.length >= 2) return readNumber(nums[1]);
      }
      return undefined;
    })();
  const litrosRaw =
    pickFirst(
      text.match(/LITROS[: ]+(\d+[\.,]?\d*)/)?.[1],
      valueAfterLabel(lines, /^LITROS\b/, { coalesceTwoLinesAsFloat: true })
    );
  const litros = litrosRaw ? Number(litrosRaw.replace(',', '.')) : undefined;

  const combustible =
    pickFirst(
      text.match(/COMBUSTIBLE[: ]+(GASOLINA|DIESEL|HIBRIDO|ELECTRICO|GAS LP|GAS NATURAL)/)?.[1]
        ?.replace('DIESEL', 'Diésel'),
      valueAfterLabel(lines, /^COMBUSTIBLE\b/)
    ) || undefined;

  const clase_tipo = valueAfterLabel(lines, /^CLASE Y TIPO\b/) || null;
  const origen = valueAfterLabel(lines, /^ORIGEN VEHICULO\b/) || undefined;

  // Propietario (RFC después de ":" en la misma línea del nombre)
  let nombre = undefined as string | undefined;
  let rfc = detectRFC(text);
  const iProp = lines.findIndex(l => /NOMBRE DEL PROPIETARIO|RAZON SOCIAL/.test(l));
  if (iProp >= 0 && lines[iProp + 1]) {
    const raw = lines[iProp + 1];
    const parts = raw.split(':').map(x => x.trim());
    if (parts.length >= 1) nombre = parts[0];
    if (!rfc && parts.length >= 2) {
      const maybe = parts[1];
      rfc = detectRFC(maybe) || detectRFCLoose(maybe) || undefined;
    }
  }

  out.documento = {
    tipo: 'Tarjeta de Circulación',
    numero_tarjeta,
    vigencia,
    fecha_expedicion,
    oficina_expedidora,
    tipo_servicio,
  };

  out.vehiculo = {
    marca,
    linea: lineaVeh,
    modelo,
    cilindros,
    litros,
    combustible,
    clase_tipo,
    origen,
    serie_vehicular,
    numero_motor,
    clave_vehicular,
    placa,
    placa_anterior,
    repuve,
  };

  out.propietario = { nombre, rfc };

  return out;
};

const parserEdoMex: StateParser = (text, lines) => {
  const out: Partial<ParsedCirculationCard> = {
    entidad: 'Estado de México',
    institucion: 'SECRETARIA DE MOVILIDAD DEL ESTADO DE MEXICO',
  };

  const numero_tarjeta = pickFirst(
    valueDigitsAfterLabelLongest(lines, /^(NO\.?\s*DE\s*TARJETA|FOLIO|TARJETA N[°O])\b/, 6, 10),
    text.match(/\b(\d{10,})\b/)?.[1]
  );
  const fecha_expedicion = parseDateIso(
    pickFirst(
      valueAfterLabel(lines, /^FECHA (DE )?EXP/i, { preferPattern: /([0-9]{2}[\/\-\.][0-9]{2}[\/\-\.][0-9]{4})/ })
    ) || ""
  );
  const oficina = valueAfterLabel(lines, /(OFICINA|MODULO) EXPEDIDOR(A|ES?)/);
  const vigencia = pickFirst(
    valueAfterLabel(lines, /^VIGENCIA\b/),
    text.match(/VIGENCIA[: ]+([A-Z0-9 ]+)/)?.[1]
  );
  const tipo_servicio = pickFirst(
    valueAfterLabel(lines, /^(TIPO DE SERVICIO|USO VEHICULAR)\b/),
    text.match(/TIPO\s+DE\s+SERVICIO[: ]+([A-Z ]+)/)?.[1]
  );

  const placa = pickFirst(
    valueAfterLabel(lines, /^PLACA\b/, { preferPattern: /\b([A-Z0-9\-]{5,8})\b/ }),
    detectPlate(text)
  );
  const serie_vehicular = pickFirst(
    valueAfterLabel(lines, /^(SERIE|VIN)\b/, { preferPattern: /\b([A-HJ-NPR-Z0-9]{17})\b/ }),
    detectVIN(text)
  );
  const numero_motor = pickFirst(
    valueAfterLabel(lines, /^(MOTOR|NO\.? MOTOR|NUMERO DE MOTOR)\b/),
    text.match(/(MOTOR|NO\.? MOTOR)[: ]+([A-Z0-9\-]+)/)?.[2]
  );

  const marca = valueAfterLabel(lines, /^MARCA\b/) || text.match(/MARCA[: ]+([A-Z0-9 .,&\-]+)/)?.[1];
  const linea = valueAfterLabel(lines, /^(LINEA|TIPO|VERSION)\b/) || text.match(/(LINEA|TIPO|VERSION)[: ]+([A-Z0-9 .,&\-]+)/)?.[2];
  const modelo = readNumber(text.match(/MODELO[: ]+((19|20)\d{2})/)?.[1]) ??
    readNumber(text.match(/\b(19|20)\d{2}\b/)?.[0]);
  const combustible = pickFirst(
    valueAfterLabel(lines, /^COMBUSTIBLE\b/),
    text.match(/COMBUSTIBLE[: ]+([A-Z ]+)/)?.[1]
  );

  const nombre = pickFirst(
    valueAfterLabel(lines, /^(NOMBRE DEL PROPIETARIO|RAZON SOCIAL)\b/),
    text.match(/(NOMBRE DEL PROPIETARIO|RAZON SOCIAL)[: ]+([A-Z0-9 .,'&Ñ]+)/)?.[2]
  );
  let rfc = detectRFC(text);
  if (!rfc && nombre) {
    const afterColon = nombre.split(':')[1]?.trim();
    if (afterColon) rfc = detectRFC(afterColon) || detectRFCLoose(afterColon) || undefined;
  }

  out.documento = {
    tipo: 'Tarjeta de Circulación',
    numero_tarjeta,
    fecha_expedicion,
    vigencia,
    oficina_expedidora: oficina,
    tipo_servicio,
  };

  out.vehiculo = {
    marca: marca?.trim(),
    linea: linea?.trim(),
    modelo,
    combustible,
    serie_vehicular,
    numero_motor,
    placa,
  };

  out.propietario = { nombre: nombre?.split(':')[0]?.trim(), rfc };

  return out;
};

// Fallback genérico
const parserGenerico: StateParser = (text, lines) => {
  const numero_tarjeta = pickFirst(
    valueDigitsAfterLabelLongest(lines, /^(NO\.?\s*DE\s*TARJETA|TARJETA N[°O]|FOLIO|TARJETA)\b/, 6, 10),
    text.match(/\b(\d{10,})\b/)?.[1]
  );
  const fecha_expedicion = parseDateIso(
    pickFirst(
      valueAfterLabel(lines, /^FECHA (DE )?EXP/i, { preferPattern: /([0-9]{2}[\/\-\.][0-9]{2}[\/\-\.][0-9]{4})/ })
    )||""
  );

  return {
    documento: {
      tipo: 'Tarjeta de Circulación',
      numero_tarjeta,
      fecha_expedicion,
      vigencia: valueAfterLabel(lines, /^VIGENCIA\b/),
    },
    vehiculo: {
      marca: valueAfterLabel(lines, /^MARCA\b/) || text.match(/MARCA[: ]+([A-Z0-9 .,&\-]+)/)?.[1],
      linea: valueAfterLabel(lines, /^(LINEA|TIPO|VERSION)\b/) || text.match(/(LINEA|TIPO|VERSION)[: ]+([A-Z0-9 .,&\-]+)/)?.[2],
      modelo: readNumber(text.match(/MODELO[: ]+((19|20)\d{2})/)?.[1]) ??
        readNumber(text.match(/\b(19|20)\d{2}\b/)?.[0]),
      combustible: valueAfterLabel(lines, /^COMBUSTIBLE\b/) || text.match(/COMBUSTIBLE[: ]+([A-Z ]+)/)?.[1],
      serie_vehicular: pickFirst(
        valueAfterLabel(lines, /^(SERIE VEHICULAR|VIN|SERIE)\b/, { preferPattern: /\b([A-HJ-NPR-Z0-9]{17})\b/ }),
        detectVIN(text)
      ),
      numero_motor: pickFirst(
        valueAfterLabel(lines, /^(NUMERO DE MOTOR|MOTOR|NO\.? MOTOR)\b/),
        text.match(/(NUMERO DE MOTOR|MOTOR|NO\.? MOTOR)[: ]+([A-Z0-9\-]+)/)?.[2]
      ),
      placa: pickFirst(
        valueAfterLabel(lines, /^PLACA\b/, { preferPattern: /\b([A-Z0-9\-]{5,8})\b/ }),
        detectPlate(text)
      ),
      repuve: text.includes('REPUVE') ? detectREPUVE(text) : undefined,
    },
    propietario: {
      nombre: valueAfterLabel(lines, /^(NOMBRE DEL PROPIETARIO|PROPIETARIO|RAZON SOCIAL)\b/)
        || text.match(/(NOMBRE DEL PROPIETARIO|PROPIETARIO|RAZON SOCIAL)[: ]+([A-Z0-9 .,'&Ñ]+)/)?.[2],
      rfc: (() => {
        const n = valueAfterLabel(lines, /^(NOMBRE DEL PROPIETARIO|RAZON SOCIAL)\b/);
        const afterColon = n?.split(':')[1]?.trim();
        return detectRFC(afterColon || '') || detectRFCLoose(afterColon || '') || detectRFC(text);
      })(),
    },
  };
};

// ----------------- Detección de estado y orquestación -----------------

const STATE_PARSERS: Record<string, StateParser> = {
  CDMX: parserCDMX,
  'ESTADO DE MEXICO': parserEdoMex,
};

function detectEntidad(lines: string[]): string | undefined {
  if (lines.some(l => /CIUDAD DE MEXICO|CDMX|SEMOVI|SECRETARIA DE MOVILIDAD/.test(l))) return 'CDMX';
  if (lines.some(l => /ESTADO DE MEXICO|E\.?DOMEX|SECRETARIA DE MOVILIDAD DEL ESTADO/.test(l))) return 'ESTADO DE MEXICO';
  return undefined;
}

export function parseCirculationCard(rawText: string): ParsedCirculationCard {
  const text = toUpper(rawText);
  const lines = normLines(rawText);

  const entidad = detectEntidad(lines);
  const base: ParsedCirculationCard = {
    entidad,
    pais: 'México',
    institucion: undefined,
    documento: { tipo: 'Tarjeta de Circulación' },
    vehiculo: {},
    propietario: {},
    warnings: [],
    raw: { text: rawText },
  };

  const parser = (entidad && STATE_PARSERS[entidad]) ? STATE_PARSERS[entidad] : parserGenerico;
  const parsed = parser(text, lines);

  const out: ParsedCirculationCard = {
    ...base,
    ...parsed,
    entidad: parsed.entidad ?? base.entidad,
    institucion: parsed.institucion ?? base.institucion,
    documento: { ...base.documento, ...(parsed.documento || {}) },
    vehiculo: { ...base.vehiculo, ...(parsed.vehiculo || {}) },
    propietario: { ...base.propietario, ...(parsed.propietario || {}) },
    warnings: base.warnings,
    raw: base.raw,
  };

  // Warnings útiles
  if (!out.vehiculo?.serie_vehicular) out.warnings.push('VIN/Serie no detectado.');
  if (!out.vehiculo?.placa) out.warnings.push('Placa no detectada.');
  if (!out.documento?.fecha_expedicion) out.warnings.push('Fecha de expedición no detectada.');
  if (!out.propietario?.rfc) out.warnings.push('RFC no detectado.');
  else if (out.propietario.rfc.length < 13) out.warnings.push('RFC del propietario parece incompleto (faltan homoclave).');

  return out;
}

