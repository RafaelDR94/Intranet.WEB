import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import SecurityPage from './page';

Object.assign(globalThis, { React });

vi.mock('../userconfiguration/components/Password/Password', () => ({
  __esModule: true,
  default: () => <div>PasswordCard</div>,
}));

vi.mock('../userconfiguration/components/NIP/NIP', () => ({
  __esModule: true,
  default: () => <div>NipCard</div>,
}));

vi.mock('../userconfiguration/components/Signature/Signature', () => ({
  __esModule: true,
  default: () => <div>SignatureCard</div>,
}));

describe('SecurityPage', () => {
  it('renders the security cards and the MFA panel without the account form', () => {
    render(<SecurityPage />);

    expect(screen.getByText('PasswordCard')).toBeInTheDocument();
    expect(screen.getByText('NipCard')).toBeInTheDocument();
    expect(screen.getByText('SignatureCard')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /autenticación de múltiples factores \(mfa\)/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar número/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cerrar todas las sesiones/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('CreateEmployee')).toBeNull();
  });
});
