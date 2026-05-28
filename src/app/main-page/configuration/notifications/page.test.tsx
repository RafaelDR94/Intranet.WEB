import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NotificationsPage from "./page";

Object.assign(globalThis, { React });

const getDataMock = vi.fn();
const updateDataMock = vi.fn();

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    user: { idUser: "user-1" },
  }),
}));

vi.mock("@/app/context/FirebaseContext/FirebaseContext", () => ({
  useFirebase: () => ({
    firebaserealtime: {
      getData: getDataMock,
      updateData: updateDataMock,
    },
  }),
}));

describe("NotificationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDataMock.mockResolvedValue({
      emailEnabled: false,
      pushEnabled: true,
      smsEnabled: true,
    });
  });

  it("renders the notification preferences from figma", async () => {
    render(<NotificationsPage />);

    expect(
      screen.getByRole("heading", {
        name: /activación de notificaciones dentro de la intranet/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/solicitudes, respuestas y proyectos \(push\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /recibe un correo electrónico cuando te respondan a una solicitud/i,
      ),
    ).toBeInTheDocument();

    await waitFor(() => expect(getDataMock).toHaveBeenCalled());
  });

  it("allows toggling notification preferences", async () => {
    render(<NotificationsPage />);

    await waitFor(() => expect(getDataMock).toHaveBeenCalled());

    const emailToggleWrapper = screen.getByTestId("email-notification-toggle");
    const emailToggle = emailToggleWrapper.querySelector('input[type="checkbox"]');

    expect(emailToggle).not.toBeNull();
    expect(emailToggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(emailToggle!);

    await waitFor(() =>
      expect(
        emailToggleWrapper.querySelector('input[type="checkbox"]'),
      ).toHaveAttribute("aria-checked", "true"),
    );
    await waitFor(() =>
      expect(updateDataMock).toHaveBeenCalledWith(
        "Notifications/user-1/Preferences",
        { emailEnabled: true },
      ),
    );
  });
});
