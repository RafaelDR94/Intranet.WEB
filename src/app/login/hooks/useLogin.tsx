import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { FieldModel } from "../../components/DynamicForm/types";
import { useRecoverPasswordFlow } from "../context/RecoverPasswordFlowContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const loginInputClassName =
  "h-12 rounded-xl border-[1.5px] border-gray-40 bg-transparent px-3 py-3 text-sm leading-5 text-white placeholder:text-white/40 hover:border-white/80 focus:border-green-40 focus:bg-transparent";

const baseLoginFields: FieldModel[] = [
  {
    name: "email",
    type: "email",
    label: "Correo electrónico",
    placeholder: "Escribe aquí tu correo electrónico",
    value: "",
    validations: [{ type: "required" }, { type: "email" }],
    className: loginInputClassName,
  },
  {
    name: "password",
    type: "password",
    label: "Contraseña",
    placeholder: "Escribe aquí tu contraseña",
    value: "",
    validations: [{ type: "required" }, { type: "minLength", value: 6 }],
    className: `${loginInputClassName} pr-11`,
  },
];

export interface UseLogin {
  rememberStatus: boolean;
  isLoading: boolean;
  failMessage: string;
  loginFields: FieldModel[];
  handleForgotPassword: () => Promise<void>;
  handleLoginValuesChange: (values: Record<string, any>) => void;
  handleRemember: (
    remember: boolean,
    currentEmail?: string,
    currentPassword?: string,
  ) => void;
  handleLogin: (values: Record<string, any>) => Promise<void>;
}

const REMEMBER_EMAIL_KEY = "drs.remember.email";
const REMEMBER_PASS_KEY = "drs.remember.password";
const REMEMBER_FLAG_KEY = "drs.remember.flag";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLogin = (routerOverride?: ReturnType<typeof useRouter>): UseLogin => {
  const routerFromHook = useRouter();
  const router = routerOverride ?? routerFromHook;
  const { login, logout } = useAuth();
  const { clearFlow, setLookupData } = useRecoverPasswordFlow();
  const fetchRecoverChannels = useAuthStore(
    (state) => state.fetchRecoverChannels,
  );
  const clearRecoverPasswordState = useAuthStore(
    (state) => state.clearRecoverPasswordState,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [rememberStatus, setRememberStatus] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [rememberedEmail, setRememberedEmail] = useState<string>("");
  const [rememberedPassword, setRememberedPassword] = useState<string>("");
  const [loginValues, setLoginValues] = useState<Record<string, any>>({});

  useEffect(() => {
    try {
      const flag = localStorage.getItem(REMEMBER_FLAG_KEY) === "1";
      const email = localStorage.getItem(REMEMBER_EMAIL_KEY) || "";
      const pass = localStorage.getItem(REMEMBER_PASS_KEY) || "";
      setRememberStatus(flag);
      setRememberedEmail(flag ? email : "");
      setRememberedPassword(flag ? pass : "");
    } catch {
      // localStorage may be unavailable during SSR-like test environments.
    }
  }, []);

  const loginFields = useMemo<FieldModel[]>(
    () =>
      baseLoginFields.map((field) => {
        if (field.name === "email") return { ...field, value: rememberedEmail };
        if (field.name === "password") {
          return { ...field, value: rememberedPassword };
        }
        return field;
      }),
    [rememberedEmail, rememberedPassword],
  );

  const persistRemember = (
    remember: boolean,
    email?: string,
    password?: string,
  ) => {
    try {
      if (remember) {
        localStorage.setItem(REMEMBER_FLAG_KEY, "1");
        if (email !== undefined)
          localStorage.setItem(REMEMBER_EMAIL_KEY, email ?? "");
        if (password !== undefined)
          localStorage.setItem(REMEMBER_PASS_KEY, password ?? "");
        return;
      }

      localStorage.removeItem(REMEMBER_FLAG_KEY);
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_PASS_KEY);
    } catch {
      // localStorage failures should not block the login flow.
    }
  };

  const handleRemember = (
    remember: boolean,
    currentEmail?: string,
    currentPassword?: string,
  ) => {
    setRememberStatus(remember);
    if (remember) {
      if (currentEmail !== undefined) setRememberedEmail(currentEmail ?? "");
      if (currentPassword !== undefined)
        setRememberedPassword(currentPassword ?? "");
      persistRemember(true, currentEmail, currentPassword);
      return;
    }

    setRememberedEmail("");
    setRememberedPassword("");
    persistRemember(false);
  };

  const handleLogin = async (values: Record<string, any>) => {
    setIsLoading(true);
    setFailMessage("");
    const loginValues = { email: values.email, password: values.password };

    try {
      await login(loginValues);

      if (rememberStatus) {
        persistRemember(true, values.email, values.password);
        setRememberedEmail(values.email);
        setRememberedPassword(values.password);
      } else {
        persistRemember(false);
        setRememberedEmail("");
        setRememberedPassword("");
      }

      router.push("/main-page");
    } catch (error: any) {
      const messageError =
        error?.response?.data?.error_Message ??
        error?.error_Message ??
        error?.message ??
        "No se logró acceder, revise sus datos e inténtelo de nuevo";
      setFailMessage(messageError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    logout();
    clearFlow();
  }, [clearFlow, logout]);

  const handleLoginValuesChange = (values: Record<string, any>) => {
    setLoginValues(values);
  };

  const handleForgotPassword = async () => {
    const email = String(loginValues.email ?? "").trim();

    clearRecoverPasswordState();

    if (!email || !EMAIL_PATTERN.test(email)) {
      clearFlow();
      router.push("/login/recover-password/");
      return;
    }

    const channels = await fetchRecoverChannels(email);
    const availableChannels =
      channels?.filter((channel) => Boolean(channel.value?.trim())) ?? [];

    if (availableChannels.length > 0) {
      setLookupData(email, channels ?? []);
      router.push("/login/recover-password/verification-method/");
      return;
    }

    clearFlow();
    router.push("/login/recover-password/");
  };

  return {
    rememberStatus,
    isLoading,
    failMessage,
    loginFields,
    handleForgotPassword,
    handleLoginValuesChange,
    handleRemember,
    handleLogin,
  };
};

export default useLogin;
