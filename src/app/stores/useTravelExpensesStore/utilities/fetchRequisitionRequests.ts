"use client";

import type { AxiosResponse } from "axios";

import type { Set } from "../types";

import { BillingRequisitionRequest } from "@/app/configurations/Axios/urls";
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
    treasury_status_name: record.treasury_status_name,
    accounting_status_name: record.accounting_status_name,
    image_urls: record.image_urls,
    date_created: record.date_created,
    requisition_requests: [
      {
        id: record.id,
        requisition_code: record.requisition_code,
        id_status: record.id_status,
        status_name: record.status_name,
        treasury_status_name: record.treasury_status_name,
        accounting_status_name: record.accounting_status_name,
        image_urls: record.image_urls,
        date_created: record.date_created,
        is_active: true,
      },
    ],
  });
};

/**
 * Fetches requisition requests assigned to the accounting review table.
 *
 * @param set Zustand setter.
 */
export const fetchRequisitionRequests = async (
  set: Set,
) => {
  set({
    loading: true,
    error: undefined,
    successGet: false,
    travelExpenses: [],
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ department: "CONTABILIDAD" });
    const res: AxiosResponse = await getReq(
      `${BillingRequisitionRequest}?${params.toString()}`,
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
