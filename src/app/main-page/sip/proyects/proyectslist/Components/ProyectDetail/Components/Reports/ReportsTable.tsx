'use client'

import React, { useMemo } from 'react'

import ReportDetails from './components/ReportDetails/ReportDetails'
import useReportsTable from './hooks/useReportsTable'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'
import { ReportView } from '@/app/mappings/reports/reports.types'
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import NewReport from './components/NewReport/NewReport'
import Label from '@/app/components/Label/Label'

const ReportsTable: React.FC = () => {
  const { newReport, isMobile, currentPagePermissions, currentReport, reports, setCurrent, reportId, handleCloseDetails, handleDownloadPicReport, handleDownloadDigitalReport } = useReportsTable()
  if (newReport) return (<NewReport />)
  const columns: ColumnDefinition<ReportView>[] = useMemo(() => {
    if (isMobile) return ([{
      key: 'datecreate',
      label: 'FECHA',

    },

    {
      key: 'ticket',
      label: 'TICKET',
      render: (r) => (r as any)?.ticket ?? (r as any)?.folio ?? r.id ?? '??"',
    },
    {
      key: 'location' as keyof Report,
      label: 'UBICACI?"N',
      render: (r) => (r as any)?.location?.name ?? (r as any)?.ubication ?? '??"',
    },
    {
      key: 'actions' as unknown as keyof Report,
      label: '',
      render: (row) => (
        <div className="flex justify-end pr-2">
          {currentPagePermissions?.reportdetails && (
            <Button
              size="small"
              variant="ghost"
              hideIcon
              aria-label="Ver Detalle"
              onClick={() => setCurrent(row)}
            >
              <span className="sr-only">Ver Detalle</span>
            </Button>
          )}

        </div>
      ),

    },
    ] as ColumnDefinition<ReportView>[])
    return (
      [
        {
          key: 'datecreate',
          label: 'FECHA',

        },

        {
          key: 'ticket',
          label: 'TICKET',
          render: (r) => (r as any)?.ticket ?? (r as any)?.folio ?? r.id ?? '??"',
        },
        {
          key: 'type',
          label: 'TIPO',
          render: (r) => {
            return r.reportcategories?.typesofreports?.name ?? r.type ?? '??"'
          },
        },
        {
          key: 'category' as keyof Report,
          label: 'CATEGOR??A',
          render: (r) => r.reportcategories?.name ?? '??"',
        },
        {
          key: 'location' as keyof Report,
          label: 'UBICACI?"N',
          render: (r) => (r as any)?.location?.name ?? (r as any)?.ubication ?? '??"',
        },
        {
          key: "status",
          label: "",
          render: (row) => {
            const obtainStatusLabel = (row: ReportView) => {
              if (row?.clientsign) return ({ text: "Completo", type: "valido" });
              else if (row?.activities?.length == 0) return ({ text: "Sin Act", type: "prohibido" });
              else if (!row?.employeesignurl) return ({ text: "Sin F.Cliente", type: "invalido" });

              else return ({ text: "No definido", type: "pendiente" });
            }
            const status = obtainStatusLabel(row);
            return (
              <Label type={status.type.toLocaleLowerCase() as any} text={status.text} />
            )
          }
        },
        {
          key: 'actions' as unknown as keyof Report,
          label: '',
          render: (row) => (
            <div className="flex justify-end pr-2">
              {currentPagePermissions?.reportdetails && (
                <Button
                  size="small"
                  variant="ghost"
                  hideIcon
                  aria-label="Ver Detalle"
                  onClick={() => setCurrent(row)}
                >
                  Ver Detalle
                </Button>
              )}

            </div>
          ),
          cellClass: 'w-40 text-right',
          headerClass: 'w-40 text-right',
        },
      ] as ColumnDefinition<ReportView>[]

    )
  }, [setCurrent, currentPagePermissions, isMobile])

  return (
    <div className="space-y-6">
      <DetailsPanelLayout
        open={!!reportId}
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
        onClose={() => handleCloseDetails()}
      >
        <ReportDetails />
      </DetailsPanelLayout>
      <DataTable<ReportView>
        tables={[{
          hidetitle: true,
          title: 'Reportes',
          columns,
          data: reports,
          enableSelection: false,
          enableCollaps: false,
          defaultSortKey: 'datecreate' as any,
          defaultSortDirection: 'desc',
        }]}
        enableInternalSearch
        showCalendar={false}
        showFilter={false}
        showButton={false}
        rowsPerPage={10}
        dataTableTitle={'Reportes del proyecto'}
      />

    </div>
  )
}

export default ReportsTable
