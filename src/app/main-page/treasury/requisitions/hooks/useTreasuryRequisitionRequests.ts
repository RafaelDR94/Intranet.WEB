"use client";

import { useEffect } from "react";

import { useTravelExpensesStore } from "@/app/stores/useTravelExpensesStore/useTravelExpensesStore";

/** Provides the independent Treasury requisition-request list. */
export const useTreasuryRequisitionRequests = () => {
  const rows = useTravelExpensesStore(
    (state) => state.treasuryRequisitionRequests,
  );
  const loading = useTravelExpensesStore(
    (state) => state.loadingTreasuryRequisitionRequests,
  );
  const error = useTravelExpensesStore(
    (state) => state.treasuryRequisitionRequestsError,
  );
  const fetchRequests = useTravelExpensesStore(
    (state) => state.fetchTreasuryRequisitionRequests,
  );

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  return { error, fetchRequests, loading, rows };
};
