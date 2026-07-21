"use client";

import React from "react";

import { Button } from "@/app/components/Button/Button";

import { preRequisitionStyles as styles } from "./styles";
import type { PreRequisitionsAuthorizationProps } from "./types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

/**
 * Renderiza el resumen de autorizacion para una prerequisicion.
 */
const PreRequisitionsAuthorization = ({
  title,
  fields,
  collaborators,
  rows,
  subtotal,
  total,
  note,
  totalHint,
  children,
  showActions = true,
  rejectDisabled = false,
  approveDisabled = false,
  onReject,
  onApprove,
}: PreRequisitionsAuthorizationProps) => {
  const calculatedSubtotal =
    subtotal ?? rows.reduce((sum, row) => sum + row.subtotal, 0);
  const calculatedTotal = total ?? calculatedSubtotal;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.divider} />
        </div>

        {showActions ? (
          <div className={styles.actions}>
            <Button
              hideIcon
              type="button"
              variant="outline"
              disabled={rejectDisabled}
              onClick={onReject}
            >
              Rechazar
            </Button>
            <Button
              hideIcon
              type="button"
              disabled={approveDisabled}
              onClick={onApprove}
            >
              Aprobar
            </Button>
          </div>
        ) : null}
      </header>

      <div className={styles.summaryCard}>
        <div className={styles.fieldsGrid}>
          {fields.map((field) => (
            <label key={`${field.label}-${field.value}`}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <span className={styles.fieldValue}>{field.value}</span>
            </label>
          ))}
        </div>
        {collaborators ? (
          <p className={styles.collaborators}>
            Colaboradores incluidos: {collaborators}
          </p>
        ) : null}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.conceptHeaderCell}>Concepto</th>
                <th className={styles.headerCell}>Viaticos nacionales</th>
                <th className={styles.headerCell}>Viaticos extranjeros</th>
                <th className={styles.headerCell}>Personas</th>
                <th className={styles.headerCell}>Dias</th>
                <th className={styles.headerCell}>Subtotal</th>
                <th className={styles.conceptHeaderCell}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={styles.bodyRow}>
                  <td className={styles.conceptCell}>{row.concept}</td>
                  <td className={styles.numberCell}>
                    {formatCurrency(row.nationalQuoted)}
                  </td>
                  <td className={styles.numberCell}>
                    {formatCurrency(row.foreignQuoted)}
                  </td>
                  <td className={styles.numberCell}>{row.people}</td>
                  <td className={styles.numberCell}>{row.days}</td>
                  <td className={styles.numberCell}>
                    {formatCurrency(row.subtotal)}
                  </td>
                  <td className={styles.observationCell}>
                    {row.observations ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totalsWrap}>
          <div className={styles.totals}>
            <div className={styles.totalLine}>
              <span>Subtotal</span>
              <span>{formatCurrency(calculatedSubtotal)}</span>
            </div>
            <div className={styles.totalLine}>
              <span>Total</span>
              <span>{formatCurrency(calculatedTotal)}</span>
            </div>
            {totalHint ? <p className={styles.hint}>{totalHint}</p> : null}
          </div>
        </div>

        {note ? <p className={styles.note}>{note}</p> : null}
      </div>

      {children}
    </section>
  );
};

export default PreRequisitionsAuthorization;
