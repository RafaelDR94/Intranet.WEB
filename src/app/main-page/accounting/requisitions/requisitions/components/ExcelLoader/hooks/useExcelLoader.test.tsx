import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useExcelLoader } from './useExcelLoader';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore';
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({ usePrincipal: vi.fn() }));
vi.mock('@/app/stores/useRequisitionStore/useRequisitionStore', () => ({ useRequisitionsStore: vi.fn() }));
vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({ useIntranetGatewayStore: vi.fn() }));

describe('useExcelLoader', () => {
  const showSpinner = vi.fn();
  const hideSpinner = vi.fn();
  const showAlert = vi.fn();
  const hideAlert = vi.fn();
  const updateExcelRequisition = vi.fn(() => Promise.resolve({}));
  const resetFlags = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePrincipal as unknown as any).mockReturnValue({
      usePrincipalLoading: { showSpinner, hideSpinner },
      usePrincipalAlert: { showAlert, hideAlert },
    });
    (useRequisitionsStore as unknown as any).mockImplementation((selector: any) =>
      selector({
        updateExcelRequisition,
        resetFlags,
        updatingExcel: false,
        successUpdateExcel: false,
        error: undefined,
        warning: undefined,
      })
    );
    (useIntranetGatewayStore as unknown as any).mockImplementation((selector: any) =>
      selector({ isReady: true })
    );
  });

  it('handles file selection and enables button', () => {
    const { result } = renderHook(() => useExcelLoader());
    const file = new File(['data'], 'test.xlsx');
    act(() => result.current.handleFile(file));
    expect(result.current.file).toBe(file);
    expect(result.current.buttonDisabled).toBe(false);
  });

  it('calls updateExcelRequisition on submit', async () => {
    const { result } = renderHook(() => useExcelLoader());
    const file = new File(['data'], 'test.xlsx');
    act(() => result.current.handleFile(file));
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(updateExcelRequisition).toHaveBeenCalledWith(file);
  });

  it('disables button when gateway is not ready', () => {
    (useIntranetGatewayStore as unknown as any).mockImplementation((selector: any) =>
      selector({ isReady: false })
    );
    const { result } = renderHook(() => useExcelLoader());
    const file = new File(['data'], 'test.xlsx');
    act(() => result.current.handleFile(file));
    expect(result.current.buttonDisabled).toBe(true);
  });
});
