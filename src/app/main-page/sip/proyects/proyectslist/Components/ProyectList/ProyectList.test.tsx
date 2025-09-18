import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import type { Proyect } from '@/app/mappings/proyects/proyects.types';

import ProyectList from './ProyectList';
import useProyectList from './hooks/useProyectList';

vi.mock('./hooks/useProyectList', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const dataTableSpy = vi.fn();
vi.mock('@/app/components/DataTable/DataTable', () => ({
  DataTable: (props: any) => {
    dataTableSpy(props);
    return (
      <div data-testid="data-table">
        <button type="button" onClick={() => props.onTableActionClick?.()}>
          {props.actionLabel}
        </button>
        <span data-testid="view-mode">{props.useCardsView ? 'cards' : 'table'}</span>
        <span data-testid="rows-count">{props.tables?.[0]?.data?.length ?? 0}</span>
      </div>
    );
  },
}));

const popUpSpy = vi.fn();
vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: (props: any) => {
    popUpSpy(props);
    if (!props.open) return null;
    return (
      <div data-testid="popup">
        <span>{props.title}</span>
        <button type="button" onClick={() => props.onPrimaryButtonClick?.()}>
          {props.primaryButtonText}
        </button>
      </div>
    );
  },
}));

vi.mock('@/app/components/ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: () => <div data-testid="action-menu" />,
}));

vi.mock('@/app/components/Button/Button', () => ({
  Button: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ProyectList', () => {
  const mockUseProyectList = useProyectList as unknown as Mock;
  const sampleProjects: Proyect[] = [
    {
      id: 'P-1',
      name: 'Proyecto Demo',
      client: 'Cliente Demo',
      proyectKey: 'KEY-01',
      manager: {
        employee_id: 'emp-1',
        employee_number: '0001',
        firstname: 'Laura',
        secondname: '',
        lastname: 'Campos',
        motherlast_name: null,
        gender: 'F',
        email: 'laura@example.com',
        phone_number: '555-0001',
        extension: '101',
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
        fullname: 'Laura Campos',
      },
      collaborators: [],
    },
  ];

  const handleNew = vi.fn();
  const handleConfirmDelete = vi.fn();

  beforeEach(() => {
    dataTableSpy.mockClear();
    popUpSpy.mockClear();
    handleNew.mockClear();
    handleConfirmDelete.mockClear();
    mockUseProyectList.mockReset();
    mockUseProyectList.mockReturnValue({
      proyects: sampleProjects,
      openDelete: true,
      setOpenDelete: vi.fn(),
      handleView: vi.fn(),
      handleEdit: vi.fn(),
      handleNew,
      handleAskDelete: vi.fn(),
      handleConfirmDelete,
      toRemove: sampleProjects[0],
      removing: false,
    });
  });

  it('habilita la vista en tarjetas en DataTable', () => {
    render(<ProyectList />);

    expect(dataTableSpy).toHaveBeenCalled();
    const call = dataTableSpy.mock.calls[0][0];
    expect(call.useCardsView).toBe(true);
    expect(call.showViewSwitcher).toBe(true);
    expect(screen.getByTestId('view-mode').textContent).toBe('cards');
    expect(screen.getByTestId('rows-count').textContent).toBe('1');
  });

  it('dispara handleNew cuando se hace click en el boton principal', () => {
    render(<ProyectList />);

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo Proyecto' }));
    expect(handleNew).toHaveBeenCalledTimes(1);
  });

  it('muestra el popup de eliminacion cuando openDelete es true', () => {
    render(<ProyectList />);

    expect(popUpSpy).toHaveBeenCalled();
    expect(screen.getByTestId('popup')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Eliminar'));
    expect(handleConfirmDelete).toHaveBeenCalledTimes(1);
  });
});
