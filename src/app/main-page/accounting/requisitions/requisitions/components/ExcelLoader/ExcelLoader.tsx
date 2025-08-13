'use client';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import FileUploaderExpanded from '@/app/components/FileUploaderexpanded/FileUploaderExpanded';
import { useExcelLoader } from './hooks/useExcelLoader';

const ExcelLoader = () => {
  const { handleFile, onSubmit, buttonDisabled } = useExcelLoader();

  return (
    <FormsLayout
      title="Sube aquí tus requisiciones"
      primaryLabel="Subir Archivo"
      onPrimaryClick={onSubmit}
      primaryDisabled={buttonDisabled}
      enableCollapse={false}
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
