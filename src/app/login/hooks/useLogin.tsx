import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { FieldModel } from "../../components/DynamicForm/types";
import { useRecoverPasswordFlow } from "../context/RecoverPasswordFlowContext";
import { useAuth } from "../../context/AuthContext/AuthContext";
import {
  LoginMfaRequiredError,
  type LoginMfaMethod,
  type LoginMfaRequiredPayload,
} from "../../context/AuthContext/utilities/AuthService";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import type { RecoverPasswordResponse } from "@/app/mappings/auth/auth.types";

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
  mfaLoading: boolean;
  failMessage: string;
  loginFields: FieldModel[];
  mfaRequiredData: LoginMfaRequiredPayload | null;
  selectedMfaMethod: "Email" | "SMS";
  mfaOptions: LoginMfaMethod[];
  handleForgotPassword: () => Promise<void>;
  handleLoginValuesChange: (values: Record<string, unknown>) => void;
  handleRemember: (
    remember: boolean,
    currentEmail?: string,
    currentPassword?: string,
  ) => void;
  handleLogin: (values: Record<string, unknown>) => Promise<void>;
  setSelectedMfaMethod: (method: "Email" | "SMS") => void;
  handleSendMfaCode: () => Promise<void>;
  handleBackToLoginFromMfa: () => void;
}

const REMEMBER_EMAIL_KEY = "drs.remember.email";
const REMEMBER_PASS_KEY = "drs.remember.password";
const REMEMBER_FLAG_KEY = "drs.remember.flag";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLogin = (routerOverride?: ReturnType<typeof useRouter>): UseLogin => {
  const routerFromHook = useRouter();
  const router = routerOverride ?? routerFromHook;
  const { login, logout } = useAuth();
  const { clearFlow, setLookupData, setVerificationChallenge } =
    useRecoverPasswordFlow();
  const fetchRecoverChannels = useAuthStore(
    (state) => state.fetchRecoverChannels,
  );
  const recoverPassword = useAuthStore((state) => state.recoverPassword);
  const clearRecoverPasswordState = useAuthStore(
    (state) => state.clearRecoverPasswordState,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [rememberStatus, setRememberStatus] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [rememberedEmail, setRememberedEmail] = useState<string>("");
  const [rememberedPassword, setRememberedPassword] = useState<string>("");
  const [loginValues, setLoginValues] = useState<Record<string, unknown>>({});
  const [mfaRequiredData, setMfaRequiredData] =
    useState<LoginMfaRequiredPayload | null>(null);
  const [selectedMfaMethod, setSelectedMfaMethod] = useState<"Email" | "SMS">(
    "Email",
  );
  const [mfaLoading, setMfaLoading] = useState(false);

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

  const mfaOptions = useMemo<LoginMfaMethod[]>(() => {
    const options = mfaRequiredData?.availableMethods ?? [];
    return options.filter((option) => Boolean(option.value?.trim()));
  }, [mfaRequiredData]);

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

  const startMfaChallenge = useCallback(
    async (
      mfaData: LoginMfaRequiredPayload,
      method: "Email" | "SMS",
      options: LoginMfaMethod[],
    ): Promise<boolean> => {
      const selectedChannel = options.find((option) => option.type === method);

      if (!selectedChannel) {
        setFailMessage("No hay un método válido para enviar el código.");
        return false;
      }

      setMfaLoading(true);
      setFailMessage("");
      clearRecoverPasswordState();

      try {
        const challenge = await recoverPassword({
          email: mfaData.userName,
          type: method,
          purpose: "LoginMfa",
          phoneNumber: method === "SMS" ? selectedChannel.value : "",
        });

        if (!challenge) {
          setFailMessage(
            "No se pudo iniciar la verificación MFA. Inténtalo de nuevo.",
          );
          return false;
        }

        const challengeWithDestination: RecoverPasswordResponse = {
          ...challenge,
          emailMasked:
            method === "Email"
              ? challenge.emailMasked ?? selectedChannel.value
              : challenge.emailMasked,
          phoneMasked:
            method === "SMS"
              ? challenge.phoneMasked ?? selectedChannel.value
              : challenge.phoneMasked,
        };

        setLookupData(mfaData.userName, options);
        setVerificationChallenge(challengeWithDestination, method, "LoginMfa");
        router.push("/login/recover-password/recovery-email/");
        return true;
      } finally {
        setMfaLoading(false);
      }
    },
    [
      clearRecoverPasswordState,
      recoverPassword,
      router,
      setLookupData,
      setVerificationChallenge,
    ],
  );

  const handleLogin = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    setFailMessage("");
    setMfaRequiredData(null);
    const currentLoginValues = {
      email: String(values.email ?? ""),
      password: String(values.password ?? ""),
    };

    try {
      await login(currentLoginValues);

      if (rememberStatus) {
        persistRemember(true, currentLoginValues.email, currentLoginValues.password);
        setRememberedEmail(currentLoginValues.email);
        setRememberedPassword(currentLoginValues.password);
      } else {
        persistRemember(false);
        setRememberedEmail("");
        setRememberedPassword("");
      }

      router.push("/main-page");
    } catch (error: unknown) {
      if (error instanceof LoginMfaRequiredError) {
        const options = (error.payload.availableMethods ?? []).filter((option) =>
          Boolean(option.value?.trim()),
        );
        const method = error.payload.defaultMethod ?? "Email";
        setFailMessage("");

        if (options.length === 1) {
          setMfaRequiredData(null);
          setSelectedMfaMethod(options[0].type);
          await startMfaChallenge(error.payload, options[0].type, options);
          return;
        }

        setMfaRequiredData(error.payload);
        setSelectedMfaMethod(method);
        return;
      }

      const appError = error as {
        response?: { data?: { error_Message?: string } };
        error_Message?: string;
        message?: string;
      };
      const messageError =
        appError?.response?.data?.error_Message ??
        appError?.error_Message ??
        appError?.message ??
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

  const handleLoginValuesChange = (values: Record<string, unknown>) => {
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

      if (availableChannels.length === 1) {
        const selectedMethod = availableChannels[0].type;
        const challenge = await recoverPassword({
          email,
          type: selectedMethod,
        });

        if (!challenge) {
          clearFlow();
          router.push("/login/recover-password/");
          return;
        }

        setVerificationChallenge(challenge, selectedMethod);
        clearRecoverPasswordState();
        router.push("/login/recover-password/recovery-email/");
        return;
      }

      router.push("/login/recover-password/verification-method/");
      return;
    }

    clearFlow();
    router.push("/login/recover-password/");
  };

  const handleSendMfaCode = async () => {
    if (!mfaRequiredData) {
      return;
    }
    await startMfaChallenge(mfaRequiredData, selectedMfaMethod, mfaOptions);
  };

  const handleBackToLoginFromMfa = () => {
    setMfaRequiredData(null);
    setFailMessage("");
    clearRecoverPasswordState();
  };

  return {
    rememberStatus,
    isLoading,
    mfaLoading,
    failMessage,
    loginFields,
    mfaRequiredData,
    selectedMfaMethod,
    mfaOptions,
    handleForgotPassword,
    handleLoginValuesChange,
    handleRemember,
    handleLogin,
    setSelectedMfaMethod,
    handleSendMfaCode,
    handleBackToLoginFromMfa,
  };
};

export default useLogin;

