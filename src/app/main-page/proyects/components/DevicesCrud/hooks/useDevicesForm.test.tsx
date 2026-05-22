import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDevicesForm } from './useDevicesForm';

const mocked = vi.hoisted(() => ({
  showAlertMock: vi.fn(),
  hideAlertMock: vi.fn(),
  showSpinnerMock: vi.fn(),
  hideSpinnerMock: vi.fn(),
  goListMock: vi.fn(),
  refreshRowsMock: vi.fn(),
}));

let inventoryState: any;
let locationState: any;
let reportDevicesState: any;
let crudState: any;
let proyectsState: any;

function inventoryStoreSelector(selector?: (state: any) => any) {
  return selector ? selector(inventoryState) : inventoryState;
}

function reportDevicesStoreSelector(selector?: (state: any) => any) {
  return selector ? selector(reportDevicesState) : reportDevicesState;
}

function proyectsStoreSelector(selector?: (state: any) => any) {
  return selector ? selector(proyectsState) : proyectsState;
}

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: {
      userName: 'tester',
      fullName: 'Tester',
      email: 'tester@example.com',
    },
  }),
}));

vi.mock('@/app/stores/useProyectInventoryStore/useProyectInventoryStore', () => ({
  __esModule: true,
  useProyectInventoryStore: Object.assign(inventoryStoreSelector, {
    getState: () => inventoryState,
  }),
  default: Object.assign(inventoryStoreSelector, {
    getState: () => inventoryState,
  }),
}));

vi.mock('@/app/stores/useProyectLocationStore/useProyectLocationStore', () => ({
  __esModule: true,
  default: (selector?: (state: any) => any) => (selector ? selector(locationState) : locationState),
}));

vi.mock('@/app/stores/useReportDevicesStore/useReportDevicesStore', () => ({
  __esModule: true,
  useReportDevicesStore: Object.assign(reportDevicesStoreSelector, {
    getState: () => reportDevicesState,
  }),
  default: Object.assign(reportDevicesStoreSelector, {
    getState: () => reportDevicesState,
  }),
}));

vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  __esModule: true,
  useProyectsStore: Object.assign(proyectsStoreSelector, {
    getState: () => proyectsState,
  }),
}));

vi.mock('../../crudShared', () => ({
  useCrudModule: () => crudState,
}));

vi.mock('./useDevicesData', () => ({
  useDevicesData: () => ({
    rows: [],
    isLoading: false,
    refreshRows: mocked.refreshRowsMock,
  }),
}));

describe('useDevicesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    inventoryState = {
      genericEquipments: [
        {
          id: 'equipment-1',
          typeOfEquipment: 'Camara PTZ',
          brand: 'Axis',
          model: 'Q6128',
          isActive: true,
        },
      ],
      currentGenericEquipment: null,
      loading: false,
      loadingCurrent: false,
      loadingSparePartsByGenericEquipment: false,
      creating: false,
      updating: false,
      error: undefined,
      fetchGenericEquipments: vi.fn().mockResolvedValue([]),
      fetchGenericEquipmentById: vi.fn().mockResolvedValue(null),
      createGenericEquipment: vi.fn(),
      updateGenericEquipment: vi.fn(),
      fetchSpareParts: vi.fn().mockResolvedValue([]),
      fetchSparePartsByGenericEquipmentId: vi.fn().mockResolvedValue([]),
      sparePartsByGenericEquipment: [],
      createSparePart: vi.fn(),
      spareParts: [],
      resetFlags: vi.fn(),
    };

    locationState = {
      locations: [
        {
          id: 'location-1',
          name: 'Azotea',
          proyect: [{ id: 'project-1' }],
        },
      ],
      fetchLocations: vi.fn().mockResolvedValue([]),
    };

    proyectsState = {
      proyects: [{ id: 'project-1', proyectKey: 'PRJ-1', name: 'Proyecto 1' }],
      fetchProyects: vi.fn().mockResolvedValue(undefined),
    };

    reportDevicesState = {
      createDevice: vi.fn(),
      updateDevice: vi.fn(),
      creating: false,
      updating: false,
      error: undefined,
    };

    crudState = {
      all: {
        id: 'project-1',
      },
      crudMode: 'create',
      crudItemId: null,
      currentRecord: null,
      hideAlert: mocked.hideAlertMock,
      showAlert: mocked.showAlertMock,
      showSpinner: mocked.showSpinnerMock,
      hideSpinner: mocked.hideSpinnerMock,
      goList: mocked.goListMock,
    };
  });

  it('keeps the existing flow when a generic equipment is selected', async () => {
    reportDevicesState.createDevice.mockResolvedValue({ id: 'device-1' });

    const { result } = renderHook(() => useDevicesForm('project'));

    await act(async () => {
      result.current.onChange('equipmentId', 'equipment-1');
      result.current.onChange('serial', 'SN-01');
      result.current.onChange('location', 'location-1');
      result.current.onChange('status', 'Operativo');
      result.current.onChange('description', 'Instalado en sitio');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(result.current.allowInlineGenericEquipment).toBe(true);
    expect(result.current.isInlineGenericEquipmentMode).toBe(false);
    expect(inventoryState.createGenericEquipment).not.toHaveBeenCalled();
    expect(reportDevicesState.createDevice).toHaveBeenCalledWith({
      brand: 'Axis',
      model: 'Q6128',
      serialnumber: 'SN-01',
      idGenericEquipment: 'equipment-1',
      idLocation: 'location-1',
      idProyect: 'project-1',
    });
    expect(mocked.refreshRowsMock).toHaveBeenCalled();
    expect(mocked.goListMock).toHaveBeenCalled();
  });

  it('enables inline generic equipment also in inventory create complete mode', () => {
    crudState.all = {
      type: 'complete',
    };

    const { result } = renderHook(() => useDevicesForm('inventory'));

    expect(result.current.allowInlineGenericEquipment).toBe(true);
    expect(result.current.isInlineGenericEquipmentMode).toBe(false);
  });

  it('requires explicit project selection outside project scope', async () => {
    crudState.all = {
      type: 'complete',
    };

    const { result } = renderHook(() => useDevicesForm('inventory'));

    expect(result.current.selectedProjectId).toBe('');
    expect(result.current.canSubmit).toBe(false);

    await act(async () => {
      result.current.onChange('projectId', 'project-1');
    });

    expect(result.current.selectedProjectId).toBe('project-1');
    expect(locationState.fetchLocations).toHaveBeenCalledWith('project-1', true);
  });

  it('restores the previous selection when leaving inline mode', async () => {
    const { result } = renderHook(() => useDevicesForm('project'));

    await act(async () => {
      result.current.onChange('equipmentId', 'equipment-1');
    });

    await act(async () => {
      result.current.onToggleProjectEquipmentMode();
    });

    expect(result.current.isInlineGenericEquipmentMode).toBe(true);
    expect(result.current.values.equipmentId).toBe('');
    expect(result.current.values.brand).toBe('');
    expect(result.current.values.model).toBe('');

    await act(async () => {
      result.current.onToggleProjectEquipmentMode();
    });

    expect(result.current.isInlineGenericEquipmentMode).toBe(false);
    expect(result.current.values.equipmentId).toBe('equipment-1');
    expect(result.current.values.brand).toBe('Axis');
    expect(result.current.values.model).toBe('Q6128');
  });

  it('creates the generic equipment inline and then the project device', async () => {
    inventoryState.createGenericEquipment.mockResolvedValue({
      id: 'generic-new',
      typeOfEquipment: 'NVR',
      brand: 'Hikvision',
      model: 'DS-7608',
    });
    reportDevicesState.createDevice.mockResolvedValue({ id: 'device-2' });

    const { result } = renderHook(() => useDevicesForm('project'));

    await act(async () => {
      result.current.onToggleProjectEquipmentMode();
      result.current.onChange('typeOfEquipment', ' NVR ');
      result.current.onChange('brand', ' Hikvision ');
      result.current.onChange('model', ' DS-7608 ');
      result.current.onChange('serial', ' SN-200 ');
      result.current.onChange('location', 'location-1');
      result.current.onChange('status', 'Operativo');
      result.current.onChange('description', 'Rack principal');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(inventoryState.createGenericEquipment).toHaveBeenCalledWith({
      name: 'NVR',
      brand: 'Hikvision',
      model: 'DS-7608',
      idSpareParts: [],
    });
    expect(reportDevicesState.createDevice).toHaveBeenCalledWith({
      brand: 'Hikvision',
      model: 'DS-7608',
      serialnumber: 'SN-200',
      idGenericEquipment: 'generic-new',
      idLocation: 'location-1',
      idProyect: 'project-1',
    });
    expect(mocked.refreshRowsMock).toHaveBeenCalled();
    expect(mocked.goListMock).toHaveBeenCalled();
  });

  it('retries only the device creation if the generic equipment was already created', async () => {
    inventoryState.createGenericEquipment.mockResolvedValue({
      id: 'generic-new',
      typeOfEquipment: 'Switch',
      brand: 'Cisco',
      model: 'CBS350',
    });
    reportDevicesState.createDevice
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'device-3' });
    reportDevicesState.error = 'Fallo al registrar el dispositivo';

    const { result } = renderHook(() => useDevicesForm('project'));

    await act(async () => {
      result.current.onToggleProjectEquipmentMode();
      result.current.onChange('typeOfEquipment', 'Switch');
      result.current.onChange('brand', 'Cisco');
      result.current.onChange('model', 'CBS350');
      result.current.onChange('serial', 'SN-300');
      result.current.onChange('location', 'location-1');
      result.current.onChange('status', 'Operativo');
      result.current.onChange('description', 'Cuarto de comunicaciones');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(inventoryState.createGenericEquipment).toHaveBeenCalledTimes(1);
    expect(reportDevicesState.createDevice).toHaveBeenCalledTimes(1);
    expect(mocked.showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Equipo generico creado con dispositivo pendiente',
      }),
    );

    reportDevicesState.error = undefined;

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(inventoryState.createGenericEquipment).toHaveBeenCalledTimes(1);
    expect(reportDevicesState.createDevice).toHaveBeenCalledTimes(2);
    expect(reportDevicesState.createDevice).toHaveBeenLastCalledWith({
      brand: 'Cisco',
      model: 'CBS350',
      serialnumber: 'SN-300',
      idGenericEquipment: 'generic-new',
      idLocation: 'location-1',
      idProyect: 'project-1',
    });
  });

  it('sends idSpareParts when creating a generic equipment', async () => {
    inventoryState.spareParts = [
      {
        id: 'sp-1',
        sku: 'SKU-1',
        stock: 1,
        name: 'Ref 1',
        brand: 'Brand 1',
        model: 'Model 1',
        serialNumber: '',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
        isActive: true,
      },
      {
        id: 'sp-2',
        sku: 'SKU-2',
        stock: 1,
        name: 'Ref 2',
        brand: 'Brand 2',
        model: 'Model 2',
        serialNumber: '',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
        isActive: true,
      },
    ];
    inventoryState.createGenericEquipment.mockResolvedValue({
      id: 'generic-new',
      typeOfEquipment: 'DVR',
      brand: 'Dahua',
      model: 'XVR1',
    });

    crudState.all = { type: 'generic' };

    const { result } = renderHook(() => useDevicesForm('inventory'));

    await act(async () => {
      result.current.onChange('typeOfEquipment', ' DVR ');
      result.current.onChange('brand', ' Dahua ');
      result.current.onChange('model', ' XVR1 ');
      result.current.onSelectDraftRefactions(['sp-1', 'sp-2']);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(inventoryState.createGenericEquipment).toHaveBeenCalledWith({
      name: 'DVR',
      brand: 'Dahua',
      model: 'XVR1',
      idSpareParts: ['sp-1', 'sp-2'],
    });
  });

  it('sends idSpareParts when updating a generic equipment', async () => {
    inventoryState.currentGenericEquipment = {
      id: 'equipment-1',
      typeOfEquipment: 'Camara PTZ',
      brand: 'Axis',
      model: 'Q6128',
      isActive: true,
    };
    inventoryState.spareParts = [
      {
        id: 'sp-1',
        sku: 'SKU-1',
        stock: 1,
        name: 'Ref 1',
        brand: 'Brand 1',
        model: 'Model 1',
        serialNumber: '',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
        isActive: true,
      },
      {
        id: 'sp-2',
        sku: 'SKU-2',
        stock: 1,
        name: 'Ref 2',
        brand: 'Brand 2',
        model: 'Model 2',
        serialNumber: '',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
        isActive: true,
      },
    ];
    inventoryState.sparePartsByGenericEquipment = [{ id: 'sp-1' }];
    inventoryState.updateGenericEquipment.mockResolvedValue({
      id: 'equipment-1',
      typeOfEquipment: 'Camara PTZ',
      brand: 'Axis',
      model: 'Q6128',
    });

    crudState.all = { type: 'generic' };
    crudState.crudMode = 'edit';
    crudState.crudItemId = 'equipment-1';

    const { result } = renderHook(() => useDevicesForm('inventory'));

    await act(async () => {
      result.current.onSelectDraftRefactions(['sp-1', 'sp-2']);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(inventoryState.updateGenericEquipment).toHaveBeenCalledWith({
      id: 'equipment-1',
      name: 'Camara PTZ',
      brand: 'Axis',
      model: 'Q6128',
      createdBy: 'tester',
      idSpareParts: ['sp-1', 'sp-2'],
    });
  });

  it('hydrates generic refactions after navigating from complete detail once the generic fetch finishes', async () => {
    inventoryState.currentGenericEquipment = null;
    inventoryState.loadingCurrent = true;
    inventoryState.loadingSparePartsByGenericEquipment = true;
    inventoryState.sparePartsByGenericEquipment = [];

    crudState.all = { type: 'generic' };
    crudState.crudMode = 'edit';
    crudState.crudItemId = 'equipment-1';
    crudState.currentRecord = {
      id: 'device-1',
      idGenericEquipment: 'equipment-1',
      primary: 'Camara PTZ',
      secondary: 'Axis',
      tertiary: 'Azotea',
      status: 'Operativo',
      description: 'Serie: SN-01',
      serialOrPart: 'SN-01',
    };

    const { result, rerender } = renderHook(() => useDevicesForm('inventory'));

    expect(result.current.assignedRefactions).toEqual([]);

    inventoryState.currentGenericEquipment = {
      id: 'equipment-1',
      typeOfEquipment: 'Camara PTZ',
      brand: 'Axis',
      model: 'Q6128',
      isActive: true,
    };
    inventoryState.loadingCurrent = false;
    inventoryState.loadingSparePartsByGenericEquipment = false;
    inventoryState.sparePartsByGenericEquipment = [
      {
        id: 'sp-1',
        sku: 'SKU-1',
        stock: 1,
        name: 'Ref 1',
        brand: 'Brand 1',
        model: 'Model 1',
        serialNumber: '',
        characteristic: '',
        provider: '',
        website: '',
        phoneNumber: '',
        isActive: true,
      },
    ];
    inventoryState.spareParts = [...inventoryState.sparePartsByGenericEquipment];

    rerender();

    expect(result.current.values.typeOfEquipment).toBe('Camara PTZ');
    expect(result.current.assignedRefactions).toEqual([
      {
        sparePartId: 'sp-1',
        sku: 'SKU-1',
        name: 'Ref 1',
        brand: 'Brand 1',
        model: 'Model 1',
      },
    ]);
  });

  it('uses the selected project and clears location when project changes', async () => {
    crudState.all = { type: 'complete' };
    locationState.locations = [
      {
        id: 'location-1',
        name: 'Azotea',
        proyect: [{ id: 'project-1' }],
      },
    ];

    const { result } = renderHook(() => useDevicesForm('inventory'));

    await act(async () => {
      result.current.onChange('projectId', 'project-1');
      result.current.onChange('equipmentId', 'equipment-1');
      result.current.onChange('serial', 'SN-01');
      result.current.onChange('location', 'location-1');
      result.current.onChange('status', 'Operativo');
    });

    expect(result.current.values.equipmentId).toBe('equipment-1');
    expect(result.current.values.serial).toBe('SN-01');
    expect(result.current.values.status).toBe('Operativo');
    expect(result.current.values.location).toBe('location-1');

    await act(async () => {
      result.current.onChange('projectId', 'project-2');
    });

    expect(result.current.values.equipmentId).toBe('equipment-1');
    expect(result.current.values.serial).toBe('SN-01');
    expect(result.current.values.status).toBe('Operativo');
    expect(result.current.values.location).toBe('');
  });
});
