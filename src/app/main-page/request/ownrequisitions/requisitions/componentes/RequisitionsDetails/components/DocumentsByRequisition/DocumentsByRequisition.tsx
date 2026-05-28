"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import RequisitionDetailsTable from "@/app/main-page/operations/requisitions/requisitionListPage/components/RequisitionDetails/components/RequisitionsDetailsTable";

const DocumentsByRequisition: React.FC = () => {
  const searchParams = useSearchParams();
  const requisitionId = searchParams.get("id") ?? undefined;

  return <RequisitionDetailsTable requisitionIdOverride={requisitionId} />;
};

export default DocumentsByRequisition;
