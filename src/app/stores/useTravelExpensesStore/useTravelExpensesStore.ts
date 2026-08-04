"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { TravelExpensesState } from "./types";
import {
  approveTravelExpense as approveTravelExpenseRequest,
  approveRequisitionRequestThroughAccounting as approveRequisitionRequestThroughAccountingRequest,
  cancelOrResendTravelExpense as cancelOrResendTravelExpenseRequest,
  createTravelExpense as createTravelExpenseRequest,
  fetchEmployeesWithCardNumber as fetchEmployeesWithCardNumberRequest,
  fetchRequisitionRequestById as fetchRequisitionRequestByIdRequest,
  fetchRequisitionRequests as fetchRequisitionRequestsRequest,
  fetchOperationsRequisitionRequests as fetchOperationsRequisitionRequestsRequest,
  fetchTreasuryRequisitionRequests as fetchTreasuryRequisitionRequestsRequest,
  fetchTravelExpenseCalculationConcepts as fetchTravelExpenseCalculationConceptsRequest,
  fetchTravelExpenseCalculations as fetchTravelExpenseCalculationsRequest,
  fetchTravelExpenses as fetchTravelExpensesRequest,
  rejectTravelExpense as rejectTravelExpenseRequest,
  rejectRequisitionRequestThroughAccounting as rejectRequisitionRequestThroughAccountingRequest,
  resendRequisitionRequestAuthorization as resendRequisitionRequestAuthorizationRequest,
  saveTravelExpenseProgress as saveTravelExpenseProgressRequest,
  saveRequisitionRequestProgress as saveRequisitionRequestProgressRequest,
  saveTravelExpenseCalculations as saveTravelExpenseCalculationsRequest,
  sendRequisitionRequestAuthorization as sendRequisitionRequestAuthorizationRequest,
  sendTravelExpenseAuthorization as sendTravelExpenseAuthorizationRequest,
  updateTravelExpense as updateTravelExpenseRequest,
  updateRequisitionRequestImages as updateRequisitionRequestImagesRequest,
} from "./utilities";

/**
 * Store for travel expense requisitions.
 */
export const useTravelExpensesStore =
  createWithEqualityFn<TravelExpensesState>()(
    devtools((set, get) => ({
      travelExpenses: [],
      operationsRequisitionRequests: [],
      treasuryRequisitionRequests: [],
      currentRequisitionRequest: undefined,
      employeesWithCardNumber: [],
      travelExpenseCalculationConcepts: [],
      loading: false,
      loadingOperationsRequisitionRequests: false,
      loadingTreasuryRequisitionRequests: false,
      loadingRequisitionRequestDetail: false,
      loadingEmployeesWithCardNumber: false,
      loadingCalculationConcepts: false,
      creating: false,
      updating: false,
      savingProgress: false,
      approving: false,
      rejecting: false,
      updatingRequisitionRequestImages: false,
      cancelingOrResending: false,
      sendingAuthorization: false,
      travelExpenseCalculationsByRequest: {},
      loadingCalculations: false,
      savingCalculations: false,
      successGet: false,
      successGetEmployeesWithCardNumber: false,
      successGetCalculationConcepts: false,
      successPost: false,
      successPut: false,
      successSaveProgress: false,
      successApprove: false,
      successReject: false,
      successCancelOrResend: false,
      successSendAuthorization: false,
      successSaveCalculations: false,
      error: undefined,
      operationsRequisitionRequestsError: undefined,
      treasuryRequisitionRequestsError: undefined,

      fetchTravelExpenses: (force = false) =>
        fetchTravelExpensesRequest(set, get, force),

      fetchRequisitionRequests: () => fetchRequisitionRequestsRequest(set),

      fetchOperationsRequisitionRequests: () =>
        fetchOperationsRequisitionRequestsRequest(set),

      fetchTreasuryRequisitionRequests: () =>
        fetchTreasuryRequisitionRequestsRequest(set),

      fetchRequisitionRequestById: (id) =>
        fetchRequisitionRequestByIdRequest(set, id),

      fetchEmployeesWithCardNumber: (force = false) =>
        fetchEmployeesWithCardNumberRequest(set, get, force),

      fetchTravelExpenseCalculationConcepts: (force = false) =>
        fetchTravelExpenseCalculationConceptsRequest(set, get, force),

      createTravelExpense: (payload) =>
        createTravelExpenseRequest(set, get, payload),

      updateTravelExpense: (payload) =>
        updateTravelExpenseRequest(set, get, payload),

      saveTravelExpenseProgress: (payload) =>
        saveTravelExpenseProgressRequest(set, get, payload),

      saveRequisitionRequestProgress: (payload) =>
        saveRequisitionRequestProgressRequest(set, payload),

      approveTravelExpense: (idTravelExpense) =>
        approveTravelExpenseRequest(set, get, idTravelExpense),

      approveRequisitionRequestThroughAccounting: (idRequisitionRequest) =>
        approveRequisitionRequestThroughAccountingRequest(
          set,
          get,
          idRequisitionRequest,
        ),

      rejectTravelExpense: (payload) =>
        rejectTravelExpenseRequest(set, get, payload),

      rejectRequisitionRequestThroughAccounting: (payload) =>
        rejectRequisitionRequestThroughAccountingRequest(set, get, payload),

      cancelOrResendTravelExpense: (idTravelExpense, action) =>
        cancelOrResendTravelExpenseRequest(set, get, idTravelExpense, action),

      sendRequisitionRequestAuthorization: (idRequisitionRequest) =>
        sendRequisitionRequestAuthorizationRequest(
          set,
          get,
          idRequisitionRequest,
        ),
      updateRequisitionRequestImages: (payload) =>
        updateRequisitionRequestImagesRequest(set, get, payload),

      sendTravelExpenseAuthorization: (idTravelExpense, idAuthorizer) =>
        sendTravelExpenseAuthorizationRequest(
          set,
          get,
          idTravelExpense,
          idAuthorizer,
        ),

      resendRequisitionRequestAuthorization: (payload) =>
        resendRequisitionRequestAuthorizationRequest(set, payload),

      fetchTravelExpenseCalculations: (idRequisitionRequest) =>
        fetchTravelExpenseCalculationsRequest(set, get, idRequisitionRequest),

      saveTravelExpenseCalculations: (rows) =>
        saveTravelExpenseCalculationsRequest(set, get, rows),

      reset: () =>
        set({
          travelExpenses: [],
          operationsRequisitionRequests: [],
          treasuryRequisitionRequests: [],
          currentRequisitionRequest: undefined,
          employeesWithCardNumber: [],
          travelExpenseCalculationConcepts: [],
          loading: false,
          loadingOperationsRequisitionRequests: false,
          loadingTreasuryRequisitionRequests: false,
          loadingRequisitionRequestDetail: false,
          loadingEmployeesWithCardNumber: false,
          loadingCalculationConcepts: false,
          creating: false,
          updating: false,
          savingProgress: false,
          approving: false,
          rejecting: false,
          updatingRequisitionRequestImages: false,
          cancelingOrResending: false,
          sendingAuthorization: false,
          travelExpenseCalculationsByRequest: {},
          loadingCalculations: false,
          savingCalculations: false,
          successGet: false,
          successGetEmployeesWithCardNumber: false,
          successGetCalculationConcepts: false,
          successPost: false,
          successPut: false,
          successSaveProgress: false,
          successApprove: false,
          successReject: false,
          successCancelOrResend: false,
          successSendAuthorization: false,
          successSaveCalculations: false,
          error: undefined,
          operationsRequisitionRequestsError: undefined,
          treasuryRequisitionRequestsError: undefined,
        }),

      resetFlags: () =>
        set({
          loading: false,
          loadingOperationsRequisitionRequests: false,
          loadingTreasuryRequisitionRequests: false,
          loadingRequisitionRequestDetail: false,
          loadingEmployeesWithCardNumber: false,
          loadingCalculationConcepts: false,
          creating: false,
          updating: false,
          savingProgress: false,
          approving: false,
          rejecting: false,
          updatingRequisitionRequestImages: false,
          cancelingOrResending: false,
          sendingAuthorization: false,
          loadingCalculations: false,
          savingCalculations: false,
          successGet: false,
          successGetEmployeesWithCardNumber: false,
          successGetCalculationConcepts: false,
          successPost: false,
          successPut: false,
          successSaveProgress: false,
          successApprove: false,
          successReject: false,
          successCancelOrResend: false,
          successSendAuthorization: false,
          successSaveCalculations: false,
          error: undefined,
          operationsRequisitionRequestsError: undefined,
          treasuryRequisitionRequestsError: undefined,
        }),
    })),
  );
