import { useMemo } from "react";

import type {
  PettyCashVoucherData,
  PettyCashVoucherFull,
} from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
type UseSideMenuParams = {
  selected: {
    id: string;
    total?: number;
    amount?: string | number;
    voucherType?: string;
    category?: { name: string };
    certificationDate?: string;
    dateCreate?: string;
    description: { name: string };
    comments?: string;
    project?: { id?: string; proyectKey?: string };
    xml?: string;
    pdf?: string;
    employeeName?: string;
    billingdocument_id?: string;
    status?: string;
    authorization_evidence?: string;
  } | null;
  detail: PettyCashVoucherFull | null;
  user?: { fullName?: string } | null;
};

const READABLE_EMPTY = "—";

const authorizationStatusToLabelType = (status?: string) => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("aprob")) return "valido";
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("cancel")) return "restringido";
  if (normalized.includes("pend")) return "pendiente";
  return "actualizado";
};



const normalizeDateForInput = (raw?: string): string => {
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
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

export const useSideMenu = ({ selected, detail, user }: UseSideMenuParams) => {
  const { amountRaw, amountNumeric } = useMemo<{
    amountRaw: string | number | undefined;
    amountNumeric: number | undefined;
  }>(() => {
    const candidate =
      detail?.total ?? detail?.amount ?? selected?.total ?? selected?.amount;

    if (candidate === undefined || candidate === null) {
      return {
        amountRaw: undefined,
        amountNumeric: undefined,
      };
    }

    const numericCandidate =
      typeof candidate === "number"
        ? candidate
        : Number.parseFloat(
            candidate
              .toString()
              .replace(/[^0-9.,-]/g, "")
              .replace(/,/g, ""),
          );

    return {
      amountRaw: candidate,
      amountNumeric: Number.isFinite(numericCandidate)
        ? numericCandidate
        : undefined,
    };
  }, [detail?.amount, detail?.total, selected?.amount, selected?.total]);

  const voucherDataEdit = useMemo<PettyCashVoucherData | undefined>(() => {
    if (!selected) return undefined;

    const detailMatchesSelection =
      detail && detail.id === selected.id ? detail : null;

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
      comments: detailMatchesSelection?.comments ?? selected.comments ?? "",
      project_id:
        detailMatchesSelection?.project?.id ?? selected.project?.id ?? "",
      xml: detailMatchesSelection?.xml ?? selected.xml ?? "",
      pdf: detailMatchesSelection?.pdf ?? selected.pdf ?? "",
      amount:
        detailMatchesSelection?.total ??
        detailMatchesSelection?.amount ??
        amountRaw ??
        "",
      total: amountNumeric,
      authorization_evidence:
        detailMatchesSelection?.authorization_evidence ??
        selected.authorization_evidence ??
        "",
        authorization: detailMatchesSelection?.authorization ?? null,
    } satisfies PettyCashVoucherData;
  }, [amountNumeric, amountRaw, detail, selected]);

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

  const formattedAmount = useMemo(() => {
    if (amountNumeric === undefined) return READABLE_EMPTY;
    return amountNumeric.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  }, [amountNumeric]);

  const normalizedStatus = selected?.status?.toLocaleLowerCase().trim() ?? "";
  const isEditableStatus =
    normalizedStatus === "rechazado" ||
    normalizedStatus === "sin factura" ||
    normalizedStatus === "factura rechazada";
  const shouldDisableFormInteractions = !isEditableStatus;

  const authorization = detail?.authorization ?? null;
  const authorizationId = authorization?.authorization_id?.trim() ?? "";
  const hasAuthorization = Boolean(authorizationId);
  const authorizationStatus =
    (typeof authorization?.status === "string"
      ? authorization?.status
      : authorization?.status?.name) ?? "Pendiente";
  const authorizationComment = authorization?.comment ?? "";
  const authorizerName = authorization?.authorizer.fullname ?? "";

  return {
    voucherDataEdit,
    isVoucherPinkVoucher,
    projectCode,
    employeeName,
    certificationDate,
    voucherUuid,
    comments,
    rfcEmisor,
    rfcReceptor,
    subtotal,
    iva,
    formattedAmount,
    isEditableStatus,
    shouldDisableFormInteractions,
    hasAuthorization,
    authorizationStatus,
    authorizationComment,
    authorizerName,
    authorizationStatusToLabelType,
    formatDate,
  };
};
