/* eslint-disable no-useless-escape */
// src/utilities/ine/parseIneText.ts
export type IneSexo = 'H' | 'M';

export interface IneNombre {
  primer_apellido?: string;
  segundo_apellido?: string;
  nombres?: string;
}

export interface IneDomicilio {
  calle?: string;
  colonia?: string;
  codigo_postal?: string;
  municipio?: string;
  estado?: string;
}

export interface IneData {
  pais?: string;
  institucion?: string;
  tipo_credencial?: string;
  nombre?: IneNombre;
  fecha_nacimiento?: string; // ISO yyyy-mm-dd
  sexo?: IneSexo;
  domicilio?: IneDomicilio;
  clave_elector?: string;
  curp?: string;
  estado_codigo?: number;
  anio_registro?: number;
  emision?: number;
  vigencia?: number;
  municipio_codigo?: number;
  seccion?: number;
  localidad_codigo?: string;
  // opcional: crudo por si necesitas depurar
  _raw?: string;
}

const ESTADO_ABBR_MAP: Record<string, string> = {
  'AGS.': 'Aguascalientes',
  'BC.': 'Baja California',
  'BCS.': 'Baja California Sur',
  'CAMP.': 'Campeche',
  'COAH.': 'Coahuila',
  'COL.': 'Colima',
  'CHIS.': 'Chiapas',
  'CHIH.': 'Chihuahua',
  'CDMX': 'Ciudad de México',
  'D.F.': 'Ciudad de México',
  'DGO.': 'Durango',
  'GTO.': 'Guanajuato',
  'GRO.': 'Guerrero',
  'HGO.': 'Hidalgo',
  'JAL.': 'Jalisco',
  'MEX.': 'México',
  'MICH.': 'Michoacán',
  'MOR.': 'Morelos',
  'NAY.': 'Nayarit',
  'NL.': 'Nuevo León',
  'OAX.': 'Oaxaca',
  'PUE.': 'Puebla',
  'QRO.': 'Querétaro',
  'QR.': 'Quintana Roo',
  'SLP.': 'San Luis Potosí',
  'SIN.': 'Sinaloa',
  'SON.': 'Sonora',
  'TAB.': 'Tabasco',
  'TAMPS.': 'Tamaulipas',
  'TLAX.': 'Tlaxcala',
  'VER.': 'Veracruz',
  'YUC.': 'Yucatán',
  'ZAC.': 'Zacatecas',
};

const norm = (s: string) => s.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
const toISO = (ddmmyyyy: string) => {
  const m = ddmmyyyy.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/);
  if (!m) return undefined;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
};

export function parseIneText(raw: string): IneData {
  const text = raw.normalize('NFKD'); // tolera acentos
  const lines = text.split('\n').map(l => norm(l)).filter(Boolean);

  const joinAll = lines.join('\n');

  // Campos directos por regex
  const curp = (joinAll.match(/\b([A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}\d{2})\b/i)?.[1] ?? '').toUpperCase() || undefined;
  const clave_elector = (joinAll.match(/CLAVE\s+DE\s+ELECTOR\s+([A-Z0-9]{16,20})/i)?.[1] ?? '').toUpperCase() || undefined;
  const fecha_nacimiento = toISO(joinAll.match(/FECHA\s+DE\s+NAC(?:IMIENTO)?\s+([0-9\/\.\-]{8,10})/i)?.[1] ?? '');
  const sexo = (joinAll.match(/SEXO\s+([HM])/i)?.[1]?.toUpperCase() as IneSexo) || undefined;

  const estado_codigo = parseInt(joinAll.match(/ESTADO\s+(\d{1,2})/i)?.[1] ?? '', 10) || undefined;
  const municipio_codigo = parseInt(joinAll.match(/MUNICIPIO\s+(\d{1,3})/i)?.[1] ?? '', 10) || undefined;
  const seccion = parseInt(joinAll.match(/SECCI[ÓO]N\s+(\d{1,5})/i)?.[1] ?? '', 10) || undefined;
  const localidad_codigo = joinAll.match(/LOCALIDAD\s+([0-9A-Z]{2,})/i)?.[1] || undefined;
  const anio_registro = parseInt(joinAll.match(/A[NÑ]O\s+DE\s+REGISTRO\s+(\d{4})/i)?.[1] ?? '', 10) || undefined;
  const emision = parseInt(joinAll.match(/EMISI[ÓO]N\s+(\d{4})/i)?.[1] ?? '', 10) || undefined;
  const vigencia = parseInt(joinAll.match(/VIGENCIA\s+(\d{4})/i)?.[1] ?? '', 10) || undefined;

  // Nombre: tomar tokens después de "NOMBRE" hasta la siguiente etiqueta conocida
  const nameIdx = lines.findIndex(l => /^NOMBRE\b/i.test(l));
  let nombre: IneNombre | undefined;
  if (nameIdx >= 0) {
    const stopLabels = /^(FECHA|SEXO|DOMICILIO|CLAVE|CURP|ESTADO|MUNICIPIO|SECCI|LOCALIDAD|EMISI|VIGENCIA)\b/i;
    const collected: string[] = [];
    for (let i = nameIdx + 1; i < lines.length; i++) {
      if (stopLabels.test(lines[i])) break;
      collected.push(lines[i]);
    }
    const tokens = norm(collected.join(' ')).split(' ').filter(Boolean);
    if (tokens.length >= 2) {
      nombre = {
        primer_apellido: tokens[0]?.toUpperCase(),
        segundo_apellido: tokens[1]?.toUpperCase(),
        nombres: tokens.slice(2).join(' ') || undefined,
      };
    } else if (tokens.length === 1) {
      nombre = { primer_apellido: tokens[0]?.toUpperCase() };
    }
  }

  // Domicilio: líneas después de "DOMICILIO"
  let domicilio: IneDomicilio | undefined;
  const domIdx = lines.findIndex(l => /^DOMICILIO\b/i.test(l));
  if (domIdx >= 0) {
    const domLines: string[] = [];
    for (let i = domIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      // detenernos al llegar a otra etiqueta importante
      if (/^(CLAVE|CURP|ESTADO|MUNICIPIO|SECCI|LOCALIDAD|EMISI|VIGENCIA|NOMBRE|FECHA|SEXO)\b/i.test(l)) break;
      domLines.push(l);
      if (domLines.length >= 3) break; // normalmente 2–3 líneas
    }
    const calle = domLines[0];
    const coloniaYcp = domLines[1] || '';
    const munYedo = domLines[2] || (domLines[1] || '');

    const codigo_postal = coloniaYcp.match(/\b(\d{5})\b/)?.[1];
    const colonia = norm(coloniaYcp.replace(/\b\d{5}\b/, '')).replace(/[,\-]+$/,'') || undefined;

    // municipio y estado (con abreviatura tipo "TULTEPEC, MEX.")
    let municipio: string | undefined;
    let estado: string | undefined;
    const m = munYedo.match(/^([^,]+),\s*([A-ZÁÉÍÓÚÑ\. ]+)$/i);
    if (m) {
      municipio = norm(m[1]).toUpperCase();
      const abbr = norm(m[2]).toUpperCase();
      estado = ESTADO_ABBR_MAP[abbr] || (abbr === 'MEXICO' ? 'México' : abbr);
    }

    domicilio = {
      calle,
      colonia,
      codigo_postal,
      municipio,
      estado,
    };
  }

  return {
    pais: 'México',
    institucion: 'Instituto Nacional Electoral',
    tipo_credencial: 'Credencial para Votar',
    nombre,
    fecha_nacimiento,
    sexo,
    domicilio,
    clave_elector,
    curp,
    estado_codigo,
    anio_registro,
    emision,
    vigencia,
    municipio_codigo,
    seccion,
    localidad_codigo,
    _raw: raw,
  };
}

