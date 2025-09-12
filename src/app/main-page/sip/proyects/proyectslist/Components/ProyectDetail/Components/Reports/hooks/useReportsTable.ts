'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useCallback } from 'react'

import useDocument from './useDocument/useDocument'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useReportsStore } from '@/app/stores/useReportsStore/useReportsStore'
import { CreatePDF } from '@/app/utilities/PDF/PDF'

const useReportsTable = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert
  const { makePictureDocument, exportExcel } = useDocument();
  const idproyect = searchParams.get('id') ?? ''
  const reportId = searchParams.get('reportId') ?? ''
  const {
    currentReport,
    reports,
    loading,
    fetchAllReportsByProyect,
    setCurrentReport,
  } = useReportsStore()

  // Helper: fusiona params actuales con updates y navega sin perder nada
  const updateQuery = useCallback((updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams) // clona los actuales
    for (const [k, v] of Object.entries(updates)) {
      if (v == null || v === '') params.delete(k)
      else params.set(k, String(v))
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const handleCloseDetails = useCallback(() => {
    updateQuery({ reportId: null }) // elimina reportId de la URL
    setCurrentReport(null) // limpia el reporte actual en el store
  }, [updateQuery, setCurrentReport])

  useEffect(() => {
    if (idproyect) fetchAllReportsByProyect(idproyect, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idproyect])

  // Cuando hay reporte seleccionado, añade ?reportId=<id> SIN perder otros params
  useEffect(() => {
    if (currentReport?.id) {
      updateQuery({ reportId: currentReport.id })
      // Si además quieres moverte a otra ruta, usa:
      // router.replace(`/main-page/sip/proyects/newproyect?${new URLSearchParams(searchParams).toString()}`)
      // y luego set params ahí mismo si es necesario.
    }
  }, [currentReport, updateQuery])

  const searchableKeys = useMemo(
    () => ['name', 'description', 'createdAt', 'id'] as const,
    []
  )

  useEffect(() => {
    if (loading) {
      showSpinner({ message: 'Cargando Reportes...' }); return;
    }
    hideSpinner();
  }, [loading, showSpinner, hideSpinner]);

  const handleDownloadPicReport = async () => {
    showSpinner({ message: "Generando reporte fotográfico..." });
    try {

      const pdfData = makePictureDocument();
      if (pdfData) {
        const url: any = await new Promise((resolve, reject) => {
          try {
            CreatePDF(pdfData, resolve);
          } catch (err) {
            reject(err);
          }
          // fallback por si nunca llama a resolve:
          setTimeout(() => reject(new Error("CreatePDF timeout")), 10_000);
        }).catch(err => {
          console.error("Error en CreatePDF callback", err);
          return ""; // URL inválida
        });
        if (url) {
          window.open(url, "_blank")
          showAlert({
            type: "info",
            title: "Reporte descargado",
            description: "Se ha descargado el reporte",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1500,
          });
          hideSpinner();
        }
      }


    }
    catch (e) {
      console.error(e);
      showAlert({
        type: "error",
        title: "Error en la descarga",
        description: String(e) || "Hubo un problema al descargar el reporte",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      hideSpinner();
    }
  }
  const handleDownloadDigitalReport = () => {
    showSpinner({ message: "Exportando información en Excel..." });
    exportExcel().then(() => {
      hideSpinner();
      showAlert({
        type: "info",
        title: "Exportación correcta",
        description: "Excele exportado correctamente",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });

    }).catch((e) => {
      console.error(e);
      showAlert({
        type: "error",
        title: "Error en la descarga",
        description: String(e) || "Hubo un problema al descargar el reporte",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      hideSpinner();
    });

  }

  return {
    currentReport,
    reports,
    loading,
    setCurrent: setCurrentReport, // cuando llames setCurrent, el effect de arriba actualizará la URL
    searchableKeys,
    reportId,
    handleCloseDetails,
    handleDownloadPicReport,
    handleDownloadDigitalReport
  }
}

export default useReportsTable
