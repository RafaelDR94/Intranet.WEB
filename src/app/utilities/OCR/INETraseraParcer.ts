// src/utilities/ine/parseIneMrz.ts
export type Sexo = 'H' | 'M';

export interface MrzRaw {
  linea1: string;
  linea2: string;
  linea3: string;
}

export interface MrzDecoded {
  documento: {
    tipo: 'ID';
    pais: 'MEX';
    numero_documento: string;
    numero_adicional?: string;
  };
  titular: {
    primer_apellido: string;
    segundo_apellido?: string;
    nombres: string;
    sexo?: Sexo;
    nacionalidad?: 'MEX';
  };
  fecha_nacimiento?: string;   // ISO yyyy-mm-dd
  fecha_expiracion?: string;   // ISO yyyy-mm-dd
  codigos?: {
    estado_o_zona?: string;
    codigo_interno?: string;
  };
  validation: {
    birthChecksumOk?: boolean;
    expiryChecksumOk?: boolean;
    globalChecksumOk?: boolean;
  };
  notas?: string;
}

export interface MrzResult {
  mrz_raw: MrzRaw;
  mrz_decoded: MrzDecoded;
}

const WEIGHTS = [7, 3, 1];
const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function charValue(c: string): number {
  if (c === '<') return 0;
  const i = CHARSET.indexOf(c);
  return i >= 0 ? i : 0;
}

function mrzChecksum(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += charValue(data[i]) * WEIGHTS[i % 3];
  return sum % 10;
}

function yymmddToISO(yymmdd?: string): string | undefined {
  if (!yymmdd || !/^\d{6}$/.test(yymmdd)) return undefined;
  const yy = parseInt(yymmdd.slice(0, 2), 10);
  const mm = yymmdd.slice(2, 4);
  const dd = yymmdd.slice(4, 6);
  const yyyy = yy <= 49 ? 2000 + yy : 1900 + yy;
  if (+mm < 1 || +mm > 12 || +dd < 1 || +dd > 31) return undefined;
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Intenta extraer las 3 líneas MRZ desde un texto OCR ruidoso.
 * - Detecta línea 1 que empieza con IDMEX
 * - Detecta línea 2: patron fecha nacimiento + checksum + sexo + fecha exp + checksum + nacionalidad
 * - Detecta línea 3: apellidos<<nombres
 */
export function extractMrzLinesFromOcr(ocr: string): MrzRaw | null {
  const lines = ocr
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l =>
      l
        .trim()
        .replace(/\s+/g, ' ')
        .toUpperCase()
    )
    .filter(Boolean);

  const L1re = /^IDMEX[A-Z0-9<]+$/; // tolerante
  // 2a línea: YYMMDD (6) + chk (1) + sexo (H/M) (1) + YYMMDD (6) + chk (1) + NACIONALIDAD (3) + resto + chk final (1)
  const L2reLoose = /^(\d{6})(\d)([HM])(\d{6})(\d)([A-Z]{3}).+(\d)$/;
  const L3re = /^[A-ZÑÁÉÍÓÚ ]+<<[A-ZÑÁÉÍÓÚ< ]+$/;

  let l1: string | undefined;
  let l2: string | undefined;
  let l3: string | undefined;

  // 1) Intenta encontrar 3 líneas que calcen cada regex
  for (const l of lines) {
    if (!l1 && L1re.test(l)) { l1 = l; continue; }
    if (l1 && !l2 && L2reLoose.test(l)) { l2 = l; continue; }
    if (l1 && l2 && !l3 && L3re.test(l)) { l3 = l; break; }
  }

  // 2) Si no se encontraron bien separadas, intenta reconstruir pegadas
  if (!(l1 && l2 && l3)) {
    const joined = lines.join('');
    const m1 = joined.match(/IDMEX[A-Z0-9<]+/);
    const m2 = joined.match(/\d{6}\d[HM]\d{6}\d[A-Z]{3}[^A-Z0-9]*.*\d/);
    const m3 = joined.match(/[A-ZÑÁÉÍÓÚ ]+<<[A-ZÑÁÉÍÓÚ< ]+/);
    if (m1) l1 = m1[0];
    if (m2) l2 = m2[0].replace(/\s+/g, '');
    if (m3) l3 = m3[0].replace(/\s+/g, ' ').trim();
  }

  if (l1 && l2 && l3) return { linea1: l1, linea2: l2, linea3: l3 };
  return null;
}

// ===== Parser principal (usa la extracción flexible) =====
export function parseIneMrz(input: string | Partial<MrzRaw>): MrzResult {
  let mrz_raw: MrzRaw;
  if (typeof input === 'string') {
    const extracted = extractMrzLinesFromOcr(input);
    if (!extracted) throw new Error('No se pudieron localizar las 3 líneas MRZ dentro del texto OCR.');
    mrz_raw = extracted;
  } else {
    const { linea1, linea2, linea3 } = input;
    if (!linea1 || !linea2 || !linea3) throw new Error('MRZ incompleta (linea1/linea2/linea3).');
    mrz_raw = { linea1: linea1.toUpperCase().trim(), linea2: linea2.toUpperCase().trim(), linea3: linea3.toUpperCase().trim() };
  }

  const L1 = mrz_raw.linea1;
  const L2 = mrz_raw.linea2;
  const L3 = mrz_raw.linea3;

  // ----- L1 -----
  const tipo = L1.slice(0, 2) as 'ID';
  const pais = L1.slice(2, 5) as 'MEX';
  const [numDocPart, numAdicPart] = L1.slice(5).split('<<');
  const numero_documento = (numDocPart || '').replace(/<+/g, '');
  const numero_adicional = (numAdicPart || '').replace(/<+/g, '') || undefined;

  // ----- L2 -----
  let idx = 0;
  const birthRaw = L2.slice(idx, idx + 6); idx += 6;
  const birthChk = L2.slice(idx, idx + 1); idx += 1;
  const sex = L2.slice(idx, idx + 1); idx += 1;
  const expRaw = L2.slice(idx, idx + 6); idx += 6;
  const expChk = L2.slice(idx, idx + 1); idx += 1;
  const nationality = L2.slice(idx, idx + 3) as 'MEX'; idx += 3;
  const tail = L2.slice(idx);
  const globalChk = tail.slice(-1);
  const body = tail.slice(0, -1);

  let estado_o_zona: string | undefined;
  let codigo_interno: string | undefined;
  {
    const bodyClean = body.replace(/<+/g, '<');
    const m = bodyClean.match(/<(\d{1,3})<+(\d{2,10})</);
    if (m) {
      estado_o_zona = m[1];
      codigo_interno = m[2];
    } else {
      const digits = body.replace(/[^0-9]/g, '');
      if (digits.length >= 2) {
        estado_o_zona = digits.slice(0, 2);
        codigo_interno = digits.slice(2) || undefined;
      }
    }
  }

  const birthChecksumOk = /^\d$/.test(birthChk) ? mrzChecksum(birthRaw) === +birthChk : undefined;
  const expiryChecksumOk = /^\d$/.test(expChk) ? mrzChecksum(expRaw) === +expChk : undefined;
  const globalSequence = birthRaw + birthChk + sex + expRaw + expChk + nationality + body;
  const globalChecksumOk = /^\d$/.test(globalChk) ? mrzChecksum(globalSequence) === +globalChk : undefined;

  const fecha_nacimiento = yymmddToISO(birthRaw);
  const fecha_expiracion = yymmddToISO(expRaw);
  const sexo: Sexo | undefined = /^(H|M)$/.test(sex) ? (sex as Sexo) : undefined;

  // ----- L3 -----
  const parts = L3.split('<<');
  const apellidosChunk = (parts[0] || '').trim();
  const nombresChunk = (parts[1] || '').replace(/<+/g, ' ').trim();
  const apellidos = apellidosChunk.split(' ').filter(Boolean);
  const primer_apellido = apellidos[0] || '';
  const segundo_apellido = apellidos[1] || undefined;
  const nombres = nombresChunk;

  const mrz_decoded: MrzDecoded = {
    documento: { tipo, pais, numero_documento, numero_adicional },
    titular: {
      primer_apellido,
      segundo_apellido,
      nombres,
      sexo,
      nacionalidad: nationality,
    },
    fecha_nacimiento,
    fecha_expiracion,
    codigos: { estado_o_zona, codigo_interno },
    validation: {
      birthChecksumOk,
      expiryChecksumOk,
      globalChecksumOk,
    },
    notas:
      !estado_o_zona && !codigo_interno
        ? 'Estado/código interno inferidos con heurística por formato no estándar del OCR.'
        : undefined,
  };

  return { mrz_raw, mrz_decoded };
}
