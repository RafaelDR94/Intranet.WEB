import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { ActivitiesViewerItem } from "@/app/components/ActivitiesViewer/types";

export type VehiclePictureType = "arrive" | "departure";
export type VehicleMediaKey = VehiclePictureType | "signature";

export type AssignmentMediaState = {
  pictures: Partial<Record<VehiclePictureType, ActivitiesViewerItem[]>>;
  signature?: string | null;
  loading: Partial<Record<VehicleMediaKey, boolean>>;
  errors: Partial<Record<VehicleMediaKey, string | undefined>>;
};

export type VehicleMediaStoreState = {
  mediaByAssignment: Record<string, AssignmentMediaState>;
  setPictures: (
    assignmentId: string,
    type: VehiclePictureType,
    items: ActivitiesViewerItem[]
  ) => void;
  setSignature: (assignmentId: string, url: string | null) => void;
  setLoading: (assignmentId: string, key: VehicleMediaKey, value: boolean) => void;
  setError: (
    assignmentId: string,
    key: VehicleMediaKey,
    value: string | undefined
  ) => void;
  resetAssignment: (assignmentId: string) => void;
  resetAll: () => void;
};

const createDefaultEntry = (): AssignmentMediaState => ({
  pictures: {},
  signature: undefined,
  loading: {},
  errors: {},
});

const useVehicleMediaStore = createWithEqualityFn<VehicleMediaStoreState>()(
  devtools((set) => ({
    mediaByAssignment: {},
    setPictures: (assignmentId, type, items) =>
      set((state) => {
        const prev = state.mediaByAssignment[assignmentId] ?? createDefaultEntry();
        return {
          mediaByAssignment: {
            ...state.mediaByAssignment,
            [assignmentId]: {
              ...prev,
              pictures: {
                ...prev.pictures,
                [type]: items,
              },
            },
          },
        };
      }),
    setSignature: (assignmentId, url) =>
      set((state) => {
        const prev = state.mediaByAssignment[assignmentId] ?? createDefaultEntry();
        return {
          mediaByAssignment: {
            ...state.mediaByAssignment,
            [assignmentId]: {
              ...prev,
              signature: url,
            },
          },
        };
      }),
    setLoading: (assignmentId, key, value) =>
      set((state) => {
        const prev = state.mediaByAssignment[assignmentId] ?? createDefaultEntry();
        return {
          mediaByAssignment: {
            ...state.mediaByAssignment,
            [assignmentId]: {
              ...prev,
              loading: {
                ...prev.loading,
                [key]: value,
              },
            },
          },
        };
      }),
    setError: (assignmentId, key, value) =>
      set((state) => {
        const prev = state.mediaByAssignment[assignmentId] ?? createDefaultEntry();
        return {
          mediaByAssignment: {
            ...state.mediaByAssignment,
            [assignmentId]: {
              ...prev,
              errors: {
                ...prev.errors,
                [key]: value,
              },
            },
          },
        };
      }),
    resetAssignment: (assignmentId) =>
      set((state) => {
        if (!(assignmentId in state.mediaByAssignment)) {
          return state;
        }
        const { [assignmentId]: _, ...rest } = state.mediaByAssignment;
        return {
          mediaByAssignment: rest,
        };
      }),
    resetAll: () =>
      set(() => ({
        mediaByAssignment: {},
      })),
  }))
);

export default useVehicleMediaStore;

