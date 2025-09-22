'use client';

import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { AddActivities } from './components';
import { useActivitiesStore } from '@/app/stores/useActivitiesStore/useActivitiesStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';

const Activities: React.FC = () => {
  const setActivities = useActivitiesStore((state) => state.setActivities);

  const { report, isReportHydrated } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      isReportHydrated: state.isReportHydrated,
    }),
    shallow
  );

  const hydratedOnceRef = useRef(false);

  useEffect(() => {
    if (hydratedOnceRef.current) return;
    if (!isReportHydrated) return;

    const existing = report.activities ?? [];
    setActivities(existing);

    hydratedOnceRef.current = true;
  }, [isReportHydrated, report.activities, setActivities]);

  return <AddActivities />;
};

export default Activities;
