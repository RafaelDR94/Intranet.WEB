"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RequisitionsTable from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/RequisitionsTable";
import TicketsFiles from "./components/TicketsFiles/TicketsFiles";
import InvoicesFiles from "./components/InvoicesFiles/InvoicesFiles";
import RequisitionsFiles from "./components/RequisitionsFiles/RequisitionsFiles";
import RequisitionDetails from "./components/RequisitionDetails/RequisitionDetails";
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
        <TicketsFiles onSelectTicket={setSelectedTicket} />
      </InvoicesProvider>
    );
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
    return <RequisitionsFiles forceVisible userId={userId} />;
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
