"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

import BillableFilesFlow from "../../requisitions/requisitionListPage/components/BillableFilesFlow/BillableFilesFlow";
import InvoicesFiles from "../../requisitions/requisitionListPage/components/InvoicesFiles/InvoicesFiles";
import RequisitionDetails from "../../requisitions/requisitionListPage/components/RequisitionDetails/RequisitionDetails";
import HistoryTable from "../../requisitions/requisitionListPage/components/RequisitionDetails/components/HistoryTable/HistoryTable";
import TicketsFiles from "../../requisitions/requisitionListPage/components/TicketsFiles/TicketsFiles";
import UserRequisitionsList from "../../requisitions/requisitionListPage/components/UserRequisitionsList/UserRequisitionsList";
import RequisitionsAuthorization from "@/app/main-page/authorizations/authorizationslist/components/AuthorizationDetail/components/RequisitionsAuthorization/RequisitionsAuthorization";

const BeneficiaryHistory: React.FC = () => {
  const searchParams = useSearchParams();
  const label = searchParams.get("label");
  const userId = searchParams.get("id");
  const view = searchParams.get("view");
  const [selectedTicket, setSelectedTicket] =
    useState<BillingImagesTable | null>(null);
  const normalizedLabel = label?.toLowerCase();
  const isFilesView = normalizedLabel?.startsWith("archivos");
  const isRequisitionsView = normalizedLabel?.startsWith("requisiciones");
  const isBillableFilesView = view === "billablefiles";
  const isHistoryView = view === "history";
  const isAuthorizationDetailView = view === "authorizationDetail";
  const isDetailView = view === "detail";
  const isDefaultView =
    !isBillableFilesView &&
    !isHistoryView &&
    !isAuthorizationDetailView &&
    !isDetailView &&
    !isFilesView &&
    !isRequisitionsView;

  useTutorialAutoRun({
    moduleId: isDefaultView ? "operations-requisitions-list" : "",
    tutorialId: isDefaultView ? "operations-requisitions:list" : "",
  });
  useTutorialAutoRun({
    moduleId: isFilesView ? "operations-requisitions-files" : "",
    tutorialId: isFilesView ? "operations-requisitions:files" : "",
  });
  useTutorialAutoRun({
    moduleId: isBillableFilesView
      ? "operations-requisitions-billablefiles"
      : "",
    tutorialId: isBillableFilesView
      ? "operations-requisitions:billablefiles"
      : "",
  });
  useTutorialAutoRun({
    moduleId: isDetailView ? "operations-requisitions-detail" : "",
    tutorialId: isDetailView ? "operations-requisitions:detail" : "",
  });

  if (isBillableFilesView) {
    return (
      <InvoicesProvider>
        <BillableFilesFlow
          selectedTicket={selectedTicket}
          onSelectedTicketChange={setSelectedTicket}
        />
      </InvoicesProvider>
    );
  }

  if (isHistoryView) {
    return <HistoryTable />;
  }

  if (isAuthorizationDetailView) {
    return <RequisitionsAuthorization />;
  }

  if (isFilesView) {
    return (
      <>
        <TicketsFiles />
        <InvoicesFiles forceVisible />
      </>
    );
  }

  if (isRequisitionsView) {
    return <UserRequisitionsList forceVisible userId={userId} />;
  }

  return (
    <>
      <RequisitionDetails />
      <RequisitionsTable />
    </>
  );
};

export default BeneficiaryHistory;
