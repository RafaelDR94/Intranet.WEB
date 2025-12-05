"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";
import TicketsFiles from "./components/TicketsFiles/TicketsFiles";
import InvoicesFiles from "./components/InvoicesFiles/InvoicesFiles";
import RequisitionsFiles from "./components/RequisitionsFiles/RequisitionsFiles";
import RequisitionDetails from "./components/RequisitionDetails/RequisitionDetails";

const RequisitionListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const userId = searchParams.get("id");
  const normalizedLabel = label?.toLowerCase();
  const isFilesView = normalizedLabel?.startsWith("archivos");
  const isRequisitionsView = normalizedLabel?.startsWith("requisiciones");

  if (isFilesView) {
    return (
      <>
        <TicketsFiles />
        <InvoicesFiles forceVisible />
      </>
    );
  }

  if (isRequisitionsView) {
    return <RequisitionsFiles forceVisible userId={userId} />;
  }

  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
};

export default RequisitionListPage;
