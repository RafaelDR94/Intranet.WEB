import React from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import useInformation from './hooks/useInformation';

import InfoCards from '@/app/components/InfoCards/InfoCards';
import ProgressCard from '@/app/components/ProgressCard/ProgressCard';
const Information: React.FC = () => {
  const { cards, progressPct, currentReport } = useInformation();
  if (!currentReport) {
    return <div className="text-sm text-gray-500 p-2">Obteniendo reporte seleccionado.</div>;
  }
  return (
    <div className="space-y-4 w-full">
      <EmployeeName />
      <div className="w-full mx-auto max-w-6xl">
        <ProgressCard percentage={progressPct} />
      </div>
      <InfoCards
        cards={cards || []}
        maxWidthClassName="max-w-6xl"
        dataTestId="report-info-cards"
        responsiveLayoutMatrix={{ sm: [[10], [10], [10], [10], [10], [10]], md: [[5, 5], [10], [10], [10], [10], [10]] }}
      />
    </div>
  );
};

export default Information;
