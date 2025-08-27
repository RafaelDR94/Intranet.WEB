import React from 'react';
import Donut from './Donut';

export const DonutCatalog: React.FC = () => (
  <div className="flex gap-6 p-6">
    <Donut percentage={25} />
    <Donut percentage={50} />
    <Donut percentage={75} />
  </div>
);
