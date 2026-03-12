"use client"
import React from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import useActivities from './hooks/useActivities';

import ActivitiesViewer from '@/app/components/ActivitiesViewer/ActivitiesViewer';
const Activities: React.FC = () => {
  const { items } = useActivities();

  return (
    <div className="w-full">
      <EmployeeName />
      <ActivitiesViewer items={items} />
    </div>
  );
};

export default Activities;
