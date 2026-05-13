"use client"

import React, { useCallback, useMemo } from 'react'

import ReportDetails from './components/ReportDetails/ReportDetails'
import useReportsTable from './hooks/useReportsTable'
import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition, DataTableGroup } from '@/app/components/DataTable/types'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import { ReportsTable as ReportsTableI } from '@/app/mappings/reports/reports.types'
import { PopUp } from '@/app/components/PopUp/PopUp'
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import NewReport from './components/NewReport/NewReport'
import Label from '@/app/components/Label/Label'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import dostIcon from '@/assets/icons/navegacion/more-vert.svg'
const ReportsTable: React.FC = () => {
  const { user, currentPagePermissions } = useAuth();
  const canSeeAllReports = currentPagePermissions?.canSeeAllReports;
  
  const {
    reportPendingDelete,
    setReportPendingDelete,
    handleEdit,
    reportList,
    newReport,
    isMobile,
    currentReport,
    reportLocalList,
    forceActionButton,
    reportId,
    reportIdFront,
    handleClosePanel,
    handleDownloadPicReport,
    handleDownloadDigitalReport,
    handleDelete, handleNewReport,
    handleSelectReportOnline,
    handleSelectReportOffline,
    controlFilterOptions,
    handleFilterChange,
    activeFilter
  } = useReportsTable({ canSeeAllReports });
  const buildColumns = useCallback(
    (forceButton: boolean, online: boolean): ColumnDefinition<ReportsTableI>[] => {
      if (isMobile) {
        return [
          {
            key: 'datecreate',
            label: 'FECHA',
            cellClass: 'w-30 text-left pr-2',
            headerClass: 'w-30 text-left',
          },

          {
            key: 'ticket',
            label: 'TICKET',
            cellClass: 'w-40 text-left',
            headerClass: 'w-40 text-left',
          },
          {
            key: 'type',
            label: 'Tipo',
            cellClass: 'w-25 text-left',
            headerClass: 'w-25 text-left',
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex justify-end pr-2">
                {currentPagePermissions?.reportdetails && (
                  <Button
                    size="xsmall"
                    variant="ghost"
                    icon={dostIcon}
                    aria-label="Ver Detalle"
                    onClick={() => online ? handleSelectReportOnline(row, { forceButton }) : handleSelectReportOffline(row, { forceButton })}
                  >

                  </Button>
                )}
              </div>
            ),
          },
        ] as ColumnDefinition<ReportsTableI>[];
      }

      return [
        {
          key: 'datecreate',
          label: 'FECHA',
        },
        {
          key: 'ticket',
          label: 'TICKET',
        },
        {
          key: 'type',
          label: 'TIPO',

        },
        {
          key: 'category',
          label: 'CATEGORÍA',

        },
        {
          key: 'location',
          label: 'UBICACIÓN',

        },
        {
          key: 'employe',
          label: 'USUARIO',
          render: (row) => (online ? row.employe : user?.fullName)
        },
        {
          key: 'status',
          label: '',
          render: (row) => {
            const status = row?.status;
            return (
              <Label type={status.type.toLocaleLowerCase() as any} text={status.text} />
            );
          },
        },
        {
          key: 'actions',
          label: '',
          render: (row) => (
            <div className="flex justify-end pr-2">
              {currentPagePermissions?.reportdetails && (
                <Button
                  size="small"
                  variant="ghost"
                  hideIcon
                  aria-label="Ver Detalle"
                  onClick={() => online ? handleSelectReportOnline(row, { forceButton }) : handleSelectReportOffline(row, { forceButton })}
                >
                  Ver Detalle
                </Button>
              )}
            </div>
          ),
          cellClass: 'w-40 text-right',
          headerClass: 'w-40 text-right',
        },
      ] as ColumnDefinition<ReportsTableI>[];
    },
    [currentPagePermissions, handleSelectReportOnline, isMobile]
  );

  const columns = useMemo(() => buildColumns(false, true), [buildColumns]);
  const localColumns = useMemo(() => buildColumns(true, false), [buildColumns]);

  const localTableConfig = useMemo<DataTableGroup<ReportsTableI> | null>(() => {
    if (reportLocalList.length === 0) {
      return null;
    }

    return {
      title: 'Reportes Locales',
      columns: localColumns,
      data: reportLocalList,
      enableSelection: false,
      enableCollaps: true,
      defaultSortKey: 'datecreate',
      defaultSortDirection: 'desc',
    };
  }, [localColumns, reportLocalList]);

  const remoteTableConfig = useMemo<DataTableGroup<ReportsTableI>>(
    () => ({
      title: 'Historial',
      columns,
      data: reportList ?? [],
      enableSelection: false,
      enableCollaps: true,
      defaultSortKey: 'datecreate',
      defaultSortDirection: 'desc',
    }),
    [columns, reportList]
  );



  const shouldShowActionButton =
    !!currentReport &&
    (forceActionButton ||
      (currentReport?.employe?.employee_id == user?.idEmployee && !currentReport?.clientsign?.url));

  if (newReport) {
    return <NewReport />;
  }

  return (

    <div >
      <div className="flex justify-end m-0">
        {!isMobile && <Button onClick={handleNewReport} hideIcon>Nuevo Reporte</Button>}
      </div>
      <DetailsPanelLayout
        open={!!reportId || !!reportIdFront}
        actionButton={
          shouldShowActionButton && currentReport ? (
            <div className="flex items-center gap-2">
              <Button hideIcon onClick={() => handleEdit(currentReport)}>
                Completar
              </Button>
              <Button hideIcon onClick={() => setReportPendingDelete(currentReport)} variant='outline'>
                Eliminar
              </Button>
            </div>

          ) : null
        }
        renderActions={() => (
          <div >
            {currentReport &&
              <>
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={PDFIcon}
                  onClick={() => handleDownloadPicReport()}
                />

                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={XMLIcon}
                  onClick={() => handleDownloadDigitalReport()}
                />
              </>
            }

          </div>
        )}
        onClose={handleClosePanel}
        expanded={isMobile}
      >
        <ReportDetails />
      </DetailsPanelLayout>
      {localTableConfig && (
        <DataTable<ReportsTableI>
          tables={[localTableConfig]}
          enableInternalSearch
          dateKey={"datecreate"}
          showCalendar
          showFilter={false}
          showButton={false}
          textSize={{ mobile: "text-c1" }}
          rowsPerPage={3}
          dataTableTitle={'Reportes Locales'}
        />
      )}

      <DataTable<ReportsTableI>
        tables={[remoteTableConfig]}
        enableInternalSearch
        showCalendar
        dateKey={"datecreate"}
        showFilter={true}
        showButton={false}
        showDownloadTable={false}
        rowsPerPage={3}
        textSize={{ mobile: "text-c1" }}
        dataTableTitle={'Historial de reportes'}
        filterOptions={controlFilterOptions}
        filterValue={activeFilter}
        onFilterChange={(value) => {
          handleFilterChange(value);
        }}
      />

      <div className="flex justify-center m-0 w-full">
        {isMobile && <Button className='w-full' onClick={handleNewReport} hideIcon>Nuevo Reporte</Button>}
      </div>

      <PopUp
        open={Boolean(reportPendingDelete)}
        onClose={() => setReportPendingDelete(null)}
        title='Eliminar reporte'
        content={
          reportPendingDelete
            ? `Deseas eliminar el reporte "${reportPendingDelete?.ticket ?? reportPendingDelete?.reportcategories.name ?? reportPendingDelete?.reportcategories.typesofreports.name ?? reportPendingDelete?.id ?? 'sin identificador'}"? Esta accion no se puede deshacer.`
            : ''
        }
        showPrimaryButton
        primaryButtonText='Eliminar'
        onPrimaryButtonClick={async () => {
          if (!reportPendingDelete) return
          const deleted = await handleDelete(reportPendingDelete)
          if (deleted) {
            setReportPendingDelete(null)
          }
        }}
        showSecondaryButton
        secondaryButtonText='Cancelar'
      />
    </div>
  )
}

export default ReportsTable;
