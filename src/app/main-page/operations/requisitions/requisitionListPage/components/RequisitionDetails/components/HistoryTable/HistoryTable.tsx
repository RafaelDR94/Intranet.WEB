import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/app/components/DataTable/DataTable";
import { Button } from "@/app/components/Button/Button";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { Authorization } from "@/app/mappings/authorizations/authorizations.types";
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { shallow } from "zustand/shallow";

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatTime = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const getStatusLabelType = (status?: unknown) => {
  const value = String((status as any)?.name ?? status ?? "").toLowerCase();
  if (value.includes("aprob")) return "valido";
  if (value.includes("rechaz")) return "rechazado";
  if (value.includes("cancel")) return "restringido";
  if (value.includes("pend")) return "pendiente";
  return "actualizado";
};

type HistoryRow = {
  id: string;
  requestDate: string;
  requestTime: string;
  approvalDate: string;
  approvalTime: string;
  responsible: string;
  statusText: string;
  raw: Authorization;
};

const buildEmployeeName = (authorization: Authorization) => {
  const authorizer = authorization.authorizer;
  if (!authorizer) return "--";
  if (authorizer.fullname?.trim()) return authorizer.fullname;
  return [
    authorizer.firstname,
    authorizer.secondname,
    authorizer.lastname,
    authorizer.motherlast_name,
  ]
    .filter((part) => part && String(part).trim() !== "")
    .join(" ");
};

const HistoryTable: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requisitionId = searchParams.get("id");
  const { authorizationHistory, getRequisitionAuthorizationsHistory } = useAuthorizationsStore(
    (s) => ({
      authorizationHistory: s.authorizationHistory,
      getRequisitionAuthorizationsHistory: s.getRequisitionAuthorizationsHistory,
    }),
    shallow,
  );

  useEffect(() => {
    if (!requisitionId) return;
    getRequisitionAuthorizationsHistory(requisitionId);
  }, [getRequisitionAuthorizationsHistory, requisitionId]);

  const rows = useMemo<HistoryRow[]>(() => {
    return (authorizationHistory ?? []).map((item, index) => {
      const dateCreated = item.dateCreated ?? "";
      const statusText = String((item.status as any)?.name ?? item.status ?? "Pendiente");
      return {
        id: item.authorization_id || String(index + 1),
        requestDate: formatDate(dateCreated),
        requestTime: formatTime(dateCreated),
        approvalDate: "--",
        approvalTime: "--",
        responsible: buildEmployeeName(item) || "--",
        statusText: statusText || "Pendiente",
        raw: item,
      };
    });
  }, [authorizationHistory]);

  const columns: ColumnDefinition<HistoryRow>[] = [
    { key: "requestDate", label: "FECHA DE SOLICITUD" },
    { key: "requestTime", label: "HORA" },
    { key: "approvalDate", label: "FECHA DE APROBACION" },
    { key: "approvalTime", label: "HORA" },
    { key: "responsible", label: "RESPONSABLE" },
    {
      key: "statusText",
      label: "ESTATUS VALIDACION",
      render: (row) => (
        <Label type={getStatusLabelType(row.raw.status)} text={row.statusText} />
      ),
    },
    {
      key: "raw",
      label: "",
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          className="text-teal-70"
          onClick={() => {
            const query = new URLSearchParams(searchParams.toString());
            query.set("id", row.raw.event_id ?? "");
            if (!query.get("label")) {
              query.set("label", "Detalle Requisicion");
            }
            query.set("view", "authorizationDetail");
            query.set("authorization_id", row.raw.authorization_id ?? "");
            if (row.raw.event_id) {
              query.set("event_id", row.raw.event_id);
            }
            query.set("documents", "authorization");
            query.set("authorizationDetailLabel", "Detalle");
            router.push(`${pathname}?${query.toString()}`);
          }}
        >
          Ver archivos
        </Button>
      ),
      cellClass: "text-right",
      headerClass: "text-right",
    },
  ];

  return (
    <DataTable
      showButton={false}
      showFilter
      showCalendar
      enableInternalSearch
      searchableKeys={["requestDate", "responsible", "statusText"]}
      tables={[
        {
          data: rows,
          columns,
          title: "Historial de aprobaciones",
          enableSelection: false,
          enableCollaps: false,
        },
      ]}
    />
  );
};

export default HistoryTable;
