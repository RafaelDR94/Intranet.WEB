'use client';
import { useEffect, useState, useMemo } from 'react';
import { Theme, UseThemeReturn } from './types';

/**
 * Hook useTheme
 *
 * Maneja el tema global (`light` o `dark`) usando `localStorage` y `data-theme`.
 * Se sincroniza con el DOM mediante `document.documentElement.setAttribute("data-theme", theme)`.
 *
 * @returns Objeto con el tema actual y funciones para alternar o forzar el modo oscuro.
 */
const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<Theme>('light');

  // Al montar, lee el tema guardado (si existe)
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  // Al cambiar el tema, actualiza el DOM y el localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const setDarkTheme = () => setTheme('dark');

  const value: UseThemeReturn = useMemo(() => ({
    theme,
    toggleTheme,
    setDarkTheme,
  }), [theme]);

  return value;
};

export default useTheme;
