"use client"
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";
import TicketsFiles from "./components/TicketsFiles/TicketsFiles";
import InvoicesFiles from "./components/InvoicesFiles/InvoicesFiles";
import UserRequisitionsList from "./components/UserRequisitionsList/UserRequisitionsList";
import RequisitionDetails from "./components/RequisitionDetails/RequisitionDetails";
import HistoryTable from "./components/RequisitionDetails/components/HistoryTable/HistoryTable";
import RequisitionsAuthorization from "@/app/main-page/authorizations/authorizationslist/components/AuthorizationDetail/components/RequisitionsAuthorization/RequisitionsAuthorization";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

const RequisitionListPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const label = searchParams.get("label");
  const userId = searchParams.get("id");
  const view = searchParams.get("view");
  const [selectedTicket, setSelectedTicket] = useState<BillingImagesTable | null>(null);
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
    moduleId: isBillableFilesView ? "operations-requisitions-billablefiles" : "",
    tutorialId: isBillableFilesView ? "operations-requisitions:billablefiles" : "",
  });
  useTutorialAutoRun({
    moduleId: isDetailView ? "operations-requisitions-detail" : "",
    tutorialId: isDetailView ? "operations-requisitions:detail" : "",
  });

  if (isBillableFilesView) {
    return (
      <InvoicesProvider>
        <InvoicesForm
          responsiveLayoutMatrix={{
            sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
            md: [
              [5, 5],
              [5, 5],
              [2.5, 2.5, 5],
              [5, 5],
            ],
            lg: [
              [5, 5],
              [3.3, 3.3, 3.3],
              [2, 2, 3, 3],
            ],
          }}
          withoutName
          billingImages={selectedTicket}
          onCloseImage={() => setSelectedTicket(null)}
        />
        <TicketsFiles
          eneableSelection={true}
          onSelectedTicketChange={setSelectedTicket}
          selectedTicketId={selectedTicket?.billing_image_id ?? null}
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
      <RequisitionsTable
        showActionButton
        actionLabel="Agregar Requisición"
        onActionClick={() =>
          router.push("/main-page/operations/requisitions/requisitionsPage/")
        }
      />
    </>
  );
};

export default RequisitionListPage;
