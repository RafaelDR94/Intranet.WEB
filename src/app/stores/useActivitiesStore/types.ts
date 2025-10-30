import type { Activities } from '@/app/mappings/reports/reports.types';

export interface ActivitiesStoreState {
  activities: Activities[];
  addActivity: (activity: Activities) => Activities[];
  updateActivity: (index: number, activity: Activities) => Activities[];
  removeActivity: (index: number) => Activities[];
  setActivities: (items: Activities[]) => Activities[];
  reset: () => void;
}

