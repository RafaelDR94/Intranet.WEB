// src/context/ThemeContext/ThemeInitializer.tsx
'use client';

import { useEffect } from 'react';
import { usePrincipal } from '../PrincipalContext';

export default function ThemeInitializer() {
  const {usePrincipalTheme}=usePrincipal();
 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', usePrincipalTheme.theme);
  }, [usePrincipalTheme.theme]);

  return null;
}
