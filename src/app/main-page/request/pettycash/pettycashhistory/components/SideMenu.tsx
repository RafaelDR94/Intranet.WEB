import { useMemo, useRef } from "react";

import VoucherBlue from "../../pettycashrequest/components/VoucherBlue/VoucherBlue";
import VoucherPink from "../../pettycashrequest/components/VoucherPink/VoucherPink";

import { SideMenuProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { PettyCashVoucherData } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";

function normalizeDateForInput(raw?: string): string {
  if (!raw) return "";

  const trimmed = raw.trim();
  if (!trimmed) return "";

  const isoLikeMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoLikeMatch) {
    return `${isoLikeMatch[1]}-${isoLikeMatch[2]}-${isoLikeMatch[3]}`;
  }

  const slashMatch = trimmed.match(
    /^(\d{1,2})\s*[-/]\s*(\d{1,2})\s*[-/]\s*(\d{4})$/,
  );

  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return "";
}

const SideMenu = ({
  panelOpen,
  setPanelOpen,
  selected,
  detail,
  isDetailLoading,
}: SideMenuProps) => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const { user } = useAuth();

  const voucherDataEdit = useMemo<PettyCashVoucherData | undefined>(() => {
    if (!selected) return undefined;

    const detailMatchesSelection =
      detail && detail.id === selected.id ? detail : null;
    const amountFromSelection =
      typeof selected.amount === "number" && !Number.isNaN(selected.amount)
        ? selected.amount
        : 0;

    return {
      id: detailMatchesSelection?.id ?? selected.id,
      petty_cash_funds_id: detailMatchesSelection?.petty_cash_funds?.id ?? "",
      employee_id: detailMatchesSelection?.employee_id ?? "",
      voucher_type:
        detailMatchesSelection?.voucher_type ??
        selected.voucherType ??
        selected.category?.name ??
        "",
      application_date: normalizeDateForInput(
        detailMatchesSelection?.application_date ??
          selected.certificationDate ??
          selected.dateCreate ??
          "",
      ),
      concept:
        detailMatchesSelection?.concept ?? selected.description?.name ?? "",
      amount: detailMatchesSelection?.amount ?? amountFromSelection,
      comments: detailMatchesSelection?.comments ?? selected.comments ?? "",
      project_id:
        detailMatchesSelection?.project?.id ?? selected.project?.id ?? "",
      xml: detailMatchesSelection?.xml ?? selected.xml ?? "",
      pdf: detailMatchesSelection?.pdf ?? selected.pdf ?? "",
    } satisfies PettyCashVoucherData;
  }, [detail, selected]);

  const isVoucherPinkVoucher = useMemo(() => {
    const rawVoucherType = voucherDataEdit?.voucher_type ?? "";
    const normalizedVoucherType = rawVoucherType
      .toString()
      .trim()
      .toLowerCase();
    return (
      normalizedVoucherType === "r" || normalizedVoucherType.includes("rosa")
    );
  }, [voucherDataEdit?.voucher_type]);

  const projectCode =
    detail?.project?.proyectkey ?? selected?.project?.proyectKey ?? "";
  const employeeName =
    detail?.employeename ?? selected?.employeeName ?? user?.fullName ?? "";
  const certificationDate =
    detail?.application_date ?? selected?.dateCreate ?? "";
  const voucherUuid = detail?.uuid ?? selected?.billingdocument_id ?? "";
  const comments = detail?.comments ?? selected?.comments ?? "";
  const rfcEmisor = detail?.rfc_emisor ?? "";
  const rfcReceptor = detail?.rfc_receptor ?? "";
  const subtotal = detail?.subtotal ?? "";
  const iva = detail?.iva ?? "";

  const amountValue =
    detail?.total ?? detail?.amount ?? selected?.total ?? selected?.amount ?? 0;

  const formattedAmount = useMemo(() => {
    if (typeof amountValue !== "number") return "—";
    if (Number.isNaN(amountValue)) return "—";
    return amountValue.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  }, [amountValue]);

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  const normalizedStatus = selected?.status?.toLocaleLowerCase().trim() ?? "";
  const isEditableStatus =
    normalizedStatus === "rechazado" ||
    normalizedStatus === "sin factura" ||
    normalizedStatus === "factura rechazada";

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      zIndex={80}
      renderActions={() => (
        <div className="flex">
          {selected && (
            <Label
              type={selected.statusLabelType}
              text={(selected?.status ?? "").toUpperCase()}
            />
          )}
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
        </div>
      )}
      onClose={() => setPanelOpen(false)}
      leftLabel={selected ? `Usuario: ${employeeName}` : undefined}
      rightLabel={selected ? `Proyecto: ${projectCode}` : undefined}
      actionButton={
        <Button
          size="medium"
          variant="solid"
          hideIcon
          onClick={() => submitRef.current?.()}
          disabled={!isEditableStatus}
        >
          Reenviar
        </Button>
      }
    >
      {selected ? (
        <div className="space-y-4">
          {isDetailLoading && (
            <div className="text-gray-70 text-b4">Cargando detalle...</div>
          )}

          {/* UUID */}
          <div className="text-gray-90 text-s1 font-semibold">
            {voucherUuid || "—"}
          </div>

          {/* Fecha */}
          <div className="text-gray-90 text-b4 font-medium">
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">
              {formatDate(certificationDate) || "—"}
            </span>
          </div>

          {/* RFC EMISOR */}
          <div className="text-gray-90 text-b4 font-medium">
            RFC EMISOR:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">
              {rfcEmisor || "—"}
            </span>
          </div>

          {/* RFC RECEPTOR */}
          <div className="text-gray-90 text-b4 font-medium">
            RFC RECEPTOR:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">
              {rfcReceptor || "—"}
            </span>
          </div>

          {/* Concepto */}
          <div className="text-gray-90 text-b4 font-medium">
            CONCEPTO:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">
              {detail?.concept ?? selected.description.name ?? "—"}
            </span>
          </div>

          {/* Monto */}
          <div className="text-gray-90 text-b4 font-medium">
            <div className="flex flex-col items-end">
              <p>
                SUBTOTAL:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  ${subtotal}
                </span>
              </p>
              <p>
                (IVA 16%):&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  ${iva}
                </span>
              </p>
              <p>
                TOTAL:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {formattedAmount}
                </span>
              </p>
            </div>
          </div>

          {/* Comentarios */}
          {comments && (
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">
                Comentarios:
              </div>
              <p className="text-b4 p-2 font-medium text-gray-50">
                {comments || "—"}
              </p>
            </div>
          )}
          {/* Editar Documento (como en la maqueta) */}

          <div>
            <div className="text-gray-90 text-b4 font-medium">
              Editar documento:
            </div>

            {/* Formulario */}
            {isVoucherPinkVoucher ? (
              <div>
                <VoucherPink
                  mode="edit"
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    lg: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                  }}
                  dataEdit={voucherDataEdit}
                  startDisabled={!isEditableStatus}
                  externalSubmitRef={submitRef}
                />
              </div>
            ) : (
              <div>
                <VoucherBlue
                  mode="edit"
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    lg: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                  }}
                  dataEdit={voucherDataEdit}
                  startDisabled={!isEditableStatus}
                  externalSubmitRef={submitRef}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-70 text-b3">
          Selecciona un registro para ver el detalle.
        </div>
      )}
    </DetailsPanelLayout>
  );
};

export default SideMenu;
