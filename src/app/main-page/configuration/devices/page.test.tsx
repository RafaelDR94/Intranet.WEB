import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DevicesPage from './page';

Object.assign(globalThis, { React });

const fetchUserPasskeysMock = vi.fn();
const deleteUserPasskeyMock = vi.fn();
const registerUserPasskeyOptionsMock = vi.fn();

const authState = {
  user: { idUser: 'u-1' },
  userPasskeys: [
    {
      id: 'pk-1',
      idUser: 'u-1',
      friendlyName: 'iPhone Tania',
      createdAt: null,
      lastUsedAt: null,
    },
    {
      id: 'pk-2',
      idUser: 'u-1',
      friendlyName: 'Laptop 0123',
      createdAt: null,
      lastUsedAt: null,
    },
  ],
  fetchingUserPasskeys: false,
  deletingUserPasskey: false,
  registeringUserPasskey: false,
  fetchUserPasskeys: fetchUserPasskeysMock,
  deleteUserPasskey: deleteUserPasskeyMock,
  registerUserPasskeyOptions: registerUserPasskeyOptionsMock,
};

vi.mock('@/app/stores/useAuthStore/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

vi.mock('@/app/components/PopUp/PopUp', () => ({
  PopUp: (props: any) =>
    props.open ? (
      <div>
        <p>{props.title}</p>
        <p>{props.content}</p>
        {props.children}
        {props.showSecondaryButton ? <button onClick={props.onClose}>{props.secondaryButtonText || 'Cancelar'}</button> : null}
        {props.showPrimaryButton ? <button onClick={props.onPrimaryButtonClick}>{props.primaryButtonText || 'Aceptar'}</button> : null}
      </div>
    ) : null,
}));

describe('DevicesPage', () => {
  beforeEach(() => {
    fetchUserPasskeysMock.mockClear();
    deleteUserPasskeyMock.mockClear();
    registerUserPasskeyOptionsMock.mockClear();
    registerUserPasskeyOptionsMock.mockResolvedValue(true);
    authState.userPasskeys = [
      {
        id: 'pk-1',
        idUser: 'u-1',
        friendlyName: 'iPhone Tania',
        createdAt: null,
        lastUsedAt: null,
      },
      {
        id: 'pk-2',
        idUser: 'u-1',
        friendlyName: 'Laptop 0123',
        createdAt: null,
        lastUsedAt: null,
      },
    ];
    authState.fetchingUserPasskeys = false;
    authState.deletingUserPasskey = false;
    authState.registeringUserPasskey = false;
  });

  it('renders devices management view and fetches passkeys', async () => {
    render(<DevicesPage />);

    expect(screen.getByRole('button', { name: /administraci.*dispositivos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nuevo dispositivo/i })).toBeInTheDocument();
    expect(screen.getByText(/dispositivos con inicio de sesi.*n en la intranet/i)).toBeInTheDocument();
    expect(screen.getByText('iPhone Tania')).toBeInTheDocument();
    expect(screen.getByText('Laptop 0123')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /desvincular dispositivo/i })).toHaveLength(2);

    await waitFor(() => {
      expect(fetchUserPasskeysMock).toHaveBeenCalledWith('u-1');
    });
  });

  it('calls delete action on unlink button click', () => {
    render(<DevicesPage />);

    fireEvent.click(screen.getAllByRole('button', { name: /desvincular dispositivo/i })[0]);

    expect(deleteUserPasskeyMock).toHaveBeenCalledWith('pk-1');
  });

  it('opens and closes new device popup', () => {
    render(<DevicesPage />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo dispositivo/i }));

    expect(screen.getByText(/activar acceso con huella o passkey/i)).toBeInTheDocument();
    expect(
      screen.getByText(/vamos a registrar este dispositivo para que puedas iniciar sesi.*n con huella/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre del dispositivo/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.queryByText(/activar acceso con huella o passkey/i)).not.toBeInTheDocument();
  });

  it('calls register options endpoint action on accept', async () => {
    render(<DevicesPage />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo dispositivo/i }));
    fireEvent.change(screen.getByPlaceholderText(/nombre del dispositivo/i), {
      target: { value: 'Equipo Bruno' },
    });
    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));

    await waitFor(() => {
      expect(registerUserPasskeyOptionsMock).toHaveBeenCalledWith('Equipo Bruno');
    });
  });

  it('shows confirm identity popup after successful register options request', async () => {
    render(<DevicesPage />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo dispositivo/i }));
    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));

    await waitFor(() => {
      expect(screen.getByText(/confirma tu identidad/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/sigue las instrucciones de tu dispositivo\. tu huella nunca se comparte con dr security\./i),
    ).toBeInTheDocument();
  });
});
