export function clamp(value: number, min?: number, max?: number) {
  if (typeof min === 'number' && value < min) return min;
  if (typeof max === 'number' && value > max) return max;
  return value;
}

/** Intenta parsear a número; retorna null si no es válido */
export function parseMaybeNumber(raw: string): number | null {
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}
