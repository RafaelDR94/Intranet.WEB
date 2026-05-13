import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocationsForm } from './useLocationsForm';

let locationStoreState: any;
let proyectsStoreState: any;
let locationsDataState: any;
let crudState: any;

function locationStoreSelector(selector?: (state: any) => any) {
  return selector ? selector(locationStoreState) : locationStoreState;
}

function proyectsStoreSelector(selector?: (state: any) => any) {
  return selector ? selector(proyectsStoreState) : proyectsStoreState;
}

vi.mock('@/app/stores/useProyectLocationStore/useProyectLocationStore', () => ({
  __esModule: true,
  default: Object.assign(locationStoreSelector, {
    getState: () => locationStoreState,
  }),
}));

vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  __esModule: true,
  useProyectsStore: Object.assign(proyectsStoreSelector, {
    getState: () => proyectsStoreState,
  }),
}));

vi.mock('./useLocationsData', () => ({
  useLocationsData: () => locationsDataState,
}));

vi.mock('../../crudShared', () => ({
  useCrudModule: () => crudState,
}));

describe('useLocationsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    locationStoreState = {
      locations: [
        {
          id: 'location-1',
          name: 'Ubicacion vinculada',
          address: 'Direccion vinculada',
          linkmaps: 'https://maps.example/vinculada',
          proyect: [{ id: 'project-1' }],
        },
      ],
      error: undefined,
      fetchLocations: vi.fn().mockResolvedValue([
        {
          id: 'location-1',
          name: 'Ubicacion vinculada',
          address: 'Direccion vinculada',
          linkmaps: 'https://maps.example/vinculada',
          proyect: [{ id: 'project-1' }],
        },
      ]),
      fetchAllLocations: vi.fn().mockResolvedValue([
        {
          id: 'location-1',
          name: 'Ubicacion vinculada',
          address: 'Direccion vinculada',
          linkmaps: 'https://maps.example/vinculada',
          proyect: [],
        },
        {
          id: 'location-2',
          name: 'Ubicacion disponible',
          address: 'Direccion disponible',
          linkmaps: 'https://maps.example/disponible',
          proyect: [],
        },
      ]),
    };

    proyectsStoreState = {
      proyects: [{ id: 'project-1', proyectKey: 'PRJ-1', name: 'Proyecto 1' }],
      fetchProyects: vi.fn().mockResolvedValue(undefined),
      linkLocationsToProyect: vi.fn().mockResolvedValue(true),
      linkingLocations: false,
      error: undefined,
    };

    locationsDataState = {
      rows: [],
      loading: false,
      refreshRows: vi.fn().mockResolvedValue(undefined),
      createLocation: vi.fn(),
      updateLocation: vi.fn(),
      deleteLocation: vi.fn(),
      resetFlags: vi.fn(),
    };

    crudState = {
      all: { id: 'project-1' },
      pathname: '/main-page/proyects/proyects/locations',
      crudMode: 'create',
      crudItemId: null,
      currentRecord: null,
      hideAlert: vi.fn(),
      showAlert: vi.fn(),
      showSpinner: vi.fn(),
      hideSpinner: vi.fn(),
      goList: vi.fn(),
    };
  });

  it('activa el modo link-existing solo en la ruta de proyectos al crear', async () => {
    const { result } = renderHook(() => useLocationsForm('project'));

    await waitFor(() => {
      expect(result.current.mode).toBe('link-existing');
    });

    expect(locationStoreState.fetchAllLocations).toHaveBeenCalledWith(true);
    expect(locationStoreState.fetchLocations).toHaveBeenCalledWith('project-1', true);
  });

  it('mantiene el formulario actual en inventory', () => {
    crudState.pathname = '/main-page/proyects/inventory/locations';

    const { result } = renderHook(() => useLocationsForm('inventory'));

    expect(result.current.mode).toBe('default');
  });

  it('mantiene el formulario actual en edicion', () => {
    crudState.crudMode = 'edit';

    const { result } = renderHook(() => useLocationsForm('project'));

    expect(result.current.mode).toBe('default');
  });

  it('guarda el vinculo con las ubicaciones seleccionadas y vuelve a la lista', async () => {
    const { result } = renderHook(() => useLocationsForm('project'));

    await waitFor(() => {
      expect(result.current.mode).toBe('link-existing');
    });

    await act(async () => {
      if (result.current.mode !== 'link-existing') return;
      result.current.onSelectionChange(['location-2']);
    });

    await act(async () => {
      if (result.current.mode !== 'link-existing') return;
      await result.current.onSubmit();
    });

    expect(proyectsStoreState.linkLocationsToProyect).toHaveBeenCalledWith({
      proyect_id: 'project-1',
      location_ids: ['location-2'],
    });
    expect(locationStoreState.fetchLocations).toHaveBeenLastCalledWith('project-1', true);
    expect(crudState.goList).toHaveBeenCalled();
  });
});
