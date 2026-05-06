import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MfaSecurityPanel from './MfaSecurityPanel';

Object.assign(globalThis, { React });

const changeMfaStatusMock = vi.fn();
const changeMfaMethodStatusMock = vi.fn();
const fetchUserMfaByIdMock = vi.fn();
const fetchUserPasskeysMock = vi.fn();
const registerUserPasskeyOptionsMock = vi.fn();

const authState = {
  user: {
    idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
    twoFactorEnabled: true,
    email: 'admin@dr.com',
  },
  changingMFA: false,
  changingMFAMethod: false,
  fetchingUserMfaById: false,
  mfaSmsEnabled: true,
  mfaEmailEnabled: false,
  userMfaById: null,
  userPasskeys: [],
  registerUserPasskeyOptions: registerUserPasskeyOptionsMock,
  registeringUserPasskey: false,
  fetchUserPasskeys: fetchUserPasskeysMock,
  error: undefined,
  changeMfaStatus: changeMfaStatusMock,
  changeMfaMethodStatus: changeMfaMethodStatusMock,
  fetchUserMfaById: fetchUserMfaByIdMock,
};

vi.mock('@/app/stores/useAuthStore/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: ({ open, title, children, showPrimaryButton, primaryButtonText, onPrimaryButtonClick }: any) =>
    open ? (
      <div>
        <h3>{title}</h3>
        {children}
        {showPrimaryButton ? (
          <button type="button" onClick={onPrimaryButtonClick}>
            {primaryButtonText}
          </button>
        ) : null}
      </div>
    ) : null,
}));

vi.mock('@/app/components/Input/Input', () => ({
  Input: ({ value, onChange, placeholder }: any) => (
    <input placeholder={placeholder} value={value} onChange={onChange} />
  ),
}));

describe('MfaSecurityPanel', () => {
  beforeEach(() => {
    changeMfaStatusMock.mockClear();
    changeMfaMethodStatusMock.mockClear();
    fetchUserMfaByIdMock.mockClear();
    fetchUserPasskeysMock.mockClear();
    registerUserPasskeyOptionsMock.mockClear();
    registerUserPasskeyOptionsMock.mockResolvedValue(true);
    fetchUserPasskeysMock.mockResolvedValue([]);
    authState.user.twoFactorEnabled = true;
    authState.mfaSmsEnabled = true;
    authState.mfaEmailEnabled = false;
    authState.userMfaById = null;
    authState.userPasskeys = [];
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
    expect(fetchUserPasskeysMock).toHaveBeenCalledWith(
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
        method: 'Email',
        isEnabled: true,
        destination: 'admin@dr.com',
      });
    });

    authState.user.twoFactorEnabled = true;
  });

  it('calls store action to toggle MFA methods', () => {
    authState.userMfaById = {
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      twoFactorEnabled: true,
      methods: [
        {
        method: 'Passkey',
        isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: null,
          challengeId: null,
        },
        {
          method: 'SMS',
          isEnabled: true,
          isVerified: true,
          destinationMasked: '55******78',
          destination: '5512345678',
          challengeId: null,
        },
        {
          method: 'Email',
          isEnabled: false,
          isVerified: true,
          destinationMasked: 'ad***@dr.com',
          destination: 'admin@dr.com',
          challengeId: null,
        },
      ],
    };
    authState.userPasskeys = [{ id: 'passkey-guid-1', idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86', friendlyName: 'Chrome', createdAt: null, lastUsedAt: null }];

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByRole('switch', { name: /activar método sms/i }));
    fireEvent.click(screen.getByRole('switch', { name: /activar método email/i }));
    fireEvent.click(screen.getByRole('switch', { name: /activar acceso con huella o passkey/i }));

    expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      method: 'SMS',
      isEnabled: false,
      destination: '5512345678',
    });
    expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      method: 'Email',
      isEnabled: true,
      destination: 'admin@dr.com',
    });
    expect(screen.getByText(/activar acceso con huella o passkey/i)).toBeInTheDocument();
  });

  it('opens passkey modal and registers device before enabling passkey method', async () => {
    authState.userMfaById = {
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      twoFactorEnabled: true,
      methods: [{ method: 'Passkey', isEnabled: false, isVerified: false, destinationMasked: null, destination: null, challengeId: null }],
    };
    fetchUserPasskeysMock.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: 'passkey-guid-2', idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86', friendlyName: 'Edge', createdAt: null, lastUsedAt: null },
    ]);

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByRole('switch', { name: /activar acceso con huella o passkey/i }));
    expect(screen.getByRole('button', { name: /registrar dispositivo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /registrar dispositivo/i }));

    await waitFor(() => {
      expect(registerUserPasskeyOptionsMock).toHaveBeenCalledTimes(1);
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
        method: 'Passkey',
        isEnabled: true,
        idPasskey: 'passkey-guid-2',
      });
    });
  });

  it('disables SMS and email toggles when main MFA is off', () => {
    authState.user.twoFactorEnabled = false;
    authState.userMfaById = {
      idUser: '3fa8f564-5717-4562-b3fc-2c963f66af86',
      twoFactorEnabled: false,
      methods: [],
    };

    render(<MfaSecurityPanel />);

    const smsToggle = screen.getByTestId('mfa-sms-toggle');
    const emailToggle = screen.getByTestId('mfa-email-toggle');

    expect(smsToggle).toBeDisabled();
    expect(emailToggle).toBeDisabled();

    fireEvent.click(smsToggle);
    fireEvent.click(emailToggle);

    expect(changeMfaMethodStatusMock).not.toHaveBeenCalled();
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
