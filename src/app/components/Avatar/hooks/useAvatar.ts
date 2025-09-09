/**
 * Hook para obtener las iniciales a mostrar en el Avatar.
 * Devuelve las iniciales proporcionadas o las generadas a partir del alt.
 */
import { useMemo } from 'react';

import { getInitials } from '../utilities/getInitials';

export const useAvatar = (initials?: string, alt?: string) =>
  useMemo(() => initials || getInitials(alt || ''), [initials, alt]);

export default useAvatar;