'use client';

import { createWithEqualityFn } from 'zustand/traditional';

import type { ActivitiesStoreState } from './types';

const initialState = { activities: [] as ActivitiesStoreState['activities'] };

export const useActivitiesStore = createWithEqualityFn<ActivitiesStoreState>()((set) => ({
  ...initialState,
  addActivity: (activity) => {
    let updated: ActivitiesStoreState['activities'] = [];
    set((state) => {
      updated = [...state.activities, activity];
      return { activities: updated };
    });
    return updated;
  },
  removeActivity: (index) => {
    let updated: ActivitiesStoreState['activities'] = [];
    set((state) => {
      updated = state.activities.filter((_, idx) => idx !== index);
      return { activities: updated };
    });
    return updated;
  },
  setActivities: (items) => {
    const snapshot = items.slice();
    set({ activities: snapshot });
    return snapshot;
  },
  reset: () => {
    set(initialState);
  },
}));

export default useActivitiesStore;
