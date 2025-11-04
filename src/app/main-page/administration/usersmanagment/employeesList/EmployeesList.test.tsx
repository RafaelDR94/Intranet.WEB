import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import EmployeesList from './page';
import useEmployeesList from './hooks/useEmployeesList';

vi.mock('./hooks/useEmployeesList', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const dataTableSpy = vi.fn();
vi.mock('@/app/components/DataTable/DataTable', () => ({
  __esModule: true,
  DataTable: (props: any) => {
    dataTableSpy(props);
    return (
      <div data-testid="data-table">
        <button type="button" onClick={() => props.onTableActionClick?.()}>
          {props.actionLabel}
        </button>
      </div>
    );
  },
}));

const popUpSpy = vi.fn();
vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: (props: any) => {
    popUpSpy(props);
    if (!props.open) return null;
    return (
      <div data-testid="delete-popup">
        <span>{props.title}</span>
        <button type="button" onClick={() => props.onPrimaryButtonClick?.()}>
          confirmar
        </button>
      </div>
    );
  },
}));

vi.mock('@/app/components/Avatar/Avatar', () => ({
  __esModule: true,
  default: (props: any) => <span data-testid="avatar" data-src={props.src} />,
}));

const employeeDetailsSpy = vi.fn();
vi.mock('./components/EmployeeDetails/EmployeeDetails', () => ({
  __esModule: true,
  default: (props: any) => {
    employeeDetailsSpy(props);
    return <div data-testid="employee-details">{props.open ? 'open' : 'closed'}</div>;
  },
}));

vi.mock('@/app/components/ActionMenuCell/ActionMenuCell', () => ({
  __esModule: true,
  default: () => <div data-testid="action-menu" />,
}));

vi.mock('@/app/components/Button/Button', () => ({
  __esModule: true,
  Button: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false),
}));

describe('EmployeesList page', () => {
  const mockHook = useEmployeesList as unknown as Mock;
  const handleOpenNew = vi.fn();
  const handleDeleteEmployee = vi.fn();

  beforeEach(() => {
    dataTableSpy.mockClear();
    popUpSpy.mockClear();
    employeeDetailsSpy.mockClear();
    handleOpenNew.mockClear();
    handleDeleteEmployee.mockClear();
    mockHook.mockReset();

    mockHook.mockReturnValue({
      employeesList: [
        {
          employee_id: 'emp-1',
          fullname: 'Demo User',
          workposition: { name: 'Analista' },
          phone_number: '555-1234',
          email: 'demo@example.com',
          employee_number: '001',
          image_url: '',
        },
      ],
      currentEmployee: {
        employee_id: 'emp-1',
        fullname: 'Demo User',
      },
      openDeletePopUp: true,
      openDetails: true,
      currentPagePermissions: { create: true, update: true, delete: true, showdetails: true },
      handleOpenDeletePopUp: vi.fn(),
      handleCloseDeletePopUp: vi.fn(),
      handleOpenDetails: vi.fn(),
      handleCloseDetails: vi.fn(),
      handleDeleteEmployee,
      handleEditEmployee: vi.fn(),
      handleOpenNew,
    });
  });

  it('renderiza la tabla con el listado', () => {
    render(<EmployeesList />);
    expect(dataTableSpy).toHaveBeenCalledTimes(1);
    const tables = dataTableSpy.mock.calls[0][0].tables;
    expect(Array.isArray(tables)).toBe(true);
    expect(tables[0].data).toHaveLength(1);
  });

  it('ejecuta handleOpenNew cuando se presiona el botón principal de la tabla', () => {
    render(<EmployeesList />);
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo Empleado' }));
    expect(handleOpenNew).toHaveBeenCalledTimes(1);
  });

  it('muestra el popup de confirmación cuando openDeletePopUp es true', () => {
    render(<EmployeesList />);
    expect(popUpSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('delete-popup')).toBeInTheDocument();

    fireEvent.click(screen.getByText('confirmar'));
    expect(handleDeleteEmployee).toHaveBeenCalledTimes(1);
  });

  it('sincroniza la prop open en EmployeeDetails', () => {
    render(<EmployeesList />);
    expect(employeeDetailsSpy).toHaveBeenCalled();
    expect(employeeDetailsSpy.mock.calls[0][0].open).toBe(true);
  });
});
