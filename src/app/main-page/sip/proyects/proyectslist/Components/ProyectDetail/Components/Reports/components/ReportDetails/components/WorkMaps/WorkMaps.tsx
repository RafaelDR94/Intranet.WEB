"use client";
import React from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import useWorkMaps from './hooks/useWorkMaps';

import ActivitiesViewer from '@/app/components/ActivitiesViewer/ActivitiesViewer';
const WorkMaps: React.FC = () => {
  const { items } = useWorkMaps();

  return (
    <div className="w-full">
      <EmployeeName />
      <ActivitiesViewer items={items} />
    </div>
  );
};

export default WorkMaps;
