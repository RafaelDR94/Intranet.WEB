"use client"
'use client';

import React from "react";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import Label from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import MailIcon from "@/assets/icons/Comunicacion/mail.svg";
import PhoneIcon from "@/assets/icons/Comunicacion/phone.svg";
import ProfileIcon from "@/assets/icons/Users/Users/profile-circle.svg";
import clsx from "clsx";

import { useShowDetails } from "./hooks/useShowDetails";
import type { InfoRowProps, ShowDetailsViewProps } from "./types";
import * as styles from "./styles";

const InfoRow = ({ icon, label, value, href, isMobile }: InfoRowProps) => (
  <div className={styles.infoRow.container}>
    <span className={styles.infoRow.iconWrapper}>{icon}</span>
    <div className="flex flex-col leading-tight">
      <dt
        className={clsx(
          isMobile ? styles.infoRow.labelMobile : styles.infoRow.labelDesktop,
          styles.infoRow.labelBase
        )}
      >
        {label}
      </dt>
      {href ? (
        <dd>
          <a
            className={clsx(
              isMobile ? styles.infoRow.valueMobile : styles.infoRow.valueDesktop,
              styles.infoRow.link
            )}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        </dd>
      ) : (
        <dd
          className={clsx(
            isMobile ? styles.infoRow.valueMobile : styles.infoRow.valueDesktop,
            styles.infoRow.value
          )}
        >
          {value}
        </dd>
      )}
    </div>
  </div>
);

const ShowDetailsView = ({
  employee,
  hasEmployee,
  initials,
  primaryNameLine,
  secondaryNameLine,
  companyName,
  position,
  employeeNumber,
  phoneNumber,
  email,
  departmentName,
  confirmToggleOpen,
  currentStatus,
  statusType,
  statusText,
  actionLabel,
  displayName,
  userId,
  openConfirmToggle,
  closeConfirmToggle,
  handleConfirmToggle,
  isMobile,
}: ShowDetailsViewProps) => {
  if (!hasEmployee || !employee) {
    return <div className={styles.placeholderWrapper}>Select an employee from the table to view details.</div>;
  }

  return (
    <section className={styles.section}>
      <article className={styles.layoutArticle}>
        <div className={styles.contentWrapper}>
          <header className={styles.headerWrapper}>
            <span
              className={clsx(
                isMobile ? styles.companyLabelMobile : styles.companyLabelDesktop,
                styles.companyLabelBase
              )}
            >
              {companyName}
            </span>
            <div className={styles.namesWrapper}>
              <div className={styles.namesStack}>
                <Avatar
                  src={employee.image_url}
                  initials={initials || undefined}
                  size={isMobile ? "lg" : "xl"}
                  online={false}
                  className={styles.avatarClassName}
                />
                <div className={styles.nameBlock}>
                  <h2
                    className={clsx(
                      isMobile ? styles.primaryNameMobile : styles.primaryNameDesktop,
                      styles.nameTitleBase
                    )}
                  >
                    {primaryNameLine}
                  </h2>
                  {secondaryNameLine && (
                    <h3
                      className={clsx(
                        isMobile ? styles.primaryNameMobile : styles.primaryNameDesktop,
                        styles.secondaryNameBase
                      )}
                    >
                      {secondaryNameLine}
                    </h3>
                  )}
                </div>
              </div>
            </div>
            <p
              className={clsx(
                isMobile ? styles.positionMobile : styles.positionDesktop,
                styles.positionBase
              )}
            >
              {position}
            </p>
          </header>

          <dl className={styles.detailsGrid}>
            <InfoRow
              icon={<ProfileIcon aria-hidden />}
              label="No. Empleado"
              value={employeeNumber}
              isMobile={isMobile}
            />
            <InfoRow
              icon={<PhoneIcon aria-hidden />}
              label="Telefono"
              value={phoneNumber}
              href={employee.phone_number ? `tel:${employee.phone_number}` : undefined}
              isMobile={isMobile}
            />
            <InfoRow
              icon={<MailIcon aria-hidden />}
              label="Correo"
              value={email}
              href={employee.email ? `mailto:${employee.email}` : undefined}
              isMobile={isMobile}
            />
            <InfoRow
              icon={<ProfileIcon aria-hidden />}
              label="Departamento"
              value={departmentName}
              isMobile={isMobile}
            />
          </dl>

          <footer className={styles.footerWrapper}>
            {employee.user && (
              <>
                <Label type={statusType} text={statusText} />
                <Button
                  size="small"
                  variant="solid"
                  hideIcon
                  onClick={openConfirmToggle}
                  disabled={!userId}
                  className={styles.statusButton}
                >
                  {actionLabel}
                </Button>
              </>
            )}
          </footer>
        </div>
      </article>

      <PopUp
        open={confirmToggleOpen}
        onClose={closeConfirmToggle}
        title={
          currentStatus
            ? `Deseas desactivar a ${displayName || "este usuario"}?`
            : `Deseas activar a ${displayName || "este usuario"}?`
        }
        content={
          currentStatus
            ? "El usuario no podra acceder hasta activarlo nuevamente."
            : "El usuario podra acceder nuevamente al sistema."
        }
        showPrimaryButton
        showSecondaryButton
        primaryButtonText={currentStatus ? "Desactivar" : "Activar"}
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleConfirmToggle}
      />
    </section>
  );
};

const ShowDetails: React.FC = () => {
  const viewModel = useShowDetails();
  const isMobile = useIsMobile();

  return <ShowDetailsView {...viewModel} isMobile={isMobile} />;
};

export default ShowDetails;
