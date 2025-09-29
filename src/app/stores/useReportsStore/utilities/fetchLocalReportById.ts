import type { Get, Set } from '../types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { findReportDocumentByFrontId } from '../../useReportBuilderStore/utilities/helpers'
export const fetchLocalReportById = async (
    idreport: string,
    set: Set,
    _get: Get,
    force = true,
) => {
    // For this endpoint we usually need fresh data by project
    if (_get().currentReport && !force) return
    set({ currentReport: undefined, loadingCurrent: true, error: undefined, succesCurrent: false })
    try {
        const document = await findReportDocumentByFrontId(idreport);
        if (!document) {
            throw new Error('No se encontro ningun reporte local con el identificador proporcionado.');
        }
        const report = { ...document.report, front_identifier: idreport };
        set({ currentReport: report, loadingCurrent: false, succesCurrent: true })

    } catch (e) {
        set({ loadingCurrent: false, succesCurrent: false, error: normalizeApiError(e).message })
    }
}

