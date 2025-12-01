"use client";
import React from "react";

import RequisitionDetails from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsDetails/RequisitionDetails";
import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";

const RequisitionListPage: React.FC = () => {
  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
};

export default RequisitionListPage;
