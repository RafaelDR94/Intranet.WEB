import { renderHook, act } from '@testing-library/react';

import useTheme from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('inicia con el tema por defecto "light"', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('recupera el tema desde localStorage si existe', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme alterna entre light y dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });

  it('setDarkTheme fuerza el modo oscuro', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setDarkTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('actualiza el atributo data-theme en el DOM', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setDarkTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('guarda el tema en localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setDarkTheme());
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
