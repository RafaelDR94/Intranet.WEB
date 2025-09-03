// src/app/stores/useRequisitionStore/utilities/fetchRequisitions.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingReport } from '@/app/configurations/Axios/urls'

import { Get, Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'

/**
 * Obtiene las requisiciones activas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * 
 */
function extractFilenameFromDisposition(cd?: string): string | undefined {
    if (!cd) return
    const m = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd)
    const raw = m?.[1] ?? m?.[2]
    return raw ? decodeURIComponent(raw) : undefined
}

function triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
}

const looksBase64 = (s: string) =>
    typeof s === 'string' &&
    /^[A-Za-z0-9+/=\r\n]+$/.test(s) &&
    s.replace(/\s+/g, '').length % 4 === 0

const normalizeBase64 = (b64: string) => {
    const s = b64.trim().replace(/^data:.*;base64,/, '').replace(/\s+/g, '')
    const mod = s.length % 4
    return mod === 0 ? s : s + '==='.slice(mod)
}

export const downloadRequistionResume = async (idRequisition: string, set: Set, get: Get) => {
    // cache básica

    set({ error: undefined, downloadingDocument: true, succesDownloadDocument: false })

    try {
        // 1) Obtiene GET del gateway (lanza si no está listo)
        const GetFn = requireGateway('get')

        // 2) promisify con rango OK por defecto 200–299
        const getReq = pGet(GetFn)

        // 3) llamada
        // 4) mapear y guardar

        const res: AxiosResponse<any> = await getReq(`${BillingReport}/${idRequisition}`)
        const cd = res.headers?.['content-disposition'] as string | undefined
        let filename =
            extractFilenameFromDisposition(cd) ?? `requisicion_${idRequisition}.xlsx`
        if (looksBase64(res?.data?.data)) {
            const bin = atob(normalizeBase64(res.data.data))
            const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
            const blob = new Blob([bytes], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            triggerDownload(blob, filename)
            set({ downloadingDocument: false, succesDownloadDocument: true })
            return
        }

    } catch (e) {
        // 5) error normalizado
        const err = normalizeApiError(e)
        set({ error: err.message, downloadingDocument: false, succesDownloadDocument: false })
    }
}
