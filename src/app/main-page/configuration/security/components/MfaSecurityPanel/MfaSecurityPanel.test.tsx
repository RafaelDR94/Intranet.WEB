import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import MfaSecurityPanel from './MfaSecurityPanel';

Object.assign(globalThis, { React });

describe('MfaSecurityPanel', () => {
  it('renders the MFA content and actions from the design', () => {
    render(<MfaSecurityPanel />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /autenticación de múltiples factores \(mfa\)/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/recibe códigos de verificación de 6 dígitos por sms o whatsapp/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dispositivos de confianza/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mfa-sms-toggle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar número/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^cerrar sesión$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cerrar todas las sesiones/i }),
    ).toBeInTheDocument();
  });
});
