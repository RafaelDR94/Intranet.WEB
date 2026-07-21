import type { Get, Set, UpdateEmployeeNumberCardPayload } from "../types";

import { EmployeesEmployeeNumberCard } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Updates an employee phone and card number.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Employee contact and card data.
 * @returns Whether the update succeeded.
 */
export const updateEmployeeNumberCard = async (
  set: Set,
  get: Get,
  payload: UpdateEmployeeNumberCardPayload,
): Promise<boolean> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const params = new URLSearchParams({
      idEmployee: payload.idEmployee,
      cardNumber: payload.cardNumber,
      phoneNumber: payload.phoneNumber,
    });
    const put = pPut(requireGateway("put"), [200, 204]);

    await put(`${EmployeesEmployeeNumberCard}?${params.toString()}`, {});

    const employeesWithActiveUser = get().employeesWithActiveUser.map(
      (employee) =>
        employee.employee_id === payload.idEmployee
          ? {
              ...employee,
              phone_number: payload.phoneNumber,
              employee_phone: payload.phoneNumber,
              card_number: payload.cardNumber,
            }
          : employee,
    );

    set({
      employeesWithActiveUser,
      updating: false,
      successPut: true,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      updating: false,
      successPut: false,
      error: normalized.message,
    });

    return false;
  }
};
