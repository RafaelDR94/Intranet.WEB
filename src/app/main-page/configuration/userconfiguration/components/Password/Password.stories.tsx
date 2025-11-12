import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { PrincipalProvider } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import Password from "./Password";
import type { PasswordProps } from "./types";

type StoryArgs = PasswordProps & {
  theme: "light" | "dark";
  email?: string;
  userName?: string;
  currentPassword?: string;
};

const StoryContainer: React.FC<StoryArgs> = ({
  theme,
  email,
  userName,
  currentPassword,
}) => {
  useEffect(() => {
    const previousState = useAuthStore.getState();

    useAuthStore.setState(
      (state): Partial<typeof state> => ({
        ...state,
        user:
          email || userName
            ? ({
                ...(state.user ?? {}),
                email: email ?? (state.user as any)?.email ?? "",
                userName: userName ?? (state.user as any)?.userName ?? "",
                password:
                  currentPassword ??
                  (state.user as any)?.password ??
                  "",
              } as any)
            : null,
        successChangePassword: false,
        error: undefined,
        changePassword: async (payload: any) => {
          action("changePassword")(payload);
          useAuthStore.setState((current): Partial<typeof current> => ({
            ...current,
            user: current.user
              ? ({ ...current.user, password: payload.newPassword } as any)
              : current.user,
            successChangePassword: true,
            error: undefined,
          }));
        },
        resetFlags: () => {
          action("resetFlags")();
          useAuthStore.setState((current): Partial<typeof current> => ({
            ...current,
            successChangePassword: false,
            error: undefined,
          }));
        },
      }),
      false,
      "PasswordStory::init",
    );

    return () => useAuthStore.setState(previousState, true);
  }, [currentPassword, email, userName]);

  return (
    <PrincipalProvider>
      <div data-theme={theme} style={{ maxWidth: "28rem", padding: "1.5rem" }}>
        <Password />
      </div>
    </PrincipalProvider>
  );
};

const meta: Meta<StoryArgs> = {
  title: "MainPage/Configuration/UserConfiguration/Password",
  component: Password,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Tema aplicado al contenedor del componente.",
    },
    email: {
      control: { type: "text" },
      description: "Correo principal del usuario.",
    },
    userName: {
      control: { type: "text" },
      description: "Nombre de usuario usado como respaldo cuando no hay email.",
    },
    currentPassword: {
      control: { type: "text" },
      description: "Valor visible de la contraseña actual.",
    },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tarjeta que permite a la persona usuaria actualizar su contraseña de acceso.",
      },
    },
  },
  args: {
    theme: "light",
    email: "usuario@drsecurity.net",
    currentPassword: "********",
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

export const WithoutEmail: Story = {
  name: "Sin correo electrónico",
  args: {
    email: undefined,
    userName: "usuario.respaldo",
    currentPassword: "Secreta123",
  },
};
