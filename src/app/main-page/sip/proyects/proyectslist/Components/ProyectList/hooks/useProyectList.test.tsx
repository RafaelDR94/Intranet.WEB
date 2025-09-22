import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Proyect } from '@/app/mappings/proyects/proyects.types';

import useProyectList from './useProyectList';

const fetchProyectsMock = vi.fn();
const deleteProyectMock = vi.fn();
const setCurrentProyectMock = vi.fn();
const resetFlagsMock = vi.fn();

const routerPushMock = vi.fn();

const showAlertMock = vi.fn();
const hideAlertMock = vi.fn();
const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();

const sampleProjects: Proyect[] = [
  {
    id: 'PR-1',
    name: 'Proyecto Norte',
    proyectKey: 'NORTE-01',
    client: 'Cliente Norte',
    manager: {
      employee_id: 'emp-1',
      employee_number: '001',
      firstname: 'Carlos',
      secondname: '',
      lastname: 'Ramirez',
      motherlast_name: null,
      gender: 'M',
      email: 'carlos@example.com',
      phone_number: '555-1111',
      extension: '200',
      image_url: '',
      manager_id: 'mgr-1',
      department: {
        department_id: 'dep-1',
        name: 'Operaciones',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR Security',
      },
      workposition: {
        workposition_id: 'wp-1',
        name: 'Supervisor',
      },
      user: null,
      is_active: true,
      fullname: 'Carlos Ramirez',
    },
    collaborators: [],
  },
];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }), usePathname: () => '/main-page/sip/proyects',
}));

vi.mock('@/app/context/PrincipalContext/PrincipalContext', () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert: showAlertMock, hideAlert: hideAlertMock },
    usePrincipalLoading: { showSpinner: showSpinnerMock, hideSpinner: hideSpinnerMock },
  }),
}));

vi.mock('@/app/stores/useProyectsStore/useProyectsStore', () => ({
  useProyectsStore: (selector: any) =>
    selector({
      proyects: sampleProjects,
      loading: false,
      removing: false,
      successDelete: false,
      error: undefined,
      fetchProyects: fetchProyectsMock,
      setCurrentProyect: setCurrentProyectMock,
      deleteProyect: deleteProyectMock,
      resetFlags: resetFlagsMock,
    }),
}));

describe('useProyectList', () => {
  beforeEach(() => {
    fetchProyectsMock.mockClear();
    deleteProyectMock.mockReset();
    setCurrentProyectMock.mockClear();
    resetFlagsMock.mockClear();
    routerPushMock.mockClear();
    showAlertMock.mockClear();
    hideAlertMock.mockClear();
    showSpinnerMock.mockClear();
    hideSpinnerMock.mockClear();
    deleteProyectMock.mockResolvedValue(undefined);
  });

  it('consulta los proyectos al montar el hook', async () => {
    renderHook(() => useProyectList());

    await waitFor(() => {
      expect(fetchProyectsMock).toHaveBeenCalledTimes(1);
    });
    expect(hideSpinnerMock).toHaveBeenCalled();
    expect(resetFlagsMock).toHaveBeenCalled();
  });

  it('navega a la pantalla de nuevo proyecto', () => {
    const { result } = renderHook(() => useProyectList());

    act(() => {
      result.current.handleNew();
    });

    expect(routerPushMock).toHaveBeenCalledWith('/main-page/sip/proyects/newproyect');
  });

  it('navega a la pantalla de detalle al editar', () => {
    const { result } = renderHook(() => useProyectList());

    act(() => {
      result.current.handleEdit(sampleProjects[0]);
    });

    expect(setCurrentProyectMock).toHaveBeenCalledWith(sampleProjects[0]);
    expect(routerPushMock).toHaveBeenCalled();
    expect(routerPushMock.mock.calls.at(-1)?.[0]).toContain('/main-page/sip/proyects/newproyect');
    expect(routerPushMock.mock.calls.at(-1)?.[0]).toContain(sampleProjects[0].id);
  });

  it('navega a la vista de tarjetas al ver el proyecto', () => {
    const { result } = renderHook(() => useProyectList());

    act(() => {
      result.current.handleView(sampleProjects[0]);
    });

    expect(setCurrentProyectMock).toHaveBeenCalledWith(sampleProjects[0]);
    expect(routerPushMock).toHaveBeenCalled();
    expect(routerPushMock.mock.calls.at(-1)?.[0]).toContain('/main-page/sip/proyects/proyectslist');
    expect(routerPushMock.mock.calls.at(-1)?.[0]).toContain(sampleProjects[0].id);
  });

  it('abre el popup y confirma eliminacion', async () => {
    const { result } = renderHook(() => useProyectList());

    act(() => {
      result.current.handleAskDelete(sampleProjects[0]);
    });

    expect(result.current.openDelete).toBe(true);
    expect(result.current.toRemove).toEqual(sampleProjects[0]);

    await act(async () => {
      await result.current.handleConfirmDelete();
    });

    expect(deleteProyectMock).toHaveBeenCalledWith(sampleProjects[0].id);
  });
});
