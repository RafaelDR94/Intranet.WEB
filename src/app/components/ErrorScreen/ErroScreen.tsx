'use client';
import clsx from 'clsx';
import React from 'react';

import * as styles from './styles';
import { ErrorScreenProps } from './types';

const isProd =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback para navegadores muy viejos
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Algo salió mal',
  message = 'Se produjo un error inesperado. Puedes volver al inicio o intentar recargar.',
  error,
  stack,
  componentStack,
  onGoHome,
  onRetry,
  className,
  forceShowDetails = false,
}) => {
  const showDetails = !isProd || forceShowDetails;

  const goHome = () => {
    if (onGoHome) return onGoHome();
    window.location.assign('/');
  };

  const retry = () => {
    if (onRetry) return onRetry();
    window.location.reload();
  };

  const canShowMessage = Boolean(error?.message);
  const canShowStack = Boolean(stack);
  const canShowComponentStack = Boolean(componentStack);

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className="mb-4">
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.message}>{message}</p>
          </div>

          <div className={styles.actions}>
            <button onClick={goHome} className={styles.primaryBtn}>
              Ir al inicio
            </button>
            <button onClick={retry} className={styles.secondaryBtn}>
              Reintentar
            </button>
          </div>

          {showDetails && (canShowMessage || canShowStack || canShowComponentStack) && (
            <div className={styles.detailsWrapper}>
              {canShowMessage && (
                <div>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.detailsTitle}>Mensaje</h2>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => copyToClipboard(error!.message)}
                      aria-label="Copiar mensaje de error"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className={styles.detailsPre}>{error!.message}</pre>
                </div>
              )}

              {canShowStack && (
                <div>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.detailsTitle}>Stack</h2>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => copyToClipboard(stack!)}
                      aria-label="Copiar stack"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className={styles.detailsPre}>{stack}</pre>
                </div>
              )}

              {canShowComponentStack && (
                <div>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.detailsTitle}>Component Stack</h2>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => copyToClipboard(componentStack!)}
                      aria-label="Copiar component stack"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className={styles.detailsPre}>{componentStack}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
