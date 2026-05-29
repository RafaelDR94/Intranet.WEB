"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { TravelExpensesState } from "./types";
import {
  approveTravelExpense as approveTravelExpenseRequest,
  cancelOrResendTravelExpense as cancelOrResendTravelExpenseRequest,
  createTravelExpense as createTravelExpenseRequest,
  fetchTravelExpenseCalculations as fetchTravelExpenseCalculationsRequest,
  fetchTravelExpenses as fetchTravelExpensesRequest,
  rejectTravelExpense as rejectTravelExpenseRequest,
  saveTravelExpenseCalculations as saveTravelExpenseCalculationsRequest,
  sendRequisitionRequestAuthorization as sendRequisitionRequestAuthorizationRequest,
  updateTravelExpense as updateTravelExpenseRequest,
} from "./utilities";

/**
 * Store for travel expense requisitions.
 */
export const useTravelExpensesStore =
  createWithEqualityFn<TravelExpensesState>()(
    devtools((set, get) => ({
      travelExpenses: [],
      loading: false,
      creating: false,
      updating: false,
      approving: false,
      rejecting: false,
      cancelingOrResending: false,
      sendingAuthorization: false,
      travelExpenseCalculationsByRequest: {},
      loadingCalculations: false,
      savingCalculations: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successApprove: false,
      successReject: false,
      successCancelOrResend: false,
      successSendAuthorization: false,
      successSaveCalculations: false,
      error: undefined,

      fetchTravelExpenses: (force = false) =>
        fetchTravelExpensesRequest(set, get, force),

      createTravelExpense: (payload) =>
        createTravelExpenseRequest(set, get, payload),

      updateTravelExpense: (payload) =>
        updateTravelExpenseRequest(set, get, payload),

      approveTravelExpense: (idTravelExpense) =>
        approveTravelExpenseRequest(set, get, idTravelExpense),

      rejectTravelExpense: (payload) =>
        rejectTravelExpenseRequest(set, get, payload),

      cancelOrResendTravelExpense: (idTravelExpense, action) =>
        cancelOrResendTravelExpenseRequest(set, get, idTravelExpense, action),

      sendRequisitionRequestAuthorization: (idRequisitionRequest) =>
        sendRequisitionRequestAuthorizationRequest(
          set,
          get,
          idRequisitionRequest,
        ),

      fetchTravelExpenseCalculations: (idRequisitionRequest) =>
        fetchTravelExpenseCalculationsRequest(set, get, idRequisitionRequest),

      saveTravelExpenseCalculations: (rows) =>
        saveTravelExpenseCalculationsRequest(set, get, rows),

      reset: () =>
        set({
          travelExpenses: [],
          loading: false,
          creating: false,
          updating: false,
          approving: false,
          rejecting: false,
          cancelingOrResending: false,
          sendingAuthorization: false,
          travelExpenseCalculationsByRequest: {},
          loadingCalculations: false,
          savingCalculations: false,
          successGet: false,
          successPost: false,
          successPut: false,
          successApprove: false,
          successReject: false,
          successCancelOrResend: false,
          successSendAuthorization: false,
          successSaveCalculations: false,
          error: undefined,
        }),

      resetFlags: () =>
        set({
          loading: false,
          creating: false,
          updating: false,
          approving: false,
          rejecting: false,
          cancelingOrResending: false,
          sendingAuthorization: false,
          loadingCalculations: false,
          savingCalculations: false,
          successGet: false,
          successPost: false,
          successPut: false,
          successApprove: false,
          successReject: false,
          successCancelOrResend: false,
          successSendAuthorization: false,
          successSaveCalculations: false,
          error: undefined,
        }),
    })),
  );
