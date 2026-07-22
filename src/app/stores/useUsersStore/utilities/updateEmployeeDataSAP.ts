import type { Get, Set, UpdateEmployeeDataSAPPayload } from "../types";

import { UsersEmployeeDataSAP } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Updates SAP debtor and client codes for an employee.
 */
export const updateEmployeeDataSAP = async (
  set: Set,
  _get: Get,
  payload: UpdateEmployeeDataSAPPayload,
): Promise<boolean> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);

    await put(UsersEmployeeDataSAP, {
      id_employee: payload.idEmployee,
      creditor_number: payload.creditor_number,
      code: payload.code,
    });

    set({
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
