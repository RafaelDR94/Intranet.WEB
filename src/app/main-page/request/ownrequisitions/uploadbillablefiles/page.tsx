"use client"

import React from "react";
import { FileUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";

import InvoicesForm from "../../../accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "../../../accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import { InvoicesProvider } from "../../../accounting/personalInvoices/invoices/context/InvoicesContext";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";
import { Button } from "@/app/components/Button/Button";

const BillableFilesPage = () => {
  const router = useRouter();
  const { requisitions, loading } = useRequisitionsStore(
    (s) => ({ requisitions: s.requisitions, loading: s.loading }),
    shallow,
  );

  return (
    <InvoicesProvider>
      {loading ? (
        <div className="px-4 py-10">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-20 bg-white-90 shadow-300">
            <div className="h-1 w-full bg-gradient-to-r from-green-90 to-blue-80" />
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="h-12 w-12 animate-pulse rounded-full bg-white-80" />
              <div className="w-full max-w-md space-y-2">
                <div className="mx-auto h-4 w-3/5 animate-pulse rounded bg-white-80" />
                <div className="mx-auto h-3 w-4/5 animate-pulse rounded bg-white-80" />
              </div>
              <p className="text-b3 text-gray-60">Cargando requisiciones...</p>
            </div>
          </div>
        </div>
      ) : requisitions.length === 0 ? (
        <div className="px-4 py-10">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-20 bg-white-90 shadow-300">
            <div className="h-1 w-full bg-gradient-to-r from-green-90 to-blue-80" />
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white-80">
                <FileUp className="h-6 w-6 text-green-90" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h2 className="text-s1 font-semibold text-black-100">
                  No cuentas con requisiciones activas.
                </h2>
                <p className="mx-auto max-w-xl text-b3 text-gray-70">
                  Cuando tengas una requisición activa podrás subir tus archivos
                  facturables desde esta sección.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button
                  variant="solid"
                  size="medium"
                  onClick={() =>
                    router.push("/main-page/request/ownrequisitions/requisitions")
                  }
                >
                  Ir a Requisiciones
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </InvoicesProvider>
  );
};

export default BillableFilesPage;
