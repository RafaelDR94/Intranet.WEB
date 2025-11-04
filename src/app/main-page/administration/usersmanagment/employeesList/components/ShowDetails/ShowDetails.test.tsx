import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import ShowDetails from './ShowDetails';
import { useShowDetails } from './hooks/useShowDetails';

vi.mock('./hooks/useShowDetails', () => ({
  __esModule: true,
  useShowDetails: vi.fn(),
}));

vi.mock('@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false),
}));

const avatarSpy = vi.fn();
vi.mock('@/app/components/Avatar/Avatar', () => ({
  __esModule: true,
  default: (props: any) => {
    avatarSpy(props);
    return <div data-testid="avatar" />;
  },
}));

const labelSpy = vi.fn();
vi.mock('@/app/components/Label/Label', () => ({
  __esModule: true,
  default: (props: any) => {
    labelSpy(props);
    return <span data-testid="status-label">{props.text}</span>;
  },
}));

const buttonSpy = vi.fn();
vi.mock('@/app/components/Button/Button', () => ({
  __esModule: true,
  Button: (props: any) => {
    buttonSpy(props);
    return (
      <button type="button" onClick={props.onClick}>
        {props.children}
      </button>
    );
  },
}));

const popUpSpy = vi.fn();
vi.mock('@/app/components/PopUp/PopUp', () => ({
  __esModule: true,
  PopUp: (props: any) => {
    popUpSpy(props);
    return props.open ? (
      <div data-testid="toggle-popup">
        <span>{props.title}</span>
        <button type="button" onClick={() => props.onPrimaryButtonClick?.()}>
          {props.primaryButtonText}
        </button>
      </div>
    ) : null;
  },
}));

vi.mock('@/assets/icons/Comunicacion/mail.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="mail-icon" />,
}));
vi.mock('@/assets/icons/Comunicacion/phone.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="phone-icon" />,
}));
vi.mock('@/assets/icons/Users/Users/profile-circle.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="profile-icon" />,
}));

describe('ShowDetails', () => {
  const mockHook = useShowDetails as unknown as Mock;

  beforeEach(() => {
    mockHook.mockReset();
    avatarSpy.mockClear();
    labelSpy.mockClear();
    buttonSpy.mockClear();
    popUpSpy.mockClear();
  });

  it('muestra placeholder cuando no hay empleado', () => {
    mockHook.mockReturnValue({
      hasEmployee: false,
    });

    render(<ShowDetails />);

    expect(screen.getByText(/Select an employee/i)).toBeInTheDocument();
    expect(avatarSpy).not.toHaveBeenCalled();
  });

  it('renderiza detalles y controla el popup de confirmación', () => {
    const openConfirmToggle = vi.fn();
    const closeConfirmToggle = vi.fn();
    const handleConfirmToggle = vi.fn();

    mockHook.mockReturnValue({
      hasEmployee: true,
      employee: { image_url: '', user: { user_id: 'user-1' } },
      initials: 'DU',
      primaryNameLine: 'Demo User',
      secondaryNameLine: 'Gonzalez',
      companyName: 'Empresa',
      position: 'Analista',
      employeeNumber: '001',
      phoneNumber: '555-1234',
      email: 'demo@example.com',
      departmentName: 'TI',
      confirmToggleOpen: true,
      currentStatus: true,
      statusType: 'valido',
      statusText: 'Activo',
      actionLabel: 'Desactivar usuario',
      displayName: 'Demo User Gonzalez',
      userId: 'user-1',
      openConfirmToggle,
      closeConfirmToggle,
      handleConfirmToggle,
    });

    render(<ShowDetails />);

    expect(screen.getByText('Demo User')).toBeInTheDocument();
    expect(labelSpy).toHaveBeenCalledWith(expect.objectContaining({ text: 'Activo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar usuario' }));
    expect(openConfirmToggle).toHaveBeenCalledTimes(1);

    expect(popUpSpy).toHaveBeenCalled();
    expect(screen.getByTestId('toggle-popup')).toHaveTextContent('Deseas desactivar');

    fireEvent.click(screen.getByText('Desactivar'));
    expect(handleConfirmToggle).toHaveBeenCalledTimes(1);
  });
});
