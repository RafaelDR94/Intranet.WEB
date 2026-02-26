import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import Notification from './Notification';

vi.mock('@/app/components/Avatar/Avatar', () => ({
  __esModule: true,
  default: () => <div data-testid="avatar" />,
}));

vi.mock('@/app/components/Button/Button', () => ({
  __esModule: true,
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }) => (
    <button type="button" {...props}>{children}</button>
  ),
}));

vi.mock('@/assets/icons/acciones/cancel.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="close-icon" />,
}));

describe('Notification', () => {
  it('renders title and description', () => {
    render(
      <Notification
        title="Solicitud de Vale Rosa"
        description="Notificacion de evento recibida"
        createdAt="2026-02-09T10:30:00.000Z"
      />
    );

    expect(screen.getByText('Solicitud de Vale Rosa')).toBeInTheDocument();
    expect(screen.getByText('Notificacion de evento recibida')).toBeInTheDocument();
    expect(screen.getByText('Ir a evento')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <Notification
        title="Solicitud de Vale Rosa"
        description="Notificacion de evento recibida"
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByLabelText('Cerrar notificacion'));
    expect(onClose).toHaveBeenCalled();
  });
});
