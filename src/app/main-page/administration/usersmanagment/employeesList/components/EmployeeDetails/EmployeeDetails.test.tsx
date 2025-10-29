import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EmployeeDetails from './EmployeeDetails';

let employeesStoreState: any;

vi.mock('@/app/stores/useEmployeesStore/useEmployeesStore', () => ({
  useEmployeesStore: (selector: any) => selector(employeesStoreState),
}));

const layoutSpy = vi.fn();
vi.mock('@/app/components/DetailsPanelLayout/DetailsPanelLayout', () => ({
  __esModule: true,
  default: (props: any) => {
    layoutSpy(props);
    return <div data-testid="details-panel">{props.children}</div>;
  },
}));

const navSpy = vi.fn();

vi.mock('@/app/components/ButtonsNavigation/ButtonsNavigation', () => {
  const ButtonsNavigationMock: any = ({ children, ...props }: any) => {
    navSpy(props);
    return <div data-testid="buttons-navigation">{children}</div>;
  };
  ButtonsNavigationMock.Item = ({ label, renderContent }: any) => (
    <div data-testid="buttons-navigation-item">
      <span>{label}</span>
      <div>{renderContent}</div>
    </div>
  );
  return {
    __esModule: true,
    default: ButtonsNavigationMock,
  };
});

vi.mock('../ShowDetails/ShowDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="show-details" />,
}));

vi.mock('../CreateUser/CreateUser', () => ({
  __esModule: true,
  default: () => <div data-testid="create-user" />,
}));

vi.mock('../UpdateUser/UpdateUser', () => ({
  __esModule: true,
  default: () => <div data-testid="update-user" />,
}));

describe('EmployeeDetails', () => {
  beforeEach(() => {
    layoutSpy.mockClear();
    navSpy.mockClear();
    employeesStoreState = { employee: null };
  });

  it('muestra CreateUser cuando el empleado no tiene usuario', () => {
    employeesStoreState.employee = { user: null };

    render(<EmployeeDetails open onClose={vi.fn()} />);

    expect(layoutSpy).toHaveBeenCalledWith(expect.objectContaining({ open: true }));
    expect(screen.getByTestId('create-user')).toBeInTheDocument();
    expect(screen.queryByTestId('update-user')).not.toBeInTheDocument();
    expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
  });

  it('muestra UpdateUser cuando el empleado ya tiene usuario', () => {
    employeesStoreState.employee = { user: { user_id: 'user-1' } };

    render(<EmployeeDetails open={false} onClose={vi.fn()} />);

    expect(layoutSpy).toHaveBeenCalledWith(expect.objectContaining({ open: false }));
    expect(screen.getByTestId('update-user')).toBeInTheDocument();
    expect(screen.queryByTestId('create-user')).not.toBeInTheDocument();
    expect(screen.getByText('Actualizar Usuario')).toBeInTheDocument();
  });
});
