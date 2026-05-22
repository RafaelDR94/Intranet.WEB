import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";

import { useDetailsPanel } from "./hooks/useDetailsPanel";
import { classes as s, mobileclasses as ms } from "./styles";
import { DetailsPanelProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import type { SelectOption } from "@/app/components/Select/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { ExpenseTypeCatalog } from "@/app/mappings/billingdocuments/billingdocuments.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { usePathname } from "next/navigation";

type SatDetailItemRow = {
  id: string;
  jsonSapArrayIndex: number;
  satKey: string;
  description: string;
  sapInternalKey: string;
  amount: string;
  taxAmount: string;
  taxCode: string;
  taxRate: string;
};

type ExpenseDetailRow = {
  id: string;
  satKey: string;
  expenseType: string;
  denomination: string;
  ivaGroup: string;
};

type SapOption = SelectOption & {
  internalKey: string;
  satKey: string;
};

const toSapOptions = (catalog: ExpenseTypeCatalog[]): SapOption[] =>
  catalog.map((item) => ({
    label: `${String(item.internalKey)}-${String(item.descriptionInternalKey ?? "")}`,
    value: String(item.id),
    internalKey: String(item.internalKey),
    satKey: String(item.satKey),
  }));

const findMatchingSapOption = (
  row: Pick<SatDetailItemRow, "sapInternalKey" | "satKey">,
  options: SapOption[],
): SapOption | undefined => {
  const byInternalAndSat = options.find(
    (option) =>
      option.internalKey === row.sapInternalKey &&
      option.satKey === row.satKey,
  );
  if (byInternalAndSat) return byInternalAndSat;

  return options.find((option) => option.internalKey === row.sapInternalKey);
};

const amountPattern = /^\d+(\.\d+)?$/;

const toAmountInputValue = (value: string) => value.trim();

const parseAmountInput = (value: string): string | null => {
  const trimmedValue = value.trim();
  if (!amountPattern.test(trimmedValue)) return null;
  return trimmedValue;
};

const toReadonlyValue = (value: string) => value.trim() || "-";

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  onlyText = false,
  validInvoice = true,
  rejectInvoice = true,
  sendInvoiceToSap = false,
  operations = false,
  rejectType = true,
  reqisition,
  onSendToSap,
  allowSendToSapAction,
  documentLabel = "Factura",
  onJsonSapUpdated,
}) => {
  const {
    labels,
    expenseTypeCatalog,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitComment,
    handleUpdateJsonSapItem,
    handleSubmitReject,
    handleSubmitValid,
  } = useDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
    documentLabel: documentLabel.toLowerCase(),
    onJsonSapUpdated,
  });

  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isSatRoute =
    pathname?.includes("/main-page/accounting/invoices/sat") ||
    pathname?.includes("/main-page/accounting/sap/administration") ||
    pathname?.includes("/main-page/accounting/sap/operations");
  const canShowSendToSapAction =
    allowSendToSapAction ?? currentPagePermissions?.canSendToSap;
  const satClasses = isMobile ? ms : s;

  const satDetailRows = useMemo<SatDetailItemRow[]>(() => {
    if (!selected) return [];

    const catalog = Array.isArray(expenseTypeCatalog) ? expenseTypeCatalog : [];
    const findByInternalKey = (key: string) =>
      catalog.find((item) => String(item.internalKey) === String(key));
    const findBySatKey = (key: string) =>
      catalog.find((item) => String(item.satKey) === String(key));

    const jsonSapItems = selected?.json_sap?.items;
    if (!Array.isArray(jsonSapItems) || jsonSapItems.length === 0) return [];

    return jsonSapItems.map((item, idx) => {
      const byInternal = findByInternalKey(String(item?.claveInterna ?? ""));
      const bySat = findBySatKey(String(item?.claveProdServ ?? ""));
      const matched = byInternal ?? bySat;

      return {
        id: String(item?.itemIndex ?? idx),
        jsonSapArrayIndex: idx,
        satKey: String(item?.claveProdServ ?? ""),
        description: String(item?.descripcion ?? ""),
        sapInternalKey: String(item?.claveInterna ?? matched?.internalKey ?? ""),
        amount: String(item?.importe ?? ""),
        taxAmount: String(item?.importeImpuesto ?? ""),
        taxCode: String(item?.impuesto ?? ""),
        taxRate: String(item?.tasaCuota ?? ""),
      };
    });
  }, [expenseTypeCatalog, selected]);

  const expenseDetailRows = useMemo<ExpenseDetailRow[]>(() => {
    if (!selected?.conceptos) return [];

    const catalog = Array.isArray(expenseTypeCatalog) ? expenseTypeCatalog : [];
    const findByInternalKey = (key: string) =>
      catalog.find((item) => String(item.internalKey) === String(key));
    const findBySatKey = (key: string) =>
      catalog.find((item) => String(item.satKey) === String(key));
    const toIvaGroup = (catalogItem?: ExpenseTypeCatalog, fallback = "") =>
      catalogItem?.iva != null && Number.isFinite(catalogItem.iva)
        ? `${catalogItem.iva}%`
        : fallback;

    return selected.conceptos.map((concept, idx) => {
      const byInternal = findByInternalKey(String(concept?.tipo_gasto ?? ""));
      const bySat = findBySatKey(String(concept?.clave_sat ?? ""));
      const matched = byInternal ?? bySat;

      return {
        id: `${concept?.clave_sat ?? "concept"}-${idx}`,
        satKey: String(concept?.clave_sat ?? ""),
        expenseType: String(concept?.tipo_gasto ?? matched?.gtStype ?? ""),
        denomination: String(
          matched?.descriptionInternalKey ?? concept?.clavesat_description ?? "",
        ),
        ivaGroup: String(concept?.grupo_iva ?? toIvaGroup(matched, "")),
      };
    });
  }, [expenseTypeCatalog, selected?.conceptos]);

  const sapOptions = useMemo(
    () =>
      toSapOptions(
        Array.isArray(expenseTypeCatalog) ? expenseTypeCatalog : [],
      ),
    [expenseTypeCatalog],
  );

  const [sapSelectionByRow, setSapSelectionByRow] = useState<Record<string, string>>({});
  const [amountInputsByRow, setAmountInputsByRow] = useState<Record<string, string>>({});
  const [persistedAmountsByRow, setPersistedAmountsByRow] = useState<Record<string, string>>({});

  const getAmountInputValue = (row: SatDetailItemRow) =>
    amountInputsByRow[row.id] ?? toAmountInputValue(row.amount);

  const hasMissingSapInternalKey = useMemo(
    () =>
      satDetailRows.some((row) => {
        const selectedOptionValue = sapSelectionByRow[row.id];
        if (selectedOptionValue) {
          const selectedOption = sapOptions.find(
            (option) => option.value === selectedOptionValue,
          );
          return !String(selectedOption?.internalKey ?? "").trim();
        }

        return !String(row.sapInternalKey ?? "").trim();
      }),
    [sapOptions, sapSelectionByRow, satDetailRows],
  );

  const hasInvalidAmount = useMemo(
    () =>
      satDetailRows.some(
        (row) => parseAmountInput(getAmountInputValue(row)) == null,
      ),
    [amountInputsByRow, satDetailRows],
  );

  const isSendToSapDisabled = hasMissingSapInternalKey || hasInvalidAmount;

  useEffect(() => {
    const nextSelections: Record<string, string> = {};
    satDetailRows.forEach((row) => {
      const matched = findMatchingSapOption(row, sapOptions);
      if (matched) nextSelections[row.id] = matched.value;
    });
    setSapSelectionByRow(nextSelections);
  }, [sapOptions, satDetailRows]);

  useEffect(() => {
    const nextAmounts: Record<string, string> = {};
    satDetailRows.forEach((row) => {
      nextAmounts[row.id] = toAmountInputValue(row.amount);
    });
    setAmountInputsByRow(nextAmounts);
  }, [satDetailRows]);

  useEffect(() => {
    const nextAmounts: Record<string, string> = {};
    satDetailRows.forEach((row) => {
      nextAmounts[row.id] = toAmountInputValue(row.amount);
    });
    setPersistedAmountsByRow(nextAmounts);
  }, [satDetailRows]);

  const commitAmountChange = async (row: SatDetailItemRow) => {
    const nextAmountValue = getAmountInputValue(row);
    const normalizedAmount = parseAmountInput(nextAmountValue);
    if (normalizedAmount == null) return false;

    const lastSavedAmount =
      persistedAmountsByRow[row.id] ?? toAmountInputValue(row.amount);

    if (normalizedAmount === lastSavedAmount) {
      setAmountInputsByRow((prev) => ({
        ...prev,
        [row.id]: normalizedAmount,
      }));
      return true;
    }

    const ok = await handleUpdateJsonSapItem(row.jsonSapArrayIndex, {
      importe: normalizedAmount,
    });

    if (ok) {
      setPersistedAmountsByRow((prev) => ({
        ...prev,
        [row.id]: normalizedAmount,
      }));
      setAmountInputsByRow((prev) => ({
        ...prev,
        [row.id]: normalizedAmount,
      }));
      return true;
    }

    setAmountInputsByRow((prev) => ({
      ...prev,
      [row.id]: lastSavedAmount,
    }));
    return false;
  };

  const breakdownRows = [
    { label: "SUBTOTAL:", value: selected?.subtotal },
    { label: "TRASLADOS 002 (IVA 16%):", value: selected?.iva },
    ...(Number(selected?.otherinvoices ?? 0) > 0
      ? [{ label: "OTROS IMPUESTOS:", value: selected?.otherinvoices }]
      : []),
    { label: "TOTAL:", value: selected?.total },
  ];

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      contentClassName="overflow-y-auto flex flex-col"
      actionButton={
        <div
          className={clsx(
            "flex",
            isMobile ? "flex-col w-full gap-2 " : "flex-row items-center gap-3",
          )}
        >
          {currentPagePermissions?.canValidInvoice && validInvoice && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={() => setOpenValidInvoice(true)}
              disabled={
                (operations && selected?.validatedbyoperations) ||
                selected?.status?.toUpperCase() == "RECHAZADO"
              }
            >
              {`Validar ${documentLabel}`}
            </Button>
          )}
          {canShowSendToSapAction && sendInvoiceToSap && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={() => onSendToSap?.()}
              disabled={isSendToSapDisabled}
            >
              Enviar a SAP
            </Button>
          )}
          {currentPagePermissions?.canRejectInvoice && rejectInvoice && (
            <Button
              size="small"
              variant="outline"
              hideIcon
              onClick={() => setOpenRejectInvoice(true)}
              disabled={
                (operations && selected?.validatedbyoperations) ||
                selected?.status?.toUpperCase() == "RECHAZADO"
              }
            >
              {`Rechazar ${documentLabel}`}
            </Button>
          )}
        </div>
      }
      renderActions={() => (
        <div className={s.actionsRow}>
          {selected?.xml && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={XMLIcon}
              disabled={!selected.xml}
              onClick={() => window.open(selected.xml!, "_blank")}
            />
          )}
          {selected?.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected.pdf!, "_blank")}
            />
          )}
          {selected?.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected?.image, "_blank")}
            />
          )}
        </div>
      )}
    >
      {selected ? (
        <div className={isMobile ? ms.container : s.container}>
          {isMobile && (
            <div className="flex items-baseline gap-2">
              <span className={isMobile ? ms.requisitionkey : s.requisitionkey}>
                Nombre:
              </span>
              <span
                className={isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan}
              >
                {labels?.left}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className={isMobile ? ms.requisitionkey : s.requisitionkey}>
              Codigo de Solicitud:
            </span>
            <span
              className={isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan}
            >
              {selected?.requisition?.requisitionkey}
            </span>
          </div>

          <div className={isMobile ? ms.uuid : s.uuid}>{selected?.uuid}</div>

          <div className={isMobile ? ms.labelLine : s.labelLine}>
            FECHA Y HORA DE CERTIFICACION:&nbsp;
            <span className={isMobile ? ms.valueText : s.valueText}>
              {selected?.fecha}
            </span>
          </div>

          <div className={s.sectionTopMargin}>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC EMISOR:&nbsp;
              <span className={isMobile ? ms.valueText : s.valueText}>
                {String(selected?.rfc_emisor)}
              </span>
            </div>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC RECEPTOR:&nbsp;
              <span className={isMobile ? ms.valueText : s.valueText}>
                {String(selected?.rfc_receptor)}
              </span>
            </div>
          </div>

          <div className={s.conceptsScroller}>
            {isSatRoute ? (
              satDetailRows.length > 0 ? (
                <div className={satClasses.satRowsContainer}>
                  {satDetailRows.map((row) => {
                    const amountValue = getAmountInputValue(row);
                    const amountIsValid = parseAmountInput(amountValue) != null;

                    return (
                      <div key={row.id} className={satClasses.satItemBlock}>
                        <div className={satClasses.satItemContent}>
                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>DESCRIPCION:</div>
                            <div className={satClasses.satDescriptionValue}>
                              {row.description || "-"}
                            </div>
                          </div>

                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>IMPORTE:</div>
                            <div className={satClasses.satRightField}>
                              <div className={satClasses.currencyField}>
                                <span className={satClasses.currencyPrefix}>$</span>
                                <Input
                                  inputMode="decimal"
                                  value={amountValue}
                                  variant={amountIsValid ? "default" : "error"}
                                  className={satClasses.moneyInput}
                                  onChange={(event) =>
                                    setAmountInputsByRow((prev) => ({
                                      ...prev,
                                      [row.id]: event.target.value,
                                    }))
                                  }
                                  onBlur={async () => {
                                    await commitAmountChange(row);
                                  }}
                                  onKeyDown={async (event) => {
                                    if (event.key !== "Enter") return;
                                    event.preventDefault();
                                    const ok = await commitAmountChange(row);
                                    if (ok) {
                                      (event.currentTarget as HTMLInputElement).blur();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>Impuesto:</div>
                            <div className={satClasses.satRightField}>
                              <Input
                                value={toReadonlyValue(row.taxCode)}
                                disabled
                                className={satClasses.readonlyInput}
                              />
                            </div>
                          </div>

                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>TasaCuota:</div>
                            <div className={satClasses.satRightField}>
                              <Input
                                value={toReadonlyValue(row.taxRate)}
                                disabled
                                className={satClasses.readonlyInput}
                              />
                            </div>
                          </div>

                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>ImporteImpuesto:</div>
                            <div className={satClasses.satRightField}>
                              <div className={satClasses.currencyField}>
                                <span className={satClasses.currencyPrefix}>$</span>
                                <Input
                                  value={toReadonlyValue(row.taxAmount)}
                                  disabled
                                  className={satClasses.readonlyMoneyInput}
                                />
                              </div>
                            </div>
                          </div>

                          <div className={satClasses.satLine}>
                            <div className={satClasses.satLineLabel}>
                              CLAVE SAT:{" "}
                              <span className={satClasses.satLineValue}>
                                {row.satKey || "-"}
                              </span>
                            </div>
                            <div className={satClasses.satRightFieldStack}>
                              <span className={satClasses.satFieldCaption}>Clave SAP</span>
                              <Select
                                placeholder="Sin clave"
                                options={sapOptions}
                                triggerClassName={satClasses.sapSelectTrigger}
                                selected={
                                  sapSelectionByRow[row.id]
                                    ? [sapSelectionByRow[row.id]]
                                    : []
                                }
                                onChange={async (values) => {
                                  const nextValue = values[0] ?? "";
                                  const selectedOption = sapOptions.find(
                                    (option) => option.value === nextValue,
                                  );
                                  const nextInternalKey =
                                    selectedOption?.internalKey ?? "";

                                  setSapSelectionByRow((prev) => ({
                                    ...prev,
                                    [row.id]: nextValue,
                                  }));

                                  if (!nextInternalKey) return;

                                  const ok = await handleUpdateJsonSapItem(
                                    row.jsonSapArrayIndex,
                                    { claveInterna: nextInternalKey },
                                  );

                                  if (!ok) {
                                    const fallback = findMatchingSapOption(
                                      row,
                                      sapOptions,
                                    );
                                    setSapSelectionByRow((prev) => ({
                                      ...prev,
                                      [row.id]: fallback?.value ?? "",
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={s.emptyState}>
                  No hay items de JSON SAP para mostrar.
                </div>
              )
            ) : (
              <div className={s.expenseTable}>
                <div className={s.expenseHeaderRow}>
                  <span className={s.expenseHeader}>CLAVE SAT</span>
                  <span className={s.expenseHeader}>Tipo de Gasto</span>
                  <span className={s.expenseHeader}>Denom. Gto.</span>
                  <span className={s.expenseHeader}>Grupo IVA</span>
                </div>
                {expenseDetailRows.map((row) => (
                  <div key={row.id} className={s.expenseDataRow}>
                    <span className={s.expenseCell}>{row.satKey}</span>
                    <span className={s.expenseCell}>{row.expenseType}</span>
                    <span className={s.expenseCell}>{row.denomination}</span>
                    <span className={s.expenseCell}>{row.ivaGroup}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={s.bottomSection}>
            <div className={s.divider} />

            <div className={isMobile ? ms.breakdownBoxCompact : s.breakdownBoxCompact}>
              {breakdownRows.map((row) => (
                <div key={row.label} className={s.breakdownRow}>
                  <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                    {row.label}
                  </span>
                  <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {selected.user_comments && (
              <div className="space-y-1">
                <div className="text-gray-90 text-b4 font-medium">
                  Comentarios en Factura:
                </div>
                <p className="text-gray-50 text-b4 font-medium p-2">
                  {selected.user_comments || "-"}
                </p>
              </div>
            )}

            <CollapsibleSection
              title={onlyText ? "Comentario" : "Deja un comentario"}
              defaultOpen={false}
              showDivider={false}
              enableCollapse={!onlyText}
            >
              <div className={s.commentBoxPadding}>
                {currentPagePermissions?.canAddComment && (
                  <DynamicForm
                    fields={[
                      {
                        type: "textarea",
                        name: "comments",
                        label: "Comentarios:",
                        value: selected?.comments,
                        placeholder: "Agregar comentario",
                        validations: [{ type: "required" }],
                        className: "bg-white-40",
                        onlyText: onlyText,
                      },
                    ]}
                    showSubmitIf={() => !onlyText}
                    submitLabel="Guardar Comentario"
                    onSubmit={handleSubmitComment}
                  />
                )}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      ) : (
        <div className={s.emptyState}>Selecciona un registro para ver el detalle.</div>
      )}

      <PopUp
        open={openValidInvoice}
        title={`¿Desea validar el ${documentLabel.toLowerCase()} seleccionado?`}
        content="Esta accion confirmara la validez de los documentos marcados. Una vez validadas, no podras revertir el cambio."
        onClose={() => setOpenValidInvoice(false)}
        primaryButtonText="Validar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleSubmitValid}
        onSecondaryButtonClick={() => setOpenValidInvoice(false)}
        showPrimaryButton
        showSecondaryButton
      />

      <PopUp
        title={`Rechazar ${documentLabel}`}
        content={`Deja aqui un comentario para que tu companero sepa la razon del rechazo de su ${documentLabel.toLowerCase()}`}
        open={openRejectInvoice}
        onClose={() => setOpenRejectInvoice(false)}
      >
        <div className={s.commentBoxPadding}>
          <DynamicForm
            fields={[
              {
                type: "textarea",
                name: "comments",
                label: "Comentarios:",
                value: "",
                placeholder: "Agregar comentario",
                validations: [{ type: "required" }],
                className: "bg-white-40",
                rows: 2,
              },
            ]}
            submitLabel="Rechazar"
            secondaryButtonLabel="Cancelar"
            onSubmit={handleSubmitReject}
            onSecondaryButtonClick={() => setOpenRejectInvoice(false)}
          />
        </div>
      </PopUp>
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
