"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DocumentActionsMenuCell from "@/app/main-page/request/documents/components/DocumentActionsMenuCell/DocumentActionsMenuCell";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DocIcon from "@/assets/icons/Docs/page.svg";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useOperationalDocuments } from "./hooks/useOperationalDocuments";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
import DownloadIcon from "@/assets/icons/acciones/download.svg";

const OperationalDocuments = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { rows, refresh, deleteDocument, deletingDocument } =
    useOperationalDocuments();
  useTutorialAutoRun({
    moduleId: "humanresources-operationaldocuments",
    tutorialId: "humanresources-operationaldocuments:table",
  });
  const { currentPagePermissions } = useAuth();
  const canDowload = currentPagePermissions?.canDownload;
  const createDocument = currentPagePermissions?.createDocument ?? true;
  const canEdit = currentPagePermissions?.canEdit ?? true;
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
              data-tour="humanresources-operationaldocuments-open"
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
      headerClass: "flex-[1.2]",
      cellClass: "flex-[1.2] pr-4",
    },
    {
      key: "documentType",
      label: "TIPO",
      headerClass: "flex-[1.8] pl-6",
      cellClass: "flex-[1.8] pl-6",
    },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) =>
        canEdit === true ? (
          <div
            className="flex justify-end pr-2"
            data-tour="humanresources-managementdocuments-actions"
          >
            <DocumentActionsMenuCell
              row={row}
              onView={handleViewDocument}
              onDelete={handleRequestDelete}
            />
          </div>
        ) : (
          <div
            className="flex justify-end pr-2"
            data-tour="humanresources-managementdocuments-actions"
          >
            <Button variant="ghost" icon={DownloadIcon} />
          </div>
        ),
      invisible: false,
    },
  ];

  const columnsMobile: ColumnDefinition<ManagementDocumentTableRow>[] = [
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
              data-tour="humanresources-operationaldocuments-open"
            />
          )}
        </div>
      ),
    },
    { key: "code", label: "CLAVE" },
    { key: "documentType", label: "TIPO" },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) => (
        <div
          className="flex justify-end pr-2"
          data-tour="humanresources-operationaldocuments-actions"
        >
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
      <div data-tour="humanresources-operationaldocuments-table">
        <DataTable<ManagementDocumentTableRow>
          tables={[
            {
              title: "",
              enableCollaps: false,
              enableSelection: canDowload,
              data: rows,
              columns: isMobile ? columnsMobile : columns,
              defaultSortKey: "name",
            },
          ]}
          showRefresh={true}
          onRefreshPage={handleRefresh}
          textSize={{ mobile: "text-d3", desktop: "text-c2" }}
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
          showDownloadTable={canDowload}
          dateKey={(row) => row.rawDate ?? row.date}
          searchDataTour="humanresources-operationaldocuments-search"
          refreshDataTour="humanresources-operationaldocuments-refresh"
          actionsRender={() =>
            createDocument === true ? (
              <div className="flex w-full items-center justify-end gap-3">
                <Button
                  size="medium"
                  variant="solid"
                  hideIcon
                  className={isMobile ? "w-full" : ""}
                  onClick={() =>
                    router.push(
                      "/main-page/humanresources/documents/documentregistry",
                    )
                  }
                  data-tour="humanresources-operationaldocuments-create"
                >
                  Nuevo Documento
                </Button>
              </div>
            ) : null
          }
        />
      </div>

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
