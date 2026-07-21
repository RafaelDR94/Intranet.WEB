"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set, TravelExpenseEmployeeWithCardNumber } from "../types";

import { BillingTravelExpensesEmployeesWithCardNumber } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const toStringValue = (value: unknown): string =>
  typeof value === "string" ? value : value == null ? "" : String(value);

/**
 * Fetches employees with phone and card number for travel expenses.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Forces a refresh when true.
 * @returns Employee catalog rows.
 */
export const fetchEmployeesWithCardNumber = async (
  set: Set,
  get: Get,
  force = false,
): Promise<TravelExpenseEmployeeWithCardNumber[]> => {
  if (get().employeesWithCardNumber.length > 0 && !force) {
    set({
      loadingEmployeesWithCardNumber: false,
      error: undefined,
      successGetEmployeesWithCardNumber: true,
      employeesWithCardNumber: get().employeesWithCardNumber,
    });

    return get().employeesWithCardNumber;
  }

  set({
    loadingEmployeesWithCardNumber: true,
    error: undefined,
    successGetEmployeesWithCardNumber: false,
  });

  try {
    const getRequest = pGet(requireGateway("get"));
    const res: AxiosResponse = await getRequest(
      BillingTravelExpensesEmployeesWithCardNumber,
    );
    const raw = res.data?.data ?? res.data;
    const employees = Array.isArray(raw)
      ? raw.map(
          (item): TravelExpenseEmployeeWithCardNumber => ({
            employee_id: toStringValue(
              (
                item as {
                  employee_id?: unknown;
                  employeeId?: unknown;
                  idEmployee?: unknown;
                }
              )?.employee_id ??
                (
                  item as {
                    employee_id?: unknown;
                    employeeId?: unknown;
                    idEmployee?: unknown;
                  }
                )?.employeeId ??
                (
                  item as {
                    employee_id?: unknown;
                    employeeId?: unknown;
                    idEmployee?: unknown;
                  }
                )?.idEmployee,
            ),
            full_name: toStringValue(
              (
                item as {
                  full_name?: unknown;
                  fullName?: unknown;
                  fullname?: unknown;
                  name?: unknown;
                }
              )?.full_name ??
                (
                  item as {
                    full_name?: unknown;
                    fullName?: unknown;
                    fullname?: unknown;
                    name?: unknown;
                  }
                )?.fullName ??
                (
                  item as {
                    full_name?: unknown;
                    fullName?: unknown;
                    fullname?: unknown;
                    name?: unknown;
                  }
                )?.fullname ??
                (
                  item as {
                    full_name?: unknown;
                    fullName?: unknown;
                    fullname?: unknown;
                    name?: unknown;
                  }
                )?.name,
            ),
            phone_number: toStringValue(
              (
                item as {
                  phone_number?: unknown;
                  phoneNumber?: unknown;
                  phonenumber?: unknown;
                  employee_phone?: unknown;
                }
              )?.phone_number ??
                (
                  item as {
                    phone_number?: unknown;
                    phoneNumber?: unknown;
                    phonenumber?: unknown;
                    employee_phone?: unknown;
                  }
                )?.phoneNumber ??
                (
                  item as {
                    phone_number?: unknown;
                    phoneNumber?: unknown;
                    phonenumber?: unknown;
                    employee_phone?: unknown;
                  }
                )?.phonenumber ??
                (
                  item as {
                    phone_number?: unknown;
                    phoneNumber?: unknown;
                    phonenumber?: unknown;
                    employee_phone?: unknown;
                  }
                )?.employee_phone,
            ),
            card_number: toStringValue(
              (
                item as {
                  card_number?: unknown;
                  cardNumber?: unknown;
                  cardnumber?: unknown;
                }
              )?.card_number ??
                (
                  item as {
                    card_number?: unknown;
                    cardNumber?: unknown;
                    cardnumber?: unknown;
                  }
                )?.cardNumber ??
                (
                  item as {
                    card_number?: unknown;
                    cardNumber?: unknown;
                    cardnumber?: unknown;
                  }
                )?.cardnumber,
            ),
          }),
        )
      : [];

    set({
      employeesWithCardNumber: employees,
      loadingEmployeesWithCardNumber: false,
      successGetEmployeesWithCardNumber: true,
    });

    return employees;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      employeesWithCardNumber: [],
      loadingEmployeesWithCardNumber: false,
      successGetEmployeesWithCardNumber: false,
      error: normalized.message,
    });

    return [];
  }
};
