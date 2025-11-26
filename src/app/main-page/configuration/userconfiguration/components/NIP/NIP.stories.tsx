import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { PrincipalProvider } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import Nip from "./NIP";
import type { NipProps } from "./types";

type StoryArgs = NipProps & {
  theme: "light" | "dark";
  currentNip: string;
  userId?: string;
};

const StoryContainer: React.FC<StoryArgs> = ({ theme, currentNip, userId }) => {
  useEffect(() => {
    const previousState = useAuthStore.getState();

    useAuthStore.setState(
      (state): Partial<typeof state> => ({
        ...state,
        user: userId
          ? ({
              ...(state.user ?? {}),
              idUser: userId,
              nip: currentNip,
              fullName: (state.user as any)?.fullName ?? "Usuario Storybook",
              employeeNumber: (state.user as any)?.employeeNumber ?? "",
              userName: (state.user as any)?.userName ?? "",
              changePassword: (state.user as any)?.changePassword ?? false,
              idEmployee: (state.user as any)?.idEmployee ?? "",
              email: (state.user as any)?.email ?? "",
            } as any)
          : null,
        successChangeNIP: false,
        error: undefined,
        changeNip: async (payload: any) => {
          action("changeNip")(payload);
          useAuthStore.setState((current): Partial<typeof current> => ({
            ...current,
            user: current.user
              ? ({ ...current.user, nip: payload.nip } as any)
              : current.user,
            successChangeNIP: true,
            error: undefined,
          }));
        },
        resetFlags: () => {
          action("resetFlags")();
          useAuthStore.setState((current): Partial<typeof current> => ({
            ...current,
            successChangeNIP: false,
            error: undefined,
          }));
        },
      }),
      false,
      "NipStory::init",
    );

    return () => useAuthStore.setState(previousState, true);
  }, [currentNip, userId]);

  return (
    <PrincipalProvider>
      <div data-theme={theme} style={{ maxWidth: "28rem", padding: "1.5rem" }}>
        <Nip />
      </div>
    </PrincipalProvider>
  );
};

const meta: Meta<StoryArgs> = {
  title: "MainPage/Configuration/UserConfiguration/Nip",
  component: Nip,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Tema aplicado al contenedor del componente.",
    },
    currentNip: {
      control: { type: "text" },
      description: "Valor mostrado inicialmente en el formulario.",
    },
    userId: {
      control: { type: "text" },
      description: "Identificador del usuario autenticado.",
    },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tarjeta que permite actualizar el NIP utilizado en autorizaciones sin firma digital.",
      },
    },
  },
  args: {
    theme: "light",
    currentNip: "1234",
    userId: "42",
  },
  render: (args) => <StoryContainer {...args} />,
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const DarkMode: Story = {
  args: {
    theme: "dark",
  },
};

export const WithoutUser: Story = {
  name: "Sin usuario autenticado",
  args: {
    userId: "",
    currentNip: "",
  },
};
