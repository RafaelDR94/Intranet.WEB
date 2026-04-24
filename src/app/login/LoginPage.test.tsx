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
          onSubmit?.();
        }}
      >
        <button
          type="button"
          onClick={() => onValuesChange?.({ email: "user@drsecurity.net" })}
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
  handleLogin: () => void;
  handleForgotPassword: () => void;
  handleLoginValuesChange: (values: Record<string, any>) => void;
  handleRemember: (checked: boolean) => void;
  rememberStatus: boolean;
  failMessage: string | null;
  isLoading: boolean;
  loginFields: any[];
};

const loginState: LoginMockState = {
  handleLogin: vi.fn(),
  handleForgotPassword: vi.fn(),
  handleLoginValuesChange: vi.fn(),
  handleRemember: vi.fn(),
  rememberStatus: false,
  failMessage: null,
  isLoading: false,
  loginFields: [
    { id: "email", type: "email", label: "Email", value: "" },
    { id: "password", type: "password", label: "Password", value: "" },
  ],
};

export function __setLoginMock(partial: Partial<LoginMockState>) {
  Object.assign(loginState, partial);
}

export function __resetLoginMock() {
  loginState.handleLogin = vi.fn();
  loginState.handleForgotPassword = vi.fn();
  loginState.handleLoginValuesChange = vi.fn();
  loginState.handleRemember = vi.fn();
  loginState.rememberStatus = false;
  loginState.failMessage = null;
  loginState.isLoading = false;
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

  it("renderiza el formulario, el boton de enviar y el boton de recuperar contrasena", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("form", { name: "dynamic-form" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Iniciar sesión" }),
    ).toBeInTheDocument();

    const recover = screen.getByRole("button", {
      name: /¿Olvidaste tu contraseña\?/i,
    });
    expect(recover).toBeInTheDocument();
  });

  it("propaga el submit al handleLogin del hook", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    __setLoginMock({ handleLogin: spy });

    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("llama a handleRemember con el valor alternado al hacer click en Checkbox", async () => {
    const user = userEvent.setup();
    const rememberSpy = vi.fn();
    __setLoginMock({ rememberStatus: false, handleRemember: rememberSpy });

    render(<LoginPage />);

    const checkbox = screen.getByRole("button", { name: /Recordarme/i });
    expect(checkbox).toHaveAttribute("aria-pressed", "false");

    await user.click(checkbox);
    expect(rememberSpy).toHaveBeenCalledWith(true);
  });

  it("propaga click en olvidar contrasena al hook", async () => {
    const user = userEvent.setup();
    const forgotSpy = vi.fn();
    __setLoginMock({ handleForgotPassword: forgotSpy });

    render(<LoginPage />);

    await user.click(
      screen.getByRole("button", { name: /¿Olvidaste tu contraseña\?/i }),
    );
    expect(forgotSpy).toHaveBeenCalledTimes(1);
  });

  it("muestra el Alert cuando existe failMessage", () => {
    __setLoginMock({ failMessage: "Credenciales invalidas" });

    render(<LoginPage />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Login incorrecto")).toBeInTheDocument();
    expect(screen.getByText("Credenciales invalidas")).toBeInTheDocument();
  });

  it("no muestra el Alert cuando failMessage es null/undefined", () => {
    __setLoginMock({ failMessage: null });

    render(<LoginPage />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("deshabilita el boton de submit cuando isLoading es true", () => {
    __setLoginMock({ isLoading: true });

    render(<LoginPage />);
    const submit = screen.getByRole("button", { name: "Iniciar sesión" });
    expect(submit).toBeDisabled();
  });

  it("renderiza las imagenes de fondo con sus alt texts", () => {
    render(<LoginPage />);
    expect(
      screen.getByAltText("Fondo DR Security (desktop)"),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Fondo DR Security (mobile)"),
    ).toBeInTheDocument();
  });
});
