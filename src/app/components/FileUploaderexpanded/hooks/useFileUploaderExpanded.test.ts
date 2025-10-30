// src/app/components/FileUploaderExpanded/hooks/useFileUploaderExpanded.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useFileUploaderExpanded } from './useFileUploaderExpanded';

describe('useFileUploaderExpanded', () => {
  it('inicializa sin arrastre y sin archivo', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploaderExpanded(onFile, '.pdf', false));
    expect(result.current.isDragging).toBe(false);
    expect(result.current.fileName).toBeNull();
    expect(result.current.mainText).toMatch(/Arrastra y suelta/i);
  });

  it('marca arrastre al dragOver y revierte al dragLeave', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploaderExpanded(onFile, '.pdf', false));
    act(() => result.current.handleDragOver({ preventDefault() {} } as any));
    expect(result.current.isDragging).toBe(true);
    act(() => result.current.handleDragLeave());
    expect(result.current.isDragging).toBe(false);
  });

  it('rechaza archivo no permitido en drop llamando onFile(null)', () => {
    const onFile = vi.fn();
    const { result } = renderHook(() => useFileUploaderExpanded(onFile, '.pdf', false));
    const png = new File(['x'], 'a.png', { type: 'image/png' });

    act(() =>
      result.current.handleDrop({
        preventDefault() {},
        dataTransfer: { files: [png] },
      } as any)
    );

    expect(onFile).toHaveBeenCalledWith(null);
  });
});
