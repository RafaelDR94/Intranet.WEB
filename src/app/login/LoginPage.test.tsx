import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock("next/image", () => {
  return {
    default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
  };
});

vi.mock("./styles", () => {
  return {
    loginStyles: {
      page: "page",
      formContainer: "formContainer",
      formWrapper: "formWrapper",
      header: "header",
      title: "title",
      subtitle: "subtitle",
      emailStepPanel: "emailStepPanel",
      emailStepForm: "emailStepForm",
      emailStepLabel: "emailStepLabel",
      emailStepInput: "emailStepInput",
      emailStepButton: "emailStepButton",
      readOnlyEmailWrap: "readOnlyEmailWrap",
      readOnlyEmailHeader: "readOnlyEmailHeader",
      readOnlyEmailValue: "readOnlyEmailValue",
      editEmailButton: "editEmailButton",
      panel: "panel",
      formSkin: "formSkin",
      rememberContainer: "rememberContainer",
      rememberCheckbox: "rememberCheckbox",
      forgotPasswordLink: "forgotPasswordLink",
      supportContainer: "supportContainer",
      supportLink: "supportLink",
      logoContainer: "logoContainer",
      logo: "logo",
    },
  };
});

vi.mock("@/assets/images/Walpapers/Wallpaper-1.png", () => ({
  default: "/wallpaper-desktop.png",
}));
vi.mock("@/assets/images/Walpapers/wallpaper-mobile.png", () => ({
  default: "/wallpaper-mobile.png",
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalTheme: {
      setDarkTheme: vi.fn(),
      theme: "dark",
    },
  }),
}));

vi.mock("../components/DynamicForm/DynamicForm", () => {
  return {
    default: ({
      onSubmit,
      submitLabel,
      loading,
      children,
      onValuesChange,
    }: any) => (
      <form
        aria-label="dynamic-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.({ password: "secret123" });
        }}
      >
        <button
          type="button"
          onClick={() => onValuesChange?.({ password: "secret123" })}
        >
          sync-values
        </button>
        {children}
        <button type="submit" disabled={!!loading}>
          {submitLabel ?? "Enviar"}
        </button>
      </form>
    ),
  };
});

vi.mock("../components/Alert/Alert", () => {
  return {
    Alert: ({ title, description }: any) => (
      <div role="alert">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    ),
  };
});

vi.mock("../components/CheckBox/CheckBox", () => {
  return {
    Checkbox: ({ checked, onChange, label, ...rest }: any) => (
      <button
        type="button"
        aria-pressed={!!checked}
        aria-label={label ?? "checkbox"}
        onClick={() => onChange?.(!checked)}
        {...rest}
      >
        {label ?? "checkbox"}
      </button>
    ),
  };
});

type LoginMockState = {
  step: "emailLookup" | "passwordLogin";
  enteredEmail: string;
  maskedResolvedEmail: string;
  canUsePasskey: boolean;
  handleLogin: () => void;
  handlePasskeyLogin: () => void;
  handleForgotPassword: () => void;
  handleLoginValuesChange: (values: Record<string, any>) => void;
  handleEnteredEmailChange: (value: string) => void;
  handleEmailStepSubmit: () => void;
  handleEditEmail: () => void;
  handleRemember: (checked: boolean) => void;
  rememberStatus: boolean;
  failMessage: string | null;
  isLoading: boolean;
  lookupLoading: boolean;
  loginFields: any[];
  mfaRequiredData: null;
  selectedMfaMethod: "Email";
  mfaOptions: any[];
  mfaLoading: boolean;
  setSelectedMfaMethod: (method: "Email") => void;
  handleSendMfaCode: () => void;
  handleBackToLoginFromMfa: () => void;
};

const loginState: LoginMockState = {
  step: "emailLookup",
  enteredEmail: "",
  maskedResolvedEmail: "ad***@dr.com",
  canUsePasskey: false,
  handleLogin: vi.fn(),
  handlePasskeyLogin: vi.fn(),
  handleForgotPassword: vi.fn(),
  handleLoginValuesChange: vi.fn(),
  handleEnteredEmailChange: vi.fn(),
  handleEmailStepSubmit: vi.fn(),
  handleEditEmail: vi.fn(),
  handleRemember: vi.fn(),
  rememberStatus: false,
  failMessage: null,
  isLoading: false,
  lookupLoading: false,
  loginFields: [{ id: "password", type: "password", label: "Password", value: "" }],
  mfaRequiredData: null,
  selectedMfaMethod: "Email",
  mfaOptions: [],
  mfaLoading: false,
  setSelectedMfaMethod: vi.fn(),
  handleSendMfaCode: vi.fn(),
  handleBackToLoginFromMfa: vi.fn(),
};

export function __setLoginMock(partial: Partial<LoginMockState>) {
  Object.assign(loginState, partial);
}

export function __resetLoginMock() {
  loginState.step = "emailLookup";
  loginState.enteredEmail = "";
  loginState.maskedResolvedEmail = "ad***@dr.com";
  loginState.canUsePasskey = false;
  loginState.handleLogin = vi.fn();
  loginState.handlePasskeyLogin = vi.fn();
  loginState.handleForgotPassword = vi.fn();
  loginState.handleLoginValuesChange = vi.fn();
  loginState.handleEnteredEmailChange = vi.fn();
  loginState.handleEmailStepSubmit = vi.fn();
  loginState.handleEditEmail = vi.fn();
  loginState.handleRemember = vi.fn();
  loginState.rememberStatus = false;
  loginState.failMessage = null;
  loginState.isLoading = false;
  loginState.lookupLoading = false;
}

vi.mock("./hooks/useLogin", () => {
  return {
    default: () => ({ ...loginState }),
  };
});

import LoginPage from "./page";

describe("LoginPage", () => {
  beforeEach(() => {
    __resetLoginMock();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renderiza el paso inicial de correo", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: "dynamic-form" })).not.toBeInTheDocument();
  });

  it("dispara el lookup al enviar el correo", async () => {
    const user = userEvent.setup();
    const emailSubmitSpy = vi.fn();
    __setLoginMock({ handleEmailStepSubmit: emailSubmitSpy, enteredEmail: "admin@dr.com" });

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(emailSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it("renderiza el paso de contraseña con correo enmascarado", () => {
    __setLoginMock({
      step: "passwordLogin",
      maskedResolvedEmail: "ad***@dr.com",
    });

    render(<LoginPage />);

    expect(screen.getByRole("form", { name: "dynamic-form" })).toBeInTheDocument();
    expect(screen.getByTestId("login-email-masked")).toHaveTextContent("ad***@dr.com");
    expect(screen.queryByTestId("login-email")).not.toBeInTheDocument();
  });

  it("muestra el botón passkey solo cuando está habilitado", () => {
    __setLoginMock({ step: "passwordLogin", canUsePasskey: true });
    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: "Iniciar sesión con Passkey" }),
    ).toBeInTheDocument();
  });

  it("dispara handlePasskeyLogin al hacer click en el boton passkey", async () => {
    const user = userEvent.setup();
    const passkeySpy = vi.fn();
    __setLoginMock({
      step: "passwordLogin",
      canUsePasskey: true,
      handlePasskeyLogin: passkeySpy,
    });

    render(<LoginPage />);
    await user.click(screen.getByRole("button", { name: "Iniciar sesión con Passkey" }));

    expect(passkeySpy).toHaveBeenCalledTimes(1);
  });

  it("permite volver a editar el correo desde el paso 2", async () => {
    const user = userEvent.setup();
    const editSpy = vi.fn();
    __setLoginMock({
      step: "passwordLogin",
      handleEditEmail: editSpy,
    });

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Cambiar correo" }));
    expect(editSpy).toHaveBeenCalledTimes(1);
  });
});
