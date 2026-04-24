import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect } from 'vitest';

import NotificationsPage from './page';

Object.assign(globalThis, { React });

describe('NotificationsPage', () => {
  it('renders the notification preferences from figma', () => {
    render(<NotificationsPage />);

    expect(
      screen.getByRole('heading', {
        name: /activación de notificaciones dentro de la intranet/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/solicitudes, respuestas y proyectos \(push\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/recibe un correo electrónico cuando te respondan a una solicitud/i),
    ).toBeInTheDocument();
  });

  it('allows toggling notification preferences', async () => {
    const user = userEvent.setup();

    render(<NotificationsPage />);

    const emailToggle = screen
      .getByTestId('email-notification-toggle')
      .querySelector('input[type="checkbox"]');

    expect(emailToggle).not.toBeNull();
    expect(emailToggle).toHaveAttribute('aria-checked', 'false');

    await user.click(emailToggle!);

    expect(emailToggle).toHaveAttribute('aria-checked', 'true');
  });
});
