'use client';
import React from 'react';

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import ExcelLoader from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/ExcelLoader";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const RequisitionPage = () => {
  useTutorialAutoRun({
    moduleId: "operations-requisitions-form",
    tutorialId: "operations-requisitions:form",
  });

  return (
    <div className="flex flex-col gap-6">
      <div data-tour="requisitions-excel-loader">
        <ExcelLoader />
      </div>
      <div data-tour="requisitions-form">
        <RequisitionsForm />
      </div>
    </div>
  );
};

export default RequisitionPage;
