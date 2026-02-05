import React from 'react';

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import ExcelLoader from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/ExcelLoader";

const requisitionPage = () => {
  return (
    <>
      <ExcelLoader />
      <RequisitionsForm />
    </>
  );
};

export default requisitionPage;
