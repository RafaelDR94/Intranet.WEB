'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { ExpenseTypeCatalog as ExpenseTypeCatalogUrl } from '@/app/configurations/Axios/urls'
import { ExpenseTypeCatalogMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { ExpenseTypeCatalog } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchExpenseTypeCatalog = async (
  set: Set,
  get: Get,
  force = false,
): Promise<ExpenseTypeCatalog[] | null> => {
  if (get().expenseTypeCatalog?.length > 0 && !force) {
    set({
      gettingExpenseTypeCatalog: false,
      error: undefined,
      successExpenseTypeCatalog: true,
      expenseTypeCatalog: get().expenseTypeCatalog,
    })
    return get().expenseTypeCatalog
  }

  set({ gettingExpenseTypeCatalog: true, error: undefined, successExpenseTypeCatalog: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${ExpenseTypeCatalogUrl}`)
    const data: ExpenseTypeCatalog[] = res.data?.data.map((item: any) => ExpenseTypeCatalogMap(item))

    if (!data) {
      set({
        expenseTypeCatalog: undefined,
        gettingExpenseTypeCatalog: false,
        warning: 'Se recibio una respuesta vacia de ExpenseTypeCatalog',
      })
      return null
    }

    set({ expenseTypeCatalog: data, gettingExpenseTypeCatalog: false, successExpenseTypeCatalog: true })
    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, gettingExpenseTypeCatalog: false, successExpenseTypeCatalog: false })
    return null
  }
}
