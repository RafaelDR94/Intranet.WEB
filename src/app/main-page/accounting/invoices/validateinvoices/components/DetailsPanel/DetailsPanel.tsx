// File: /app/components/DetailsPanel/DetailsPanel.tsx
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
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import type { SelectOption } from "@/app/components/Select/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { ExpenseTypeCatalog } from "@/app/mappings/billingdocuments/billingdocuments.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import { usePathname } from "next/navigation";

type DetailItemRow = {
  id: string
  jsonSapArrayIndex: number | null
  satKey: string
  description: string
  sapInternalKey: string
  expenseType: string
  denomination: string
  ivaGroup: string
}

type SapOption = SelectOption & {
  internalKey: string
  satKey: string
}

const toSapOptions = (catalog: ExpenseTypeCatalog[]): SapOption[] =>
  catalog.map((item) => ({
    label: `${String(item.internalKey)}-${String(item.descriptionInternalKey ?? "")}`,
    value: String(item.id),
    internalKey: String(item.internalKey),
    satKey: String(item.satKey),
  }));

const findMatchingSapOption = (
  row: DetailItemRow,
  options: SapOption[],
): SapOption | undefined => {
  const byInternalAndSat = options.find(
    (option) =>
      option.internalKey === row.sapInternalKey &&
      option.satKey === row.satKey,
  );
  if (byInternalAndSat) return byInternalAndSat;

  const byInternal = options.find(
    (option) => option.internalKey === row.sapInternalKey,
  );
  if (byInternal) return byInternal;

  return undefined;
};

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
  documentLabel = "Factura",
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
  });

  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isSatRoute = pathname?.includes("/main-page/accounting/invoices/sat");

  const detailRows = useMemo<DetailItemRow[]>(() => {
    if (!selected) return [];

    const catalog = Array.isArray(expenseTypeCatalog) ? expenseTypeCatalog : [];
    const findByInternalKey = (key: string) =>
      catalog.find((item) => String(item.internalKey) === String(key));
    const findBySatKey = (key: string) =>
      catalog.find((item) => String(item.satKey) === String(key));
    const toIvaGroup = (catalogItem?: ExpenseTypeCatalog, fallback = "") =>
      catalogItem?.iva != null && Number.isFinite(catalogItem.iva)
        ? `${catalogItem.iva}%`
        : fallback;

    const jsonSapItems = (selected as any)?.json_sap?.items;
    if (Array.isArray(jsonSapItems) && jsonSapItems.length > 0) {
      return jsonSapItems.map((item: any, idx: number) => {
        const byInternal = findByInternalKey(String(item?.claveInterna ?? ""));
        const bySat = findBySatKey(String(item?.claveProdServ ?? ""));
        const matched = byInternal ?? bySat;
        return {
          id: String(item?.itemIndex ?? idx),
          jsonSapArrayIndex: idx,
          satKey: String(item?.claveProdServ ?? ""),
          description: String(item?.descripcion ?? ""),
          sapInternalKey: String(item?.claveInterna ?? matched?.internalKey ?? ""),
          expenseType: String(matched?.gtStype ?? ""),
          denomination: String(matched?.descriptionInternalKey ?? ""),
          ivaGroup: toIvaGroup(matched, ""),
        };
      });
    }

    if (!Array.isArray(selected?.conceptos)) return [];
    return selected.conceptos.map((concept, idx) => {
      const byInternal = findByInternalKey(String(concept?.tipo_gasto ?? ""));
      const bySat = findBySatKey(String(concept?.clave_sat ?? ""));
      const matched = byInternal ?? bySat;
      return {
        id: `${concept?.clave_sat ?? "concept"}-${idx}`,
        jsonSapArrayIndex: null,
        satKey: String(concept?.clave_sat ?? ""),
        description: String(concept?.clavesat_description ?? ""),
        sapInternalKey: String(concept?.tipo_gasto ?? matched?.internalKey ?? ""),
        expenseType: String(concept?.tipo_gasto ?? matched?.gtStype ?? ""),
        denomination: String(matched?.descriptionInternalKey ?? concept?.clavesat_description ?? ""),
        ivaGroup: String(concept?.grupo_iva ?? toIvaGroup(matched, "")),
      };
    });
  }, [expenseTypeCatalog, selected]);

  const [sapSelectionByRow, setSapSelectionByRow] = useState<Record<string, string>>({});
  const sapOptions = useMemo(
    () =>
      toSapOptions(
        Array.isArray(expenseTypeCatalog) ? expenseTypeCatalog : [],
      ),
    [expenseTypeCatalog],
  );

  useEffect(() => {
    const nextSelections: Record<string, string> = {};
    detailRows.forEach((row) => {
      const matched = findMatchingSapOption(row, sapOptions);
      if (matched) nextSelections[row.id] = matched.value;
    });
    setSapSelectionByRow(nextSelections);
  }, [detailRows, sapOptions]);

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      actionButton={
        <div className={clsx(
          "flex",
          isMobile ? "flex-col w-full gap-2 " : "flex-row items-center gap-3"
        )}>
          {(currentPagePermissions?.canValidInvoice && validInvoice) && <Button size="small" variant="solid" hideIcon onClick={() => setOpenValidInvoice(true)} disabled={(operations && selected?.validatedbyoperations) || selected?.status?.toUpperCase() == "RECHAZADO"}>
            {`Validar ${documentLabel}`}
          </Button>}
          {(currentPagePermissions?.canSendToSap && sendInvoiceToSap) && <Button size="small" variant="solid" hideIcon onClick={() => onSendToSap?.()}>
            Enviar a SAP
          </Button>}
          {currentPagePermissions?.canRejectInvoice && rejectInvoice && <Button size="small" variant="outline" hideIcon onClick={() => setOpenRejectInvoice(true)} disabled={(operations && selected?.validatedbyoperations) || selected?.status?.toUpperCase() == "RECHAZADO"}>
            {`Rechazar ${documentLabel}`}
          </Button>}
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
          {isMobile &&
            <div className="flex items-baseline gap-2">

              <span className={isMobile ? ms.requisitionkey : s.requisitionkey}>Nombre:</span>
              <span className={isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan}>
                {labels?.left}
              </span>

            </div>
          }
          <div className="flex items-baseline gap-2">
            <span className={isMobile ? ms.requisitionkey : s.requisitionkey}>Código de Solicitud:</span>
            <span className={isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan}>
              {selected?.requisition?.requisitionkey}
            </span>
          </div>

          {/* UUID */}
          <div className={isMobile ? ms.uuid : s.uuid}>{selected?.uuid}</div>

          {/* Fecha y hora de certificación */}
          <div className={isMobile ? ms.labelLine : s.labelLine}>
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className={isMobile ? ms.valueText :s.valueText}>{selected?.fecha}</span>
          </div>

          {/* RFCs */}
          <div className={s.sectionTopMargin}>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC EMISOR:&nbsp;
              <span className={isMobile ? ms.valueText :s.valueText}>{String(selected?.rfc_emisor)}</span>
            </div>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC RECEPTOR:&nbsp;
              <span className={isMobile ? ms.valueText :s.valueText}>{String(selected?.rfc_receptor)}</span>
            </div>
          </div>

          {/* Conceptos / Tipos de gasto */}
          <div className={s.conceptsScroller}>
            {isSatRoute ? (
              <div className={s.sapRowsContainer}>
                {detailRows.map((row) => (
                  <div key={row.id} className={s.sapRow}>
                    <div className={s.conceptItem}>
                      <div className={isMobile ? ms.labelLine : s.labelLine}>
                        CLAVE SAT:&nbsp;
                        <span className={isMobile ? ms.valueText : s.valueText}>{row.satKey}</span>
                      </div>
                      <div className={isMobile ? ms.labelLine : s.labelLine}>
                        DESC.:&nbsp;
                        <span className={isMobile ? ms.valueText : s.valueText}>{row.description}</span>
                      </div>
                    </div>
                    <div className={s.sapSelectBox}>
                      <Select
                        label="Clave SAP"
                        placeholder="Seleccione"
                        options={sapOptions}
                        selected={sapSelectionByRow[row.id] ? [sapSelectionByRow[row.id]] : []}
                        onChange={async (values) => {
                          const nextValue = values[0] ?? "";
                          const selectedOption = sapOptions.find(
                            (option) => option.value === nextValue,
                          );
                          const nextInternalKey = selectedOption?.internalKey ?? "";

                          setSapSelectionByRow((prev) => ({
                            ...prev,
                            [row.id]: nextValue,
                          }));
                          if (row.jsonSapArrayIndex == null || !nextInternalKey) return;
                          const ok = await handleUpdateJsonSapItem(
                            row.jsonSapArrayIndex,
                            nextInternalKey,
                          );
                          if (!ok) {
                            const fallback = findMatchingSapOption(row, sapOptions);
                            setSapSelectionByRow((prev) => ({
                              ...prev,
                              [row.id]: fallback?.value ?? "",
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={s.expenseTable}>
                <div className={s.expenseHeaderRow}>
                  <span className={s.expenseHeader}>CLAVE SAT</span>
                  <span className={s.expenseHeader}>Tipo de Gasto</span>
                  <span className={s.expenseHeader}>Denom. Gto.</span>
                  <span className={s.expenseHeader}>Grupo IVA</span>
                </div>
                {detailRows.map((row) => (
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

          {/* Divider */}
          <div className={s.divider} />

          {/* Desglose */}
          <div className={isMobile ? ms.breakdownBox : s.breakdownBox}>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>SUBTOTAL:</span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>{selected?.subtotal}</span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>TRASLADOS 002 (IVA 16%):</span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>{selected?.iva}</span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>OTROS IMPUESTOS:</span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>{selected?.otherinvoices}</span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>TOTAL:</span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>{selected?.total}</span>
            </div>
          </div>
          {selected.user_comments &&
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">Comentarios en Factura:</div>
              <p className="text-gray-50 text-b4 font-medium p-2">
                {selected.user_comments || "—"}
              </p>
            </div>
          }
          {/* Comentarios */}
          <CollapsibleSection title={onlyText ? "Comentario" : "Deja un comentario"} defaultOpen={false} showDivider={false} enableCollapse={!onlyText}>
            <div className={s.commentBoxPadding}>
              {currentPagePermissions?.canAddComment && <DynamicForm

                fields={[
                  {
                    type: "textarea",
                    name: "comments",
                    label: "Comentarios:",
                    value: selected?.comments,
                    placeholder: "Agregar comentario",
                    validations: [{ type: "required" }],
                    className: "bg-white-40",
                    onlyText: onlyText
                  },
                ]}
                showSubmitIf={() => !onlyText}
                submitLabel="Guardar Comentario"
                onSubmit={handleSubmitComment}
              />}

            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div className={s.emptyState}>Selecciona un registro para ver el detalle.</div>
      )}

      {/* PopUp: Validar */}
      <PopUp
        open={openValidInvoice}
        title={`¿Desea validar el ${documentLabel.toLowerCase()} seleccionado?`}
        content="Esta acción confirmará la validez de los documentos marcados. Una vez validadas, no podrás revertir el cambio."
        onClose={() => setOpenValidInvoice(false)}
        primaryButtonText="Validar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleSubmitValid}
        onSecondaryButtonClick={() => setOpenValidInvoice(false)}
        showPrimaryButton
        showSecondaryButton
      />

      {/* PopUp: Rechazar */}
      <PopUp
        title={`Rechazar ${documentLabel}`}
        content={`Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su ${documentLabel.toLowerCase()}`}
        open={openRejectInvoice}
        onClose={() => setOpenRejectInvoice(false)}
      >
        <div className={s.commentBoxPadding}>
          <DynamicForm
            // initialValues={{ comments: selected?.comments ?? "" }}
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
