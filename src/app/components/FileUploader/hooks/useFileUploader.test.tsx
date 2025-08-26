// src/app/components/FileUploader/hooks/useFileUploader.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUploader } from './useFileUploader';

describe('useFileUploader hook', () => {
  it('handleChange actualiza fileName y llama a onFile', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploader(onFile, '.pdf,.xml', false));

    const file = new File(['contenido'], 'ejemplo.pdf', { type: 'application/pdf' });
    const input = { files: [file], value: 'cualquier-valor' } as unknown as HTMLInputElement;

    act(() => {
      result.current.handleChange({ target: input } as any);
    });

    expect(onFile).toHaveBeenCalledWith(file);
    expect(result.current.fileName).toBe('ejemplo.pdf');
    expect(input.value).toBe('');
  });

  it('handleButtonClick no dispara click cuando está deshabilitado', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploader(onFile, '.xml', true));

    const mockRef = { click: vi.fn() };
    result.current.inputRef.current = mockRef as any;

    act(() => {
      result.current.handleButtonClick();
    });

    expect(mockRef.click).not.toHaveBeenCalled();
  });

  it('handleButtonClick dispara click si está habilitado', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploader(onFile, '.xml', false));

    const mockRef = { click: vi.fn() };
    result.current.inputRef.current = mockRef as any;

    act(() => {
      result.current.handleButtonClick();
    });

    expect(mockRef.click).toHaveBeenCalled();
  });

  it('allowedTypesLabel retorna el texto correctamente si hay accept', () => {
    const { result } = renderHook(() => useFileUploader(() => {}, '.pdf,.xml', false));
    expect(result.current.allowedTypesLabel).toBe('Archivos permitidos: .pdf,.xml');
  });

  it('allowedTypesLabel es null si no se define accept', () => {
    const { result } = renderHook(() => useFileUploader(() => {}, '', false));
    expect(result.current.allowedTypesLabel).toBe(null);
  });

  it('carga archivo inicial desde base64', async () => {
    const onFile = vi.fn();
    const { result } = renderHook(() =>
      useFileUploader(onFile, '.txt', false, {
        name: 'base64.txt',
        base64: 'data:text/plain;base64,Zmlyc3Q=',
      })
    );

    await waitFor(() => expect(onFile).toHaveBeenCalled());
    expect(result.current.fileName).toBe('base64.txt');
  });

  it('carga archivo inicial desde url', async () => {
    const onFile = vi.fn();
    const { result } = renderHook(() =>
      useFileUploader(onFile, '.txt', false, {
        name: 'url.txt',
        url: 'data:text/plain;base64,dXJs',
      })
    );

    await waitFor(() => expect(onFile).toHaveBeenCalled());
    expect(result.current.fileName).toBe('url.txt');
  });
});
