"use client"



import React from 'react'



import { DataTable } from '@/app/components/DataTable/DataTable'



import useAuthorizationList from './hooks/useAuthorizationList'

import type { AuthorizationListRow } from './types'



/**

 * Lista de solicitudes de autorización para el módulo de aprobaciones.

 */

const AuthorizationList = () => {

  const {

    columns,

    rows,

    filterOptions,

    filterValue,

    handleFilterChange,

    handleRefresh,

  } = useAuthorizationList()



  return (
    <div data-tour="authorizations-table">
      <DataTable<AuthorizationListRow>
        dataTableTitle="Solicitudes de aprobación"
        showCalendar
        showFilter
        showRefresh
        showButton={false}
        showDownloadTable={false}
        enableInternalSearch
        searchableKeys={['enterprise', 'department', 'applicant', 'kind', 'project', 'status']}
        filterOptions={filterOptions}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onRefreshPage={handleRefresh}
        dateKey={(row) => row.dateRaw}
        searchDataTour="authorizations-search"
        calendarDataTour="authorizations-calendar"
        filterDataTour="authorizations-filter"
        refreshDataTour="authorizations-refresh"
        tables={[
          {
            data: rows,
            columns,
            title: 'Solicitudes de aprobación',
            enableCollaps: false,
            defaultSortKey: 'dateRaw',
            defaultSortDirection: 'desc',
          },
        ]}
      />
    </div>
  )
}


export default AuthorizationList

