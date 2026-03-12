"use client"

import React from "react";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DocIcon from "@/assets/icons/Docs/page.svg";
import DowloadIcon from "@/assets/icons/acciones/download.svg";
import { useManagementDocuments } from "@/app/main-page/humanresources/documents/managementdocuments/hooks/useManagementDocuments";
import DocumentViewer from "@/app/components/DocumentViewer/DocumentViewer";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const ManagementDocuments = () => {
  const { rows } = useManagementDocuments();
  const [open, setOpen] = React.useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  useTutorialAutoRun({
    moduleId: "request-documents-management",
    tutorialId: "request-documents-management:table",
  });
  const handleOpen = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileUrl(null);
  };

  // 🔹 Función mejorada: descarga directa del archivo sin abrir nueva pestaña
  const handleDownload = async (fileUrl: string, fileName?: string) => {
    try {
      if (!fileUrl) return;

      const response = await fetch(fileUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Error al obtener el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "documento.pdf"; // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpieza de memoria
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
              onClick={() => handleOpen(row.route!)} // Abre el visor dinámico
              data-tour="request-documents-management-open"
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
          {/* 🔹 Botón para descargar el documento correspondiente */}
          <Button
            size="xsmall"
            variant="ghost"
            icon={DowloadIcon}
            onClick={() => handleDownload(row.route!, row.description)}
            data-tour="request-documents-management-download"
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
      headerClass: "w-[150px] flex-none",
      cellClass: "truncate w-[180px]",
    },
    { key: "documentType", label: "TIPO", headerClass: "w-[100px] flex-none", cellClass: "w-[140px] flex-none" },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          {/* 🔹 Botón para descargar el documento correspondiente */}
          <Button
            size="xsmall"
            variant="ghost"
            icon={DowloadIcon}
            onClick={() => handleDownload(row.route!, row.description)}
            data-tour="request-documents-management-download"
          />
        </div>
      ),
      invisible: false,
    },
  ];

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <section className="space-y-8">
      <div data-tour="request-documents-management-table">
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
          searchDataTour="request-documents-management-search"
          refreshDataTour="request-documents-management-refresh"
          actionsRender={() => ""}
        />
      </div>

      {/* 🔹 DocumentViewer dinámico */}
      {open && selectedFileUrl && (
        <DocumentViewer
          fileUrl={selectedFileUrl}
          title="Formato Universal de Incidencias"
          onClose={handleClose}
        />
      )}
    </section>
  );
};

export default ManagementDocuments;
