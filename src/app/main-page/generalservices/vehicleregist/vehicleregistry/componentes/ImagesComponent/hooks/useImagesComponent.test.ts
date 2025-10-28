import { act, renderHook } from '@testing-library/react';
import { describe, it, beforeEach, beforeAll, afterAll, vi, expect } from 'vitest';

import type { VehicleImageSlot } from '@/app/stores/useVehicleRegistryImagesStore/types';

import useImagesComponent from './useImagesComponent';

const {
  slotsState,
  vehicleImagesStoreState,
  setSlotImage,
  resetSlot,
  setSignature,
  resetSignature,
  useVehicleRegistryImagesStoreMock,
  formFieldsState,
  useFormFieldsStoreMock,
  transportStoreState,
  useTransportStoreMock,
  showAlert,
  showSpinner,
  hideSpinner,
  makeResponsive,
  createPdf,
} = vi.hoisted(() => {
  const baseSlots: VehicleImageSlot[] = [
    {
      id: 'front',
      title: 'Frontal',
      uploadLabel: 'Frontal',
      imageSrc: '',
      file: null,
    },
    {
      id: 'license',
      title: 'Licencia de conducir',
      uploadLabel: 'Licencia',
      imageSrc: '',
      file: null,
    },
  ];

  const slots = baseSlots;

  const setSlotImageFn = vi.fn((slotId: string, payload: { file: File | null; imageSrc: string }) => {
    const slot = slots.find((item) => item.id === slotId);
    if (slot) {
      slot.imageSrc = payload.imageSrc;
      slot.file = payload.file;
    }
  });
  const resetSlotFn = vi.fn((slotId: string) => {
    const slot = slots.find((item) => item.id === slotId);
    if (slot) {
      slot.imageSrc = '';
      slot.file = null;
    }
  });
  const setSignatureFn = vi.fn();
  const resetSignatureFn = vi.fn();

  const vehicleImagesStoreStateValue = {
    slots,
    setSlotImage: setSlotImageFn,
    resetSlot: resetSlotFn,
    signature: '',
    setSignature: setSignatureFn,
    resetSignature: resetSignatureFn,
    signatureResponsibleId: '',
  };
  const useVehicleRegistryImagesStoreMockFn = Object.assign(
    (selector: any) => selector(vehicleImagesStoreStateValue),
    { getState: () => vehicleImagesStoreStateValue }
  );

  const formFieldsStateValue = {
    fieldsByFormId: {
      'departure-form': [
        {
          name: 'driver',
          value: 'driver-1',
          options: [
            { label: 'Alice', value: 'driver-1' },
            { label: 'Bob', value: 'driver-2' },
          ],
        },
        {
          name: 'vehicle',
          value: 'vehicle-1',
          options: [{ label: 'Van', value: 'vehicle-1' }],
        },
      ],
    },
  };
  const useFormFieldsStoreMockFn = vi.fn((selector: any) => selector(formFieldsStateValue));

  const transportStoreStateValue = {
    currentAssignment: null as any,
  };
  const useTransportStoreMockFn = vi.fn((selector: any) => selector(transportStoreStateValue));

  const showAlertFn = vi.fn();
  const showSpinnerFn = vi.fn();
  const hideSpinnerFn = vi.fn();

  const makeResponsiveFn = vi.fn();
  const createPdfFn = vi.fn();

  return {
    slotsState: slots,
    vehicleImagesStoreState: vehicleImagesStoreStateValue,
    setSlotImage: setSlotImageFn,
    resetSlot: resetSlotFn,
    setSignature: setSignatureFn,
    resetSignature: resetSignatureFn,
    useVehicleRegistryImagesStoreMock: useVehicleRegistryImagesStoreMockFn,
    formFieldsState: formFieldsStateValue,
    useFormFieldsStoreMock: useFormFieldsStoreMockFn,
    transportStoreState: transportStoreStateValue,
    useTransportStoreMock: useTransportStoreMockFn,
    showAlert: showAlertFn,
    showSpinner: showSpinnerFn,
    hideSpinner: hideSpinnerFn,
    makeResponsive: makeResponsiveFn,
    createPdf: createPdfFn,
  };
});

vi.mock('@/app/stores/useVehicleRegistryImagesStore/useVehicleRegistryImagesStore', () => ({
  useVehicleRegistryImagesStore: useVehicleRegistryImagesStoreMock,
}));

vi.mock('@/app/stores/useFormFieldsStore/useFormFieldsStore', () => ({
  useFormFieldsStore: useFormFieldsStoreMock,
}));

vi.mock('@/app/stores/useTransportStore/useTransportStore', () => ({
  useTransportStore: useTransportStoreMock,
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock('../../../../hooks/useVehicleDocuments', () => ({
  __esModule: true,
  default: () => ({
    makeResponsive,
  }),
}));

vi.mock('@/app/utilities/PDF/PDF', () => ({
  CreatePDF: createPdf,
}));

let originalFileReader: typeof FileReader;
let originalCreateObjectURL: (obj: any) => string;
let originalRevokeObjectURL: (obj: string) => void;
let originalCreateElement: typeof document.createElement;

class MockFileReader {
  public result: string | ArrayBuffer | null = null;
  public onload: null | ((this: FileReader, ev: ProgressEvent<FileReader>) => void) = null;
  public onerror: null | ((this: FileReader, ev: ProgressEvent<FileReader>) => void) = null;

  readAsDataURL(): void {
    this.result = 'data:image/png;base64,MOCK';
    this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
  }
}

describe('useImagesComponent', () => {
  beforeAll(() => {
    originalFileReader = global.FileReader;
    // @ts-expect-error override for tests
    global.FileReader = MockFileReader as unknown as typeof FileReader;
    originalCreateObjectURL = global.URL.createObjectURL;
    originalRevokeObjectURL = global.URL.revokeObjectURL;
    global.URL.createObjectURL = vi.fn(() => 'blob:object-url');
    global.URL.revokeObjectURL = vi.fn();
    originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn(((tag: string) => {
      const element = originalCreateElement(tag);
      if (tag === 'a') {
        Object.defineProperty(element, 'click', {
          configurable: true,
          value: vi.fn(),
        });
      }
      return element;
    }) as typeof document.createElement);
  });

  afterAll(() => {
    // @ts-expect-error restore
    global.FileReader = originalFileReader;
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
  });

  beforeEach(() => {
    setSlotImage.mockClear();
    resetSlot.mockClear();
    setSignature.mockClear();
    resetSignature.mockClear();
    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    makeResponsive.mockReset();
    createPdf.mockReset();
    transportStoreState.currentAssignment = null;
    vehicleImagesStoreState.signature = '';
    vehicleImagesStoreState.signatureResponsibleId = '';
    formFieldsState.fieldsByFormId['departure-form'][0].value = 'driver-1';
    formFieldsState.fieldsByFormId['departure-form'][1].value = 'vehicle-1';
  });

  it('stores signature when authorization is accepted and closes modal', () => {
    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));

    act(() => {
      result.current.openSignature();
    });
    expect(result.current.isSignatureOpen).toBe(true);

    act(() => {
      result.current.handleSignatureAuthorization({ state: true, signature: 'signed', external: undefined });
    });

    expect(setSignature).toHaveBeenCalledWith('signed', 'driver-1');
    expect(result.current.isSignatureOpen).toBe(false);
  });

  it('resets slot when no file is provided', async () => {
    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));

    await act(async () => {
      await result.current.handleImageSelect('front')(null);
    });

    expect(resetSlot).toHaveBeenCalledWith('front');
  });

  it('reads file and stores image data when provided', async () => {
    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));
    const file = new File(['mock'], 'photo.png', { type: 'image/png' });

    await act(async () => {
      await result.current.handleImageSelect('front')(file);
    });

    expect(setSlotImage).toHaveBeenCalledWith('front', {
      file,
      imageSrc: 'data:image/png;base64,MOCK',
    });
  });

  it('filters license slot when assignment is active', () => {
    transportStoreState.currentAssignment = { vehicleassignments_id: '1' };
    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));
    expect(result.current.slots.some((slot) => slot.id === 'license')).toBe(false);
  });

  it('shows warning alert when driver or vehicle is missing before generating responsive document', async () => {
    formFieldsState.fieldsByFormId['departure-form'][0].value = '';
    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));

    await act(async () => {
      await result.current.handleResponsiveDownload();
    });

    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning' })
    );
    expect(makeResponsive).not.toHaveBeenCalled();
  });

  it('generates responsive document when data is complete', async () => {
    makeResponsive.mockResolvedValueOnce({} as any);
    createPdf.mockImplementation(async (_data: unknown, resolve: (url: string) => void) => {
      resolve('blob:pdf');
    });

    const { result } = renderHook(() => useImagesComponent({ formId: 'departure-form' }));

    await act(async () => {
      await result.current.handleResponsiveDownload();
    });

    expect(showSpinner).toHaveBeenCalled();
    expect(makeResponsive).toHaveBeenCalledWith('driver-1', 'vehicle-1');
    expect(createPdf).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info' })
    );
    expect(hideSpinner).toHaveBeenCalled();
  });
});
