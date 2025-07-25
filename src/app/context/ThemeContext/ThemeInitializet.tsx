// src/context/ThemeContext/ThemeInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

export default function ThemeInitializer() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return null;
}
