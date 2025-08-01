// src/context/ThemeContext/ThemeInitializer.tsx
'use client';

import { useEffect } from 'react';
import { usePrincipal } from '../PrincipalContext';

/**
 * Sincroniza el atributo `data-theme` del documento con el tema
 * actual del `PrincipalContext`.
 */

/**
 * Componente invisible que actualiza `data-theme` cuando cambia el tema.
 */
export default function ThemeInitializer() {
  const {usePrincipalTheme}=usePrincipal();
 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', usePrincipalTheme.theme);
  }, [usePrincipalTheme.theme]);

  return null;
}
