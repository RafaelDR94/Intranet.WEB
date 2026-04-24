"use client";

import clsx from "clsx";

import { Alert } from "@/app/components/Alert/Alert";
import { Spinner } from "@/app/components/Spinner/Spinner";
import AuthSplitLayout from "@/app/login/components/AuthSplitLayout";
import { loginStyles } from "@/app/login/styles";
import CheckIcon from "@/assets/icons/acciones/check.svg";
import EyeOpenIcon from "@/assets/icons/acciones/eye-alt.svg";
import EyeClosedIcon from "@/assets/icons/acciones/eye-close.svg";

import useChangePassword from "../../../hooks/useChangePassword/useChangePassword";
import { recoverNewPasswordStyles as styles } from "./styles";

const RecoverPassword = () => {
  const {
    newPassword,
    confirmPassword,
    isLoading,
    isSuccess,
    successMessage,
    submitError,
    showNewPassword,
    showConfirmPassword,
    requirements,
    canSubmit,
    setNewPassword,
    setConfirmPassword,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    handleGoToLogin,
  } = useChangePassword();

  if (isSuccess) {
    return (
      <AuthSplitLayout>
        <div className={styles.successPanel}>
          <div className={styles.successIconWrap}>
            <CheckIcon className="size-8 sm:size-9" />
          </div>
          <h1 className={styles.successTitle}>¡Contraseña actualizada!</h1>
          <p className={styles.successText}>
            {successMessage ||
              "Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."}
          </p>
          <button
            type="button"
            className={clsx(styles.submitButton, styles.submitEnabled)}
            onClick={handleGoToLogin}
          >
            Ir a inicio de sesión
          </button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      header={
        <div className={loginStyles.header}>
          <h1 className={loginStyles.title}>Nueva contraseña</h1>
          <p className={loginStyles.subtitle}>Crear contraseña segura</p>
        </div>
      }
    >
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="new-password">
              Nueva contraseña
            </label>
            <div className={styles.inputShell}>
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className={styles.input}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Escribir nueva contraseña"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={toggleNewPasswordVisibility}
                aria-label={
                  showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeClosedIcon className="size-5" />
                ) : (
                  <EyeOpenIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          <div className={styles.requirements}>
            <p className={styles.requirementsTitle}>La contraseña debe cumplir:</p>
            {requirements.map((requirement) => {
              const hasStarted = newPassword.length > 0;
              const toneClass = !hasStarted
                ? styles.requirementNeutral
                : requirement.satisfied
                  ? styles.requirementValid
                  : styles.requirementInvalid;
              const iconToneClass = !hasStarted
                ? styles.requirementNeutralIcon
                : requirement.satisfied
                  ? styles.requirementValidIcon
                  : styles.requirementInvalidIcon;

              return (
                <div
                  key={requirement.id}
                  className={clsx(styles.requirementRow, toneClass)}
                >
                  <span className={clsx(styles.requirementIcon, iconToneClass)}>
                    {!hasStarted ? (
                      <span className="text-base leading-none">&rsaquo;</span>
                    ) : requirement.satisfied ? (
                      <CheckIcon className="size-5" />
                    ) : (
                      <span className="text-base leading-none">&times;</span>
                    )}
                  </span>
                  <span>{requirement.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="confirm-password">
              Confirmar contraseña
            </label>
            <div className={styles.inputShell}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={styles.input}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeClosedIcon className="size-5" />
                ) : (
                  <EyeOpenIcon className="size-5" />
                )}
              </button>
            </div>
          </div>

          {submitError && (
            <Alert
              type="error"
              variant="subtle"
              title="No se pudo restablecer la contraseña"
              description={submitError}
              showPrimaryButton={false}
              showSecondaryButton={false}
            />
          )}

          <button
            type="button"
            className={clsx(
              styles.submitButton,
              canSubmit ? styles.submitEnabled : styles.submitDisabled,
            )}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="small" />
                Restableciendo
              </span>
            ) : (
              "Restablecer contraseña"
            )}
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default RecoverPassword;
