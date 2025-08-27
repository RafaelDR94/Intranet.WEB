import React from 'react';
import PerDiemBalanceCard from './PerDiemBalanceCard';

export const PerDiemBalanceCardCatalog: React.FC = () => (
  <PerDiemBalanceCard
    startDate="2025-01-01"
    endDate="2025-01-10"
    requestedAmount={1000}
    verifiedAmount={600}
    enterpriseAmount={300}
    employeeAmount={100}
    elapsedDays={3}
    totalDays={5}
    percentage={60}
  />
);
