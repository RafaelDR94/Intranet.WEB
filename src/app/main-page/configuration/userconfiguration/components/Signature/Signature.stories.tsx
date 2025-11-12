import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { PrincipalProvider } from "@/app/context/PrincipalContext/PrincipalContext";
import { FirebaseContext } from "@/app/context/FirebaseContext/FirebaseContext";
import type { UseFirebasereturn } from "@/app/context/FirebaseContext/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

import Signature from "./Signature";
import type { SignatureProps } from "./types";

type StoryArgs = SignatureProps & {
  theme: "light" | "dark";
  employeeId?: string;
  signatureUrl?: string;
};

const firebaseMock: UseFirebasereturn = {
  firebasestorage: {
    storage: null,
    uploadFile: async () => {
      action("firebasestorage.uploadFile")();
      return "https://storybook.drsecurity.net/signatures/uploaded.png";
    },
    uploadImage: async () => "https://storybook.drsecurity.net/signatures/uploaded.png",
    updateFile: async () => "https://storybook.drsecurity.net/signatures/uploaded.png",
    listFilesAndUrls: async () => [],
    downloadFile: async () => "",
    deleteFile: async () => undefined,
  },
  firebaserealtime: {
    setData: async () => undefined,
    getData: async () => null,
    updateData: async () => undefined,
    deleteData: async () => undefined,
    pushData: async () => null,
    subscribe: () => () => undefined,
  },
  firebaseMessaging: {
    getMessagingToken: async () => "",
    onMessageReceived: () => undefined,
    notification: null,
    closeNotificacion: () => undefined,
  },
  permissionsChanged: { state: false, newPermissions: "" },
  firebaseLogginFail: false,
};

const StoryContainer: React.FC<StoryArgs> = ({ theme, employeeId, signatureUrl }) => {
  useEffect(() => {
    const previousState = useAuthStore.getState();

    useAuthStore.setState(
      (state) => ({
        ...state,
        user: employeeId
          ? {
              ...(state.user ?? {}),
              idEmployee: employeeId,
              signature: signatureUrl ?? state.user?.signature ?? "",
            }
          : null,
        signature: signatureUrl ?? "",
        succesChangeSignature: false,
        changingSignature: false,
        error: undefined,
        changeSignature: async (payload) => {
          action("changeSignature")(payload);
          useAuthStore.setState((current) => ({
            ...current,
            signature: payload.signature,
            user: current.user
              ? { ...current.user, signature: payload.signature }
              : current.user,
            succesChangeSignature: true,
            changingSignature: false,
            error: undefined,
          }));
        },
        resetFlags: () => {
          action("resetFlags")();
          useAuthStore.setState((current) => ({
            ...current,
            succesChangeSignature: false,
            changingSignature: false,
            error: undefined,
          }));
        },
      }),
      false,
      "SignatureStory::init",
    );

    return () => useAuthStore.setState(previousState, true);
  }, [employeeId, signatureUrl]);

  return (
    <PrincipalProvider>
      <FirebaseContext.Provider value={firebaseMock}>
        <div data-theme={theme} style={{ maxWidth: "28rem", padding: "1.5rem" }}>
          <Signature />
        </div>
      </FirebaseContext.Provider>
    </PrincipalProvider>
  );
};

const meta: Meta<StoryArgs> = {
  title: "MainPage/Configuration/UserConfiguration/Signature",
  component: Signature,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Tema aplicado al contenedor del componente.",
    },
    employeeId: {
      control: { type: "text" },
      description: "Identificador del colaborador asociado a la firma.",
    },
    signatureUrl: {
      control: { type: "text" },
      description: "URL de la firma ya registrada.",
    },
    className: { table: { disable: true } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tarjeta que muestra la firma digital actual y permite actualizarla mediante el componente de firma.",
      },
    },
  },
  args: {
    theme: "light",
    employeeId: "EMP-42",
    signatureUrl: "",
  },
  render: (args) => <StoryContainer {...args} />,
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const WithSignature: Story = {
  args: {
    signatureUrl: "https://storybook.drsecurity.net/signatures/current.png",
  },
};

export const DarkMode: Story = {
  args: {
    theme: "dark",
  },
};

export const WithoutEmployee: Story = {
  name: "Sin empleado asignado",
  args: {
    employeeId: "",
  },
};
