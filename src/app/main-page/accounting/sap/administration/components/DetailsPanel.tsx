import React, { useEffect, useMemo, useState } from "react";

import clsx from "clsx";
import {
  classes as s,
  mobileclasses as ms,
} from "../../../invoices/validateinvoices/components/DetailsPanel/styles";
import { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import type { SelectOption } from "@/app/components/Select/types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import type { ExpenseTypeCatalog } from "@/app/mappings/billingdocuments/billingdocuments.types";

import { useSAPDetailsPanel } from "../../common/hooks/useSAPDetailsPanel";

type DetailItemRow = {
  id: string;
  jsonSapArrayIndex: number | null;
  satKey: string;
  description: string;
  sapInternalKey: string;
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
  row: DetailItemRow,
  options: SapOption[],
): SapOption | undefined => {
  const byInternalAndSat = options.find(
    (option) =>
      option.internalKey === row.sapInternalKey && option.satKey === row.satKey,
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
  operations = false,
  rejectType = true,
  reqisition,
  closeButtonDataTour,
  onJsonSapUpdated,
}) => {
  const {
    labels,
    expenseTypeCatalog,
    isMobile,
    isEditing,
    showEditConfirmation,
    setShowEditConfirmation,
    handleSave,
    handleUpdateJsonSapItem,
  } = useSAPDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });

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

    if (!Array.isArray((selected as any)?.conceptos)) return [];
    return (selected as any).conceptos.map((concept: any, idx: number) => {
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
        denomination: String(
          matched?.descriptionInternalKey ?? concept?.clavesat_description ?? "",
        ),
        ivaGroup: String(concept?.grupo_iva ?? toIvaGroup(matched, "")),
      };
    });
  }, [expenseTypeCatalog, selected]);

  const [sapSelectionByRow, setSapSelectionByRow] = useState<
    Record<string, string>
  >({});
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
      closeButtonDataTour={closeButtonDataTour}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      contentClassName="overflow-hidden flex flex-col"
      actionButton={
        <div
          className={clsx(
            "flex",
            isMobile ? "w-full flex-col gap-2" : "flex-row items-center gap-3",
          )}
        >
          {/* {currentPagePermissions?.canSendToSap && sendInvoiceToSap && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={handleSendToSap}
            >
              Subir a SAP
            </Button>
          )} */}
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
              data-tour="requisitions-detail-panel-xml"
            />
          )}
          {selected?.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected.pdf!, "_blank")}
              data-tour="requisitions-detail-panel-pdf"
            />
          )}
          {selected?.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              disabled={!selected.image}
              onClick={() => window.open(selected.image!, "_blank")}
              data-tour="requisitions-detail-panel-image"
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
                className={
                  isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan
                }
              >
                {labels?.left}
              </span>
            </div>
          )}

          {/* UUID */}
          <div className={isMobile ? ms.uuid : s.uuid}>{selected?.uuid}</div>

          {/* Fecha y hora de certificación */}
          <div className={isMobile ? ms.labelLine : s.labelLine}>
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className={isMobile ? ms.valueText : s.valueText}>
              {selected?.fecha}
            </span>
          </div>

          {/* RFCs */}
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

          {/* Conceptos / Tipos de gasto */}
          <div className={s.conceptsScroller}>
            <div className={s.sapRowsContainer}>
              {detailRows.map((row) => (
                <div key={row.id} className={s.sapRow}>
                  <div className={s.conceptItem}>
                    <div className={isMobile ? ms.labelLine : s.labelLine}>
                      CLAVE SAT:&nbsp;
                      <span className={isMobile ? ms.valueText : s.valueText}>
                        {row.satKey}
                      </span>
                    </div>
                    <div className={isMobile ? ms.labelLine : s.labelLine}>
                      DESC.:&nbsp;
                      <span className={isMobile ? ms.valueText : s.valueText}>
                        {row.description}
                      </span>
                    </div>
                  </div>
                  <div className={s.sapSelectBox}>
                    <Select
                      label="Clave SAP"
                      placeholder="Seleccione"
                      options={sapOptions}
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
                        const nextInternalKey = selectedOption?.internalKey ?? "";

                        setSapSelectionByRow((prev) => ({
                          ...prev,
                          [row.id]: nextValue,
                        }));
                        if (row.jsonSapArrayIndex == null || !nextInternalKey)
                          return;
                        const ok = await handleUpdateJsonSapItem(
                          row.jsonSapArrayIndex,
                          nextInternalKey,
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
                          return;
                        }
                        onJsonSapUpdated?.(selected?.billingdocument_id);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={ s.bottomSection}>
            {/* Divider */}
            <div className={s.divider} />

            {/* Desglose */}
            {!isEditing ? (
              <div className={isMobile ? ms.breakdownBox : s.breakdownBox}>
                <div className={s.breakdownRow}>
                  <span
                    className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                  >
                    SUBTOTAL:
                  </span>
                  <span
                    className={isMobile ? ms.breakdownValue : s.breakdownValue}
                  >
                    {selected?.subtotal}
                  </span>
                </div>
                <div className={s.breakdownRow}>
                  <span
                    className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                  >
                    TRASLADOS <br /> (IVA 16%):
                  </span>
                  <span
                    className={isMobile ? ms.breakdownValue : s.breakdownValue}
                  >
                    {selected?.iva}
                  </span>
                </div>
                <div className={s.breakdownRow}>
                  <span
                    className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                  >
                    TOTAL:
                  </span>
                  <span
                    className={isMobile ? ms.breakdownValue : s.breakdownValue}
                  >
                    {selected?.total}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* Editar Información */}
          {/* <div className={s.editInformationBox}>
            {!isEditing ? (
              <Button
                hideIcon
                size="medium"
                variant="solid"
                onClick={() => setIsEditing(true)}
              >
                Editar Información
              </Button>
            ) : (
              <div className={clsx("flex flex-col")}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className={s.breakdownLabel}>SUBTOTAL:</label>
                    <input
                      type="text"
                      name="subtotal"
                      value={formValues.subtotal}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex items-center justify-between">
                    <label className={s.breakdownLabel}>IVA:</label>
                    <input
                      type="text"
                      name="iva"
                      value={formValues.iva}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex items-center justify-between">
                    <label className={s.breakdownLabel}>TOTAL:</label>
                    <input
                      type="text"
                      name="total"
                      value={formValues.total}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    hideIcon
                    size="medium"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    hideIcon
                    size="medium"
                    variant="solid"
                    onClick={() => setShowEditConfirmation(true)}
                  >
                    Guardar Información
                  </Button>
                </div>
              </div>
            )}
          </div> */}
        </div>
      ) : (
        <div className={s.emptyState}>
          Selecciona un registro para ver el detalle.
        </div>
      )}

      {/* PopUp: Validar */}
      <PopUp
        open={showEditConfirmation}
        title="Monto Editado"
        content="Desea confirmar el nuevo monto"
        onClose={() => setShowEditConfirmation(false)}
        primaryButtonText="Confirmar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={() => {
          handleSave();
          setShowEditConfirmation(false);
        }}
        onSecondaryButtonClick={() => setShowEditConfirmation(false)}
        showPrimaryButton
        showSecondaryButton
      />
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
