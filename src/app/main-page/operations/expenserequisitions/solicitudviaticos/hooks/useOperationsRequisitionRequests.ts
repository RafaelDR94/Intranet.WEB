"use client";

import { useEffect } from "react";

import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";

/** Provides the independent Operations requisition-request list. */
export const useOperationsRequisitionRequests = () => {
  const rows = useTravelExpensesStore(
    (state) => state.operationsRequisitionRequests,
  );
  const loading = useTravelExpensesStore(
    (state) => state.loadingOperationsRequisitionRequests,
  );
  const error = useTravelExpensesStore(
    (state) => state.operationsRequisitionRequestsError,
  );
  const fetchRequests = useTravelExpensesStore(
    (state) => state.fetchOperationsRequisitionRequests,
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { error, fetchRequests, loading, rows };
};
