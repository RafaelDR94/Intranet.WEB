"use client"
import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RequisitionDetails from "./componentes/RequisitionsDetails/RequisitionDetails";
import RequisitionsTable from "./componentes/RequisitionsTable/RequisitionsTable";
import type { RequisitionRow } from "./componentes/RequisitionsTable/types";
import UserRequisitionsList from "@/app/main-page/operations/requisitions/requisitionListPage/components/UserRequisitionsList/UserRequisitionsList";

const VALIDATE_INVOICES_PATH = "/main-page/accounting/invoices/validateinvoices";

const RequisitionsList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const normalizedLabel = label?.toLowerCase();
  const userId = searchParams.get("idEmployee") ?? searchParams.get("id");
  const requisitionId = searchParams.get("idRequisition");
  const requisitionCode = searchParams.get("requisitionCode");
  const employeeName = searchParams.get("employeeName");
  const isFilesView = normalizedLabel?.startsWith("archivos");
  const isRequisitionsView = normalizedLabel?.startsWith("requisiciones");

  const handleViewRequisitionFiles = useCallback(
    (row: RequisitionRow) => {
      const query = new URLSearchParams();
      query.set("idRequisition", row.id);
      query.set("requisitionCode", row.snCode);
      if (row.employeeId) {
        query.set("idEmployee", row.employeeId);
      }
      if (row.debtorName) {
        query.set("employeeName", row.debtorName);
      }
      router.push(`${VALIDATE_INVOICES_PATH}?${query.toString()}`);
    },
    [router],
  );

  useEffect(() => {
    if (!isFilesView) return;

    const query = new URLSearchParams();
    if (requisitionId) {
      query.set("idRequisition", requisitionId);
      if (requisitionCode) {
        query.set("requisitionCode", requisitionCode);
      }
    } else if (userId) {
      query.set("idEmployee", userId);
    }
    if (employeeName) {
      query.set("employeeName", employeeName);
    }

    const nextPath = query.toString()
      ? `${VALIDATE_INVOICES_PATH}?${query.toString()}`
      : VALIDATE_INVOICES_PATH;

    router.replace(nextPath);
  }, [employeeName, isFilesView, requisitionCode, requisitionId, router, userId]);

  if (isFilesView) {
    return null;
  }

  if (isRequisitionsView) {
    return (
      <UserRequisitionsList
        forceVisible
        userId={userId}
        onViewFiles={handleViewRequisitionFiles}
      />
    );
  }

  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
}

export default RequisitionsList
