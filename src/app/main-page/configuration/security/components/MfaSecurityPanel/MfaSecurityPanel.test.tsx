import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MfaSecurityPanel from "./MfaSecurityPanel";

Object.assign(globalThis, { React });

const pushMock = vi.fn();
const changeMfaStatusMock = vi.fn();
const changeMfaMethodStatusMock = vi.fn();
const fetchUserMfaByIdMock = vi.fn();
const fetchUserPasskeysMock = vi.fn();
const registerUserPasskeyOptionsMock = vi.fn();

const authState = {
  user: {
    idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
    twoFactorEnabled: true,
    email: "admin@dr.com",
  },
  changingMFA: false,
  changingMFAMethod: false,
  fetchingUserMfaById: false,
  mfaSmsEnabled: true,
  mfaEmailEnabled: false,
  userMfaById: null as any,
  userPasskeys: [] as any[],
  registerUserPasskeyOptions: registerUserPasskeyOptionsMock,
  registeringUserPasskey: false,
  fetchUserPasskeys: fetchUserPasskeysMock,
  error: undefined as string | undefined,
  changeMfaStatus: changeMfaStatusMock,
  changeMfaMethodStatus: changeMfaMethodStatusMock,
  fetchUserMfaById: fetchUserMfaByIdMock,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/app/stores/useAuthStore/useAuthStore", () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

vi.mock("@/app/components/PopUp/PopUp", () => ({
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

vi.mock("@/app/components/Input/Input", () => ({
  Input: ({ value, onChange, placeholder }: any) => (
    <input placeholder={placeholder} value={value} onChange={onChange} />
  ),
}));

describe("MfaSecurityPanel", () => {
  beforeEach(() => {
    pushMock.mockClear();
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
    authState.userMfaById = {
      idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
      twoFactorEnabled: true,
      methods: [
        {
          method: "Passkey",
          isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: null,
          challengeId: null,
        },
        {
          method: "SMS",
          isEnabled: true,
          isVerified: true,
          destinationMasked: "55******78",
          destination: "5512345678",
          challengeId: null,
        },
        {
          method: "Email",
          isEnabled: false,
          isVerified: true,
          destinationMasked: "ad***@dr.com",
          destination: "admin@dr.com",
          challengeId: null,
        },
      ],
    };
    authState.userPasskeys = [];
  });

  it("renders MFA channels only when MFA is active", () => {
    render(<MfaSecurityPanel />);

    expect(screen.getByTestId("mfa-main-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-sms-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-email-toggle")).toBeInTheDocument();
    expect(screen.getByText(/autenticación con dispositivo/i)).toBeInTheDocument();
    expect(fetchUserMfaByIdMock).toHaveBeenCalledWith(
      "3fa8f564-5717-4562-b3fc-2c963f66af86",
    );
    expect(fetchUserPasskeysMock).toHaveBeenCalledWith(
      "3fa8f564-5717-4562-b3fc-2c963f66af86",
    );
  });

  it("hides SMS and email rows when MFA is off but keeps passkey available", () => {
    authState.user.twoFactorEnabled = false;
    authState.mfaSmsEnabled = false;
    authState.mfaEmailEnabled = false;
    authState.userMfaById = {
      idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
      twoFactorEnabled: false,
      methods: [
        {
          method: "Passkey",
          isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: null,
          challengeId: null,
        },
      ],
    };

    render(<MfaSecurityPanel />);

    expect(screen.queryByTestId("mfa-sms-toggle")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mfa-email-toggle")).not.toBeInTheDocument();
    expect(screen.getByTestId("mfa-passkey-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-passkey-toggle")).not.toBeDisabled();
  });

  it("enables MFA and turns email on by default", async () => {
    authState.user.twoFactorEnabled = false;
    authState.mfaSmsEnabled = false;
    authState.mfaEmailEnabled = false;
    authState.userMfaById = {
      idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
      twoFactorEnabled: false,
      methods: [
        {
          method: "Passkey",
          isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: null,
          challengeId: null,
        },
        {
          method: "SMS",
          isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: "5512345678",
          challengeId: null,
        },
        {
          method: "Email",
          isEnabled: false,
          isVerified: true,
          destinationMasked: "ad***@dr.com",
          destination: "admin@dr.com",
          challengeId: null,
        },
      ],
    };

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByTestId("mfa-main-toggle"));

    await waitFor(() => {
      expect(changeMfaStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        twoFactorEnabled: true,
      });
    });
    expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
      idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
      method: "Email",
      isEnabled: true,
      destination: "admin@dr.com",
    });
  });

  it("disables SMS and email before turning MFA off", async () => {
    authState.mfaSmsEnabled = true;
    authState.mfaEmailEnabled = true;
    authState.userMfaById.methods = [
      ...authState.userMfaById.methods.filter((method: any) => method.method === "Passkey"),
      {
        method: "SMS",
        isEnabled: true,
        isVerified: true,
        destinationMasked: "55******78",
        destination: "5512345678",
        challengeId: null,
      },
      {
        method: "Email",
        isEnabled: true,
        isVerified: true,
        destinationMasked: "ad***@dr.com",
        destination: "admin@dr.com",
        challengeId: null,
      },
    ];

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByTestId("mfa-main-toggle"));

    await waitFor(() => {
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        method: "SMS",
        isEnabled: false,
        destination: "5512345678",
      });
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        method: "Email",
        isEnabled: false,
        destination: "admin@dr.com",
      });
      expect(changeMfaStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        twoFactorEnabled: false,
      });
    });
  });

  it("turns MFA off when the last active MFA channel is disabled", async () => {
    authState.mfaSmsEnabled = false;
    authState.mfaEmailEnabled = true;
    authState.userMfaById.methods = [
      ...authState.userMfaById.methods.filter((method: any) => method.method === "Passkey"),
      {
        method: "SMS",
        isEnabled: false,
        isVerified: false,
        destinationMasked: null,
        destination: "5512345678",
        challengeId: null,
      },
      {
        method: "Email",
        isEnabled: true,
        isVerified: true,
        destinationMasked: "ad***@dr.com",
        destination: "admin@dr.com",
        challengeId: null,
      },
    ];

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByTestId("mfa-email-toggle"));

    await waitFor(() => {
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        method: "Email",
        isEnabled: false,
        destination: "admin@dr.com",
      });
      expect(changeMfaStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        twoFactorEnabled: false,
      });
    });
  });

  it("opens passkey modal and enables passkey without changing MFA status", async () => {
    authState.user.twoFactorEnabled = false;
    authState.mfaSmsEnabled = false;
    authState.mfaEmailEnabled = false;
    authState.userMfaById = {
      idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
      twoFactorEnabled: false,
      methods: [
        {
          method: "Passkey",
          isEnabled: false,
          isVerified: false,
          destinationMasked: null,
          destination: null,
          challengeId: null,
        },
      ],
    };
    fetchUserPasskeysMock.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: "passkey-guid-2",
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        friendlyName: "Edge",
        createdAt: null,
        lastUsedAt: null,
      },
    ]);

    render(<MfaSecurityPanel />);

    fireEvent.click(screen.getByRole("switch", { name: /activar autenticación con dispositivo/i }));
    expect(screen.getByRole("button", { name: /registrar dispositivo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /registrar dispositivo/i }));

    await waitFor(() => {
      expect(registerUserPasskeyOptionsMock).toHaveBeenCalledTimes(1);
      expect(changeMfaMethodStatusMock).toHaveBeenCalledWith({
        idUser: "3fa8f564-5717-4562-b3fc-2c963f66af86",
        method: "Passkey",
        isEnabled: true,
        idPasskey: "passkey-guid-2",
      });
    });
    expect(changeMfaStatusMock).not.toHaveBeenCalled();
  });
});
