"use client"
import React from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import SignatureBox from '@/app/components/SignatureBox/SignatureBox';
import { useReportsStore } from '@/app/stores/useReportsStore/useReportsStore';

const Signatures: React.FC = () => {
  const { currentReport } = useReportsStore();
  const employeeSignUrl = currentReport?.employeesignurl ?? '';
  const client = currentReport?.clientsign;
  const clientSignUrl = client?.url ?? '';
  const clientName = client?.clientname ?? '';
  const clientWork = client?.clientworkposition ?? '';
  const clientDateTime =client?.datetime

  return (
    <div className="w-full mx-auto max-w-6xl">
      <EmployeeName />
      <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <SignatureBox title="Firma responsable" imageUrl={employeeSignUrl} />
        <SignatureBox
          title="Firma cliente"
          imageUrl={clientSignUrl}
          captionTop={[clientName, clientWork].filter(Boolean).join(' — ') || undefined}
          captionBottom={clientDateTime}
        />
      </div>
    </div>
  );
};

export default Signatures;
