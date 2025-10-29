import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import useSignaturePad from './useSignaturePad';

const observers: MockResizeObserver[] = [];

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
    observers.push(this);
  }
  observe() {}
  disconnect() {}
  trigger(size: { width: number; height: number }) {
    this.callback([{ contentRect: size }] as any, this as any);
  }
}

beforeAll(() => {
  // @ts-expect-error override global
  global.ResizeObserver = MockResizeObserver;
});

describe('useSignaturePad', () => {
  beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('updates size when ResizeObserver emits entries', () => {
    const { result } = renderHook(() => {
      const hook = useSignaturePad({
        width: 400,
        height: 200,
        onSignatureSave: vi.fn(),
      } as any);
      hook.wrapperRef.current = document.createElement('div');
      return hook;
    });

    expect(result.current.size).toEqual({ width: 400, height: 200 });

    act(() => {
      observers[0]?.trigger({ width: 250, height: 120 });
    });

    expect(result.current.size).toEqual({ width: 250, height: 120 });
  });

  it('clears and saves signatures correctly', () => {
    const handleSave = vi.fn();
    const { result } = renderHook(() => {
      const hook = useSignaturePad({
        width: 400,
        height: 200,
        onSignatureSave: handleSave,
      } as any);
      hook.wrapperRef.current = document.createElement('div');
      return hook;
    });

    const canvasMock = {
      clear: vi.fn(),
      isEmpty: vi.fn(() => false),
      toDataURL: vi.fn(() => 'data:image/png;base64'),
    };
    result.current.sigCanvasRef.current = canvasMock as any;

    act(() => {
      result.current.handleClear();
    });
    expect(canvasMock.clear).toHaveBeenCalled();

    act(() => {
      result.current.handleSave();
    });
    expect(handleSave).toHaveBeenCalledWith('data:image/png;base64');
  });

  it('warns when attempting to save an empty canvas', () => {
    const alertSpy = vi.spyOn(window, 'alert');
    const handleSave = vi.fn();
    const { result } = renderHook(() => {
      const hook = useSignaturePad({
        width: 400,
        height: 200,
        onSignatureSave: handleSave,
      } as any);
      hook.wrapperRef.current = document.createElement('div');
      return hook;
    });

    result.current.sigCanvasRef.current = {
      clear: vi.fn(),
      isEmpty: vi.fn(() => true),
      toDataURL: vi.fn(),
    } as any;

    act(() => {
      result.current.handleSave();
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(handleSave).not.toHaveBeenCalled();
  });
});
