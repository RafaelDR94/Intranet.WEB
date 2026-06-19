"use client"
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { RequisitionRow } from "./componentes/RequisitionsTable/types";
import UserRequisitionsList from "@/app/main-page/operations/requisitions/requisitionListPage/components/UserRequisitionsList/UserRequisitionsList";
import { ContextualInfoForm } from "@/app/sharedComponents/ContextualInfoForm/ContextualInfoForm";
import type { ContextualInfoValues } from "@/app/sharedComponents/ContextualInfoForm/types";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import { mockViaticsRows } from "@/app/sharedComponents/EditableViaticsTable/utilities/mockRows";
const VALIDATE_INVOICES_PATH = "/main-page/accounting/invoices/validateinvoices";

const mockContextualInfoValues: ContextualInfoValues = {
  company: "DISITREK",
  projectCode: "PY-SEMAR-014",
  debtorCode: "00124",
  clientCode: "00345",
  startDate: "2026-05-10",
  endDate: "2026-05-15",
  assignedPerson: "Angel Vazquez",
};

const RequisitionsList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const normalizedLabel = label?.toLowerCase();
  const userId = searchParams.get("idEmployee") ?? searchParams.get("id");
  const requisitionId = searchParams.get("idRequisition");
  const requisitionCode = searchParams.get("requisitionCode");
  const employeeName = searchParams.get("employeeName");
  const [viaticsRows, setViaticsRows] = useState<EditableViaticsRow[]>(mockViaticsRows);
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
    <div className="flex w-full flex-col gap-4">
      <ContextualInfoForm values={mockContextualInfoValues} />
      <EditableViaticsTable
        value={viaticsRows}
        onChange={setViaticsRows}
        totalOverride="7,500"
      />
    </div>
  );
}

export default RequisitionsList
