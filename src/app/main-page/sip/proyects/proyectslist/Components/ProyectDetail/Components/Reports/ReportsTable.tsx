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
const ReportsTable: React.FC = () => {
  const { currentReport, reports, setCurrent, reportId, handleCloseDetails, handleDownloadPicReport, handleDownloadDigitalReport } = useReportsTable()

  const columns: ColumnDefinition<ReportView>[] = useMemo(() => [
    {
      key: 'datecreate',
      label: 'FECHA',

    },

    {
      key: 'ticket',
      label: 'TICKET',
      render: (r) => (r as any)?.ticket ?? (r as any)?.folio ?? r.id ?? '—',
    },
    {
      key: 'type',
      label: 'TIPO',
      render: (r) => {
        return r.reportcategories?.typesofreports?.name ?? r.type ?? '—'
      },
    },
    {
      key: 'category' as keyof Report,
      label: 'CATEGORÍA',
      render: (r) => r.reportcategories?.name ?? '—',
    },
    {
      key: 'location' as keyof Report,
      label: 'UBICACIÓN',
      render: (r) => (r as any)?.location?.name ?? (r as any)?.ubication ?? '—',
    },
    {
      key: 'actions' as unknown as keyof Report,
      label: '',
      render: (row) => (
        <div className="flex justify-end pr-2">
          <Button size="small" variant="ghost" hideIcon onClick={() => setCurrent(row)}>
            Ver Detalle
          </Button>
        </div>
      ),
      cellClass: 'w-40 text-right',
      headerClass: 'w-40 text-right',
    },
  ] as ColumnDefinition<ReportView>[], [setCurrent])

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
          title: 'Reportes',
          columns,
          data: reports,
          enableSelection: false,
          enableCollaps: false,
          defaultSortKey: 'datecreate' as any,
          defaultSortDirection: 'desc',
        }]}
        enableInternalSearch
        // searchableKeys={searchableKeys as any}
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
