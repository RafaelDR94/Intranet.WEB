"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import RequisitionDetails from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/RequisitionDetails";
import RequisitionDetailsDocument from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/RequisitionDetailsDocument";
import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";

const RequisitionListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const normalizedLabel = label?.toLowerCase();
  const isFilesView = normalizedLabel?.startsWith("archivos");
  const isRequisitionsView = normalizedLabel?.startsWith("requisiciones");

  if (isFilesView) {
    return (
      <>
        <RequisitionDetailsDocument />
        <RequisitionsTable forceVisible />
      </>
    );
  }

  if (isRequisitionsView) {
    return <RequisitionsTable forceVisible />;
  }

  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
};

export default RequisitionListPage;
