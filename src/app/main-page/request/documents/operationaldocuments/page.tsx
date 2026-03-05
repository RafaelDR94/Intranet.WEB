"use client"

import React from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import DocumentViewer from "@/app/components/DocumentViewer/DocumentViewer";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DocIcon from "@/assets/icons/Docs/page.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import { useOperationalDocuments } from "@/app/main-page/humanresources/documents/operationaldocuments/hooks/useOperationalDocuments";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const OperationalDocuments = () => {
  const { rows } = useOperationalDocuments();
  const [open, setOpen] = React.useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  useTutorialAutoRun({
    moduleId: "request-documents-operational",
    tutorialId: "request-documents-operational:table",
  });

  const handleOpen = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileUrl(null);
  };

  const handleDownload = async (fileUrl: string, fileName?: string) => {
    try {
      if (!fileUrl) return;

      const response = await fetch(fileUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Error al obtener el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "documento.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("No se pudo descargar el documento. Verifica la ruta o conexión.");
    }
  };

  const desktopColumns: ColumnDefinition<ManagementDocumentTableRow>[] = [
    {
      key: "files" as unknown as keyof ManagementDocumentTableRow,
      label: "FORMATO",
      render: (row) => (
        <div>
          {row.route && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={DocIcon}
              onClick={() => handleOpen(row.route!)}
              data-tour="request-documents-operational-open"
            />
          )}
        </div>
      ),
    },
    {
      key: "datecreated",
      label: "FECHA",
      render: (row) => row.datecreated || "",
    },
    { key: "code", label: "CLAVE" },
    {
      key: "description",
      label: "DESCRIPCIÓN",
    },
    { key: "documentType", label: "TIPO" },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          <Button
            size="xsmall"
            variant="ghost"
            icon={DownloadIcon}
            onClick={() => handleDownload(row.route!, row.description)}
            data-tour="request-documents-operational-download"
          />
        </div>
      ),
      invisible: false,
    },
  ];

  const mobileColumns: ColumnDefinition<ManagementDocumentTableRow>[] = [
    {
      key: "description",
      label: "DESCRIPCIÓN",
      cellClass: "truncate w-[180px]",
    },
    { key: "documentType", label: "TIPO", headerClass: "w-[100px] flex-none", cellClass: "w-[140px] flex-none" },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          <Button
            size="xsmall"
            variant="ghost"
            icon={DownloadIcon}
            onClick={() => handleDownload(row.route!, row.description)}
            data-tour="request-documents-operational-download"
          />
        </div>
      ),
      invisible: false,
    },
  ];

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <section className="space-y-8">
      <div data-tour="request-documents-operational-table">
        <DataTable<ManagementDocumentTableRow>
          tables={[
            {
              title: "",
              enableCollaps: false,
              data: rows,
              columns,
              defaultSortKey: "name",
            },
          ]}
          textSize={{ mobile: "c2", desktop: "text-c2" }}
          enableInternalSearch
          searchableKeys={["name", "code", "description", "documentType", "department"]}
          showCalendar={false}
          showRefresh={true}
          showFilter={false}
          showButton={false}
          dateKey={(row) => row.rawDate ?? row.date}
          searchDataTour="request-documents-operational-search"
          refreshDataTour="request-documents-operational-refresh"
          actionsRender={() => ""}
        />
      </div>

      {open && selectedFileUrl && (
        <DocumentViewer
          fileUrl={selectedFileUrl}
          title="Documentos Operativos"
          onClose={handleClose}
        />
      )}
    </section>
  );
};

export default OperationalDocuments;
