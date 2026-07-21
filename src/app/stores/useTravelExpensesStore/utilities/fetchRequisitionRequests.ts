"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingRequisitionRequestFilter } from "@/app/configurations/Axios/urls";
import { TravelExpenseMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const mapRequisitionRequestRow = (raw: unknown) => {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return TravelExpenseMap({
    id: record.id,
    employee_id: record.id_employee,
    employeename: record.employee_name,
    applicant_id: record.id_applicant,
    applicant_name: record.applicant_name,
    phone_number: record.phone_number ?? record.phoneNumber,
    card_number: record.card_number ?? record.cardNumber,
    created_by: record.email ?? record.user_email ?? record.applicant_name,
    department_id: record.id_department,
    department_name: record.department_name,
    requisitionkey: record.requisition_code,
    status_id: record.id_status,
    status_name: record.status_name,
    status: record.status_name,
    date_created: record.date_created,
    requisition_requests: [
      {
        id: record.id,
        requisition_code: record.requisition_code,
        id_status: record.id_status,
        status_name: record.status_name,
        date_created: record.date_created,
        is_active: true,
      },
    ],
  });
};

/**
 * Fetches pending requisition requests for the accounting requisition table.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Forces a new request even when data is already loaded.
 */
export const fetchRequisitionRequests = async (
  set: Set,
  get: Get,
  force = false,
) => {
  if (get().travelExpenses.length > 0 && !force) return;

  set({
    loading: true,
    error: undefined,
    successGet: false,
    travelExpenses: [],
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ aprovee: "true" });
    const res: AxiosResponse = await getReq(
      `${BillingRequisitionRequestFilter}?${params.toString()}`,
    );
    const rows = Array.isArray(res.data?.data) ? res.data.data : [];
    const mapped = rows.map(mapRequisitionRequestRow);

    set({ travelExpenses: mapped, loading: false, successGet: true });
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      error: normalized.message,
      loading: false,
      successGet: false,
      travelExpenses: [],
    });
  }
};
