"use client"

import React from "react";

import InvoicesForm from "../../personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "../../personalInvoices/invoices/components/TicketForm/TicketForm";
import { InvoicesProvider } from "../../personalInvoices/invoices/context/InvoicesContext";

const BillableFilesPage = () => {
  return (
    <InvoicesProvider>
      <TicketForm
        responsiveLayoutMatrix={{
          sm: [[10], [10]],
          md: [[10], [10]],
          lg: [[10], [10]],
        }}
      />
      <InvoicesForm
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
          md: [
            [5, 5],
            [3.3, 3.3, 3.3],
            [2.5, 2.5, 2.5, 2.5],
          ],
          lg: [
            [5, 5],
            [3.3, 3.3, 3.3],
            [2.5, 2.5, 2.5, 2.5],
          ],
        }}
        withoutName
      />
    </InvoicesProvider>
  );
};

export default BillableFilesPage;
