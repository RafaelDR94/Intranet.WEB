"use client";
import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { DeviceAssignmentResponsiveUrlState } from "./types";
import { updateDeviceAssignmentResponsiveUrl } from "./utilities";

/**
 * Store global para responsivas de asignacion de dispositivos.
 */
export const useDeviceAssignmentResponsiveUrlStore =
  createWithEqualityFn<DeviceAssignmentResponsiveUrlState>()(
    devtools((set, get) => ({
      assignmentResponsive: undefined,
      updating: false,
      successPut: false,
      error: undefined,
      updateDeviceAssignmentResponsiveUrl: (payload) =>
        updateDeviceAssignmentResponsiveUrl(set, get, payload),
      reset: () =>
        set({
          assignmentResponsive: undefined,
          updating: false,
          successPut: false,
          error: undefined,
        }),
      resetFlags: () =>
        set({
          updating: false,
          successPut: false,
          error: undefined,
        }),
    })),
  );
