"use client";
import React from "react";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { Label } from "@/app/components/Label/Label";
import SideMenu from "./components/SideMenu";
import { InvoicesProvider } from "../invoices/context/InvoicesContext";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import useHistory from "./hooks/useHistory";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

const PersonalInvoicesHistory = () => {
  const { panelOpen, setPanelOpen, selected, setSelected, rejected, history } =
    useHistory();
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

  const columnsDesktop: ColumnDefinition<HistoryRow>[] = [
    {
      key: "files" as unknown as keyof HistoryRow,
      label: "ARCHIVOS",
      render: (row) => (
        <div className="flex items-center gap-2 justify-center">
          {row.xml && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={XMLIcon}
              onClick={() => window.open(row.xml, "_blank")}
            />
          )}
          {row.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              onClick={() => window.open(row.pdf, "_blank")}
            />
          )}
          {row.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              onClick={() => window.open(row.image, "_blank")}
            />
          )}
        </div>
      ),
    },
    {
      key: "project",
      label: "PROYECTO",
      render: (row) => (
        <span>{row.project?.proyectKey ?? row.project?.id}</span>
      ),
    },
    {
      key: "requisitionkey",
      label: "CÓDIGO DE SOLICITUD",
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={row?.status?.toLocaleLowerCase() as any}
          text={row.status.toUpperCase()}
        />
      ),
    },
    {
      key: "dateCreate",
      label: "FECHA DE CREACIÓN",
    },

    {
      key: "details" as unknown as keyof HistoryRow,
      label: "DETALLES",
      render: (row) => (
        <>
          {currentPagePermissions?.canSeeDetails && <Button
            size="small"
            variant="ghost"
            hideIcon
            onClick={() => {
              setSelected(row);
              setPanelOpen(true);
            }}
          >
            Ver Detalle
          </Button>}
        </>


      ),
    },
  ];

  const columnsMobile: ColumnDefinition<HistoryRow>[] = [
    {
      key: "requisitionkey",
      label: "C. SOLICITUD",
    },
    {
      key: "project",
      label: "PROYECTO",
      render: (row) => (
        <span>{row.project?.proyectKey ?? row.project?.id}</span>
      ),
    },
    {
      key: 'details' as unknown as keyof HistoryRow,
      label: '',
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          onClick={() => {
            setSelected(row)
            setPanelOpen(true)
          }}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          showButton={false}
          showDownloadTable
          tables={[
            {
              data: rejected,
              columns,
              enableSelection: true,
              title: "Rechazadas",
              enableCollaps: true,
              defaultSortKey: "dateCreate",
              defaultSortDirection: "desc",
            },
          ]}
        />

        <DataTable
          showDownloadTable
          showButton={false}
          tables={[
            {
              data: history,
              columns,
              enableSelection: true,
              title: "Historial",
              enableCollaps: true,
              defaultSortKey: "dateCreate",
              defaultSortDirection: "desc",
            },
          ]}
        />
      </div>

      <InvoicesProvider>
        <SideMenu
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          selected={selected}
        />
      </InvoicesProvider>
    </>
  );
};

export default PersonalInvoicesHistory;
