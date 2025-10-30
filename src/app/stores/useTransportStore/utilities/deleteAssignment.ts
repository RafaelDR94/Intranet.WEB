'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportAssigments as TransportAssignmentsUrl,
} from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const deleteAssignment = async (
  set: SetState,
  get: GetState,
  id: string
): Promise<boolean> => {
  set({
    deletingAssignment: true,
    error: undefined,
    warning: undefined,
    successDeleteAssignment: false,
  });

  try {
    const del = pDelete(requireGateway("del"), [200, 204]);
    const _res: AxiosResponse = await del(`${TransportAssignmentsUrl}/${id}`);

    set((state) => ({
      assignments: state.assignments.filter(
        (assignment) => assignment.vehicleassignments_id !== id
      ),
      currentAssignment:
        state.currentAssignment?.vehicleassignments_id === id
          ? undefined
          : state.currentAssignment,
      deletingAssignment: false,
      successDeleteAssignment: true,
    }));

    return true;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      deletingAssignment: false,
      successDeleteAssignment: false,
      error: err.message,
    });
    return false;
  }
};

