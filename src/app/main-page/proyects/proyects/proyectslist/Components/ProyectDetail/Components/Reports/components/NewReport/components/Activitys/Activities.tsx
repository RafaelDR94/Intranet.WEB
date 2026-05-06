"use client"
'use client';

import React from 'react';

import useActitivities from './hooks/useActivities';
import { AddActivities } from './components';


const Activities: React.FC = () => {

   const {report,canStart}=useActitivities();
  if (canStart) return <AddActivities hideAdd={Boolean(report?.clientsign?.url)}/>;
};

export default Activities;
