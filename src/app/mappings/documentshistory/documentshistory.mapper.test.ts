import { describe, expect, it } from 'vitest'

import {
  DocumentHistoryDetailMap,
  DocumentsHistoryPageMap,
} from './documentshistory.mapper'

describe('documentshistory.mapper', () => {
  it('uses rfc_receptor as company fallback when no company name is available', () => {
    const page = DocumentsHistoryPageMap(
      {
        items: [
          {
            billingdocument_id: 'doc-1',
            employeename: 'Maria Gonzalez',
            rfc_receptor: 'BBB010101BBB',
            uuid: 'UUID-1',
            status: 'Validado',
          },
        ],
        totalRows: 1,
      },
      {
        page: 1,
        pageSize: 12,
        searchText: '',
        startDate: null,
        endDate: null,
        filter: '0',
        scope: 'accounting',
      },
    )

    expect(page.items[0]?.companyName).toBe('BBB010101BBB')
  })

  it('maps paginated metadata from totalRecords and pageNumber', () => {
    const page = DocumentsHistoryPageMap(
      {
        items: Array.from({ length: 12 }, (_, index) => ({
          billingdocument_id: `doc-${index + 1}`,
          employeename: 'Maria Gonzalez',
          rfc_receptor: 'BBB010101BBB',
          uuid: `UUID-${index + 1}`,
          status: 'Validado',
        })),
        pageNumber: 1,
        pageSize: 12,
        totalRecords: 14,
        totalPages: 2,
      },
      {
        page: 1,
        pageSize: 12,
        searchText: '',
        startDate: null,
        endDate: null,
        filter: '0',
        scope: 'operations',
      },
    )

    expect(page.items).toHaveLength(12)
    expect(page.page).toBe(1)
    expect(page.pageSize).toBe(12)
    expect(page.totalRows).toBe(14)
  })

  it('sorts list items from newest to oldest using document dates', () => {
    const page = DocumentsHistoryPageMap(
      {
        items: [
          {
            billingdocument_id: 'old-doc',
            uuid: 'UUID-OLD',
            status: 'Validado',
            fecha: '2026-05-01T09:00:00',
          },
          {
            billingdocument_id: 'new-doc',
            uuid: 'UUID-NEW',
            status: 'Validado',
            fecha: '2026-06-01T09:00:00',
          },
        ],
      },
      {
        page: 1,
        pageSize: 12,
        searchText: '',
        startDate: null,
        endDate: null,
        filter: '0',
        scope: 'operations',
      },
    )

    expect(page.items.map((item) => item.id)).toEqual(['new-doc', 'old-doc'])
  })

  it('prioritizes SAT concepts from json_sap items in the detail payload', () => {
    const detail = DocumentHistoryDetailMap({
      billingdocument_id: 'doc-2',
      uuid: 'UUID-2',
      status: 'SAT',
      rfc_emisor: 'AAA010101AAA',
      rfc_receptor: 'BBB010101BBB',
      conceptos: [
        {
          clave_sat: 'LEGACY-01',
          clavesat_description: 'Legacy concept',
        },
      ],
      json_sap: {
        iva: '16',
        subtotal: '100',
        total: '116',
        otherInvoices: '0',
        moneda: 'MXN',
        expenseType: '6',
        iscompleted: true,
        items: [
          {
            itemIndex: 1,
            claveInterna: '138',
            claveProdServ: '90101501',
            descripcion: 'Hospedaje',
            importe: '100.00',
            importeImpuesto: '16.00',
            impuesto: '002',
            tasaCuota: '0.160000',
          },
        ],
      },
    })

    expect(detail?.concepts).toHaveLength(1)
    expect(detail?.concepts[0]).toMatchObject({
      satKey: '90101501',
      description: 'Hospedaje',
      amount: 100,
      taxPercentage: 16,
      expenseType: '138',
      ivaGroup: '002',
    })
  })
})
