"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import RequisitionDetails from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/RequisitionDetails";
import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";

const RequisitionListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const normalizedLabel = label?.toLowerCase();
  const isFilesOrRequisitionsView =
    normalizedLabel?.startsWith("archivos") || normalizedLabel?.startsWith("requisiciones");

  if (isFilesOrRequisitionsView) return <div />;

  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
};

export default RequisitionListPage;
