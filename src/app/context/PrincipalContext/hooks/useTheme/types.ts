export type Theme = 'light' | 'dark';

/**
 * Valor expuesto por `ThemeContext`.
 */
export interface UseThemeReturn{
  theme: Theme;
  toggleTheme: () => void;
  setDarkTheme: () => void
}