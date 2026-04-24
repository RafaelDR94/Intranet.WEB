"use client";

import {
  actionColumn,
  dangerAction,
  linkAction,
  outlineAction,
  panel,
  row,
  rowContent,
  rowDescription,
  rows,
  rowTitle,
  title,
  toggle,
  toggleThumb,
} from "./styles";

const MfaSecurityPanel = () => {
  return (
    <section className={panel}>
      <h2 className={title}>Autenticación de múltiples factores (MFA)</h2>

      <div className={rows}>
        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Mensaje de texto</h3>
            <p className={rowDescription}>
              Recibe códigos de verificación de 6 dígitos por SMS o WhatsApp
              según tu código de país
            </p>
          </div>

          <div className={actionColumn}>
            <div
              className={toggle}
              aria-hidden="true"
              data-testid="mfa-sms-toggle"
            >
              <span className={toggleThumb} />
            </div>
            <button type="button" className={linkAction}>
              Cambiar número
            </button>
          </div>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Dispositivos de confianza</h3>
            <p className={rowDescription}>
              Cuando inicies sesión en otro dispositivo, se añadirá aquí y podrá
              recibir automáticamente solicitudes de inicio de sesión en el
              dispositivo.
            </p>
          </div>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>Cerrar sesión en este dispositivo</h3>
          </div>

          <button type="button" className={outlineAction}>
            Cerrar sesión
          </button>
        </div>

        <div className={row}>
          <div className={rowContent}>
            <h3 className={rowTitle}>
              Cerrar sesión en todos los dispositivos
            </h3>
            <p className={rowDescription}>
              Cerrar sesión en todos los dispositivos con sesiones activas,
              incluida la actual. El cierre en otros dispositivos puede tardar
              hasta 30 minutos.
            </p>
          </div>

          <button type="button" className={dangerAction}>
            Cerrar todas las sesiones
          </button>
        </div>
      </div>
    </section>
  );
};

export default MfaSecurityPanel;
