'use client';
import React from 'react';

import { useExcelLoader } from './hooks/useExcelLoader';

import FileUploaderExpanded from '@/app/components/FileUploaderexpanded/FileUploaderExpanded';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import { useAuth } from '@/app/context/AuthContext/AuthContext';
/**
 * Componente que permite subir un archivo de requisiciones en formato Excel
 * y delega la lógica del proceso al hook `useExcelLoader`.
 */
const ExcelLoader = () => {
  const { handleFile, onSubmit, buttonDisabled } = useExcelLoader();
  const { currentPagePermissions } = useAuth();


  if (currentPagePermissions?.addMultiple) return (
    <FormsLayout
      title="Sube aquí tus requisiciones"
      primaryLabel="Subir Archivo"
      onPrimaryClick={onSubmit}
      primaryDisabled={buttonDisabled}
      enableCollapse={true}
      primaryButtonDataTour="requisitions-upload-submit"
    >
      <FileUploaderExpanded
        accept=".xlsx,.xls"
        onFile={handleFile}
        label="Selecciona el archivo excel a subir"
      />

    </FormsLayout>
  );

};

export default ExcelLoader;
