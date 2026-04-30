import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MfaSecurityPanel from './MfaSecurityPanel';

Object.assign(globalThis, { React });

const changeMfaStatusMock = vi.fn();
const changeMfaMethodStatusMock = vi.fn();
const fetchUserMfaByIdMock = vi.fn();

const authState = {
  user: { idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86', twoFactorEnabled: true },
  changingMFA: false,
  changingMFAMethod: false,
  fetchingUserMfaById: false,
  mfaSmsEnabled: true,
  mfaEmailEnabled: false,
  userMfaById: null,
  changeMfaStatus: changeMfaStatusMock,
  changeMfaMethodStatus: changeMfaMethodStatusMock,
  fetchUserMfaById: fetchUserMfaByIdMock,
};

vi.mock('@/app/stores/useAuthStore/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

describe('MfaSecurityPanel', () => {
  beforeEach(() => {
    changeMfaStatusMock.mockClear();
    changeMfaMethodStatusMock.mockClear();
    fetchUserMfaByIdMock.mockClear();
    authState.user.twoFactorEnabled = true;
    authState.mfaSmsEnabled = true;
    authState.mfaEmailEnabled = false;
    authState.userMfaById = null;
  });

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
    expect(screen.getByText(/mensaje por correo electrónico/i)).toBeInTheDocument();
    expect(
      screen.getByText(/6 dígitos a tu correo electrónico empresarial/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mfa-main-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('mfa-sms-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('mfa-email-toggle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar número/i })).toBeInTheDocument();
    expect(fetchUserMfaByIdMock).toHaveBeenCalledWith(
      '3fa8f564-5717-4562-b3fc-2c963f66af86',
    );
  });

  it('calls store action to toggle MFA status', async () => {
    authState.user.twoFactorEnabled = false;
    authState.mfaEmailEnabled = false;

    render(<MfaSecurityPanel />);

    const mainToggle = screen.getByRole('switch', {
      name: /activar autenticación de múltiples factores/i,
    });

    fireEvent.click(mainToggle);

    expect(changeMfaStatusMock).toHaveBeenCalledWith({
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      twoFactorEnabled: true,
    });
    await waitFor(() => {
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
        method: 'EMAIL',
        isEnabled: true,
      });
    });

    authState.user.twoFactorEnabled = true;
  });

  it('calls store action to toggle MFA methods', () => {
    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByRole('switch', { name: /activar método sms/i }));
    fireEvent.click(screen.getByRole('switch', { name: /activar método email/i }));

    expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      method: 'SMS',
      isEnabled: false,
    });
    expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      method: 'EMAIL',
      isEnabled: true,
    });
  });

  it('uses Users/Mfa twoFactorEnabled to paint main toggle', () => {
    authState.user.twoFactorEnabled = true;
    authState.userMfaById = {
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      twoFactorEnabled: false,
      methods: [],
    };

    render(<MfaSecurityPanel />);

    expect(screen.getByTestId('mfa-main-toggle')).toHaveAttribute('aria-checked', 'false');
  });
});
