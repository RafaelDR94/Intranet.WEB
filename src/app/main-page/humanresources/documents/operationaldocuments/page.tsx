"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DocumentActionsMenuCell from "@/app/main-page/humanresources/documents/components/DocumentActionsMenuCell";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DocIcon from "@/assets/icons/Docs/page.svg";

import { useOperationalDocuments } from "./hooks/useOperationalDocuments";

const OperationalDocuments = () => {
  const router = useRouter();
  const { rows, loading, error, refresh, deleteDocument, deletingDocument } =
    useOperationalDocuments();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] =
    React.useState<ManagementDocumentTableRow | null>(null);

  const handleViewDocument = React.useCallback(
    (row: ManagementDocumentTableRow) => {
      if (!row.id) return;

      router.push(
        `/main-page/humanresources/documents/documentregistry?documentId=${encodeURIComponent(
          row.id,
        )}`,
      );
    },
    [router],
  );

  const handleRefresh = React.useCallback(() => {
    refresh();
  }, [refresh]);

  const handleRequestDelete = React.useCallback(
    (row: ManagementDocumentTableRow) => {
      setSelectedDocument(row);
      setDeleteDialogOpen(true);
    },
    [],
  );

  const handleCloseDelete = React.useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!selectedDocument?.id || deletingDocument) return;

    const success = await deleteDocument(selectedDocument.id);
    if (success) {
      handleCloseDelete();
    }
  }, [deleteDocument, deletingDocument, handleCloseDelete, selectedDocument]);

  const columns: ColumnDefinition<ManagementDocumentTableRow>[] = [
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
              onClick={() => window.open(row.route, "_blank")}
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
          <DocumentActionsMenuCell
            row={row}
            onView={handleViewDocument}
            onDelete={handleRequestDelete}
          />
        </div>
      ),
      invisible: false,
    },
  ];

  return (
    <section className="space-y-8">
      <DataTable<ManagementDocumentTableRow>
        tables={[
          {
            title: "",
            enableCollaps: false,
              enableSelection: true,
            data: rows,
            columns,
            defaultSortKey: "name",
          },
        ]}
        showRefresh={true}
        onRefreshPage={handleRefresh}
        textSize={{ mobile: "c2", desktop: "text-c2" }}
        enableInternalSearch
        searchableKeys={[
          "name",
          "code",
          "description",
          "documentType",
          "department",
        ]}
        showCalendar={false}
        showFilter={false}
        showButton={false}
        showDownloadTable
        dateKey={(row) => row.rawDate ?? row.date}
        actionsRender={() => (
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              size="medium"
              variant="solid"
              hideIcon
              onClick={() => router.push('/main-page/humanresources/documents/documentregistry')}
            >
              Nuevo Documento
            </Button>
          </div>
        )}
      />
      
      <PopUp
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        title="Eliminar Documento"
        content={
          deletingDocument
            ? "Eliminando documento…"
            : selectedDocument?.name
            ? `Esta acción confirmará la eliminación del documento seleccionado`
            : "¿Deseas eliminar el documento?"
        }
        showPrimaryButton
        primaryButtonText="Eliminar"
        onPrimaryButtonClick={handleConfirmDelete}
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseDelete}
      />
    </section>
  );
};

export default OperationalDocuments;
