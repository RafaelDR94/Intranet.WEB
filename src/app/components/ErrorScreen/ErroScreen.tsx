'use client';
import React from 'react';
import clsx from 'clsx';
import * as styles from './styles';
import { ErrorScreenProps } from './types';
const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

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

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className="mb-4">
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.message}>{message}</p>
          </div>

          {showDetails && (error || stack || componentStack) && (
            <div className={styles.detailsWrapper}>
              {error?.message && (
                <div>
                  <h2 className={styles.detailsTitle}>Mensaje</h2>
                  <pre className={styles.detailsPre}>{error.message}</pre>
                </div>
              )}
              {stack && (
                <div>
                  <h2 className={styles.detailsTitle}>Stack</h2>
                  <pre className={styles.detailsPre}>{stack}</pre>
                </div>
              )}
              {componentStack && (
                <div>
                  <h2 className={styles.detailsTitle}>Component Stack</h2>
                  <pre className={styles.detailsPre}>{componentStack}</pre>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={goHome} className={styles.primaryBtn}>
              Ir al inicio
            </button>
            <button onClick={retry} className={styles.secondaryBtn}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
