/**
 * Obtiene las iniciales de un nombre completo.
 * 
 * @param fullname - El nombre completo (ej. "Juan Carlos Rivera").
 * @returns Las iniciales en mayúsculas (ej. "JCR").
 */
export const getInitials = (fullname: string): string => {
  if (!fullname.trim()) return '';
  return fullname
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('');
};

/**
 * Devuelve una versión corta del nombre con:
 * - Primer nombre completo
 * - Inicial del segundo nombre
 * - Apellido paterno completo
 * - Inicial del apellido materno
 * 
 * @param fullname - El nombre completo (ej. "Ana Lucía Torres González")
 * @returns Una cadena formateada (ej. "Ana L. Torres G.")
 */
export const getShortenedName = (fullname: string): string => {
  const parts = fullname.trim().split(' ').filter(Boolean);

  if (parts.length < 3) return fullname; // No cumple estructura mínima

  if (parts.length === 3) {
    const [firstName, lastName1, lastName2] = parts;
    return `${firstName} ${lastName1} ${lastName2[0].toUpperCase()}.`;
  }

  if (parts.length >= 4) {
    const [firstName, secondName, lastName1, lastName2] = parts;
    return `${firstName} ${secondName[0].toUpperCase()}. ${lastName1} ${lastName2[0].toUpperCase()}.`;
  }

  return fullname;
};