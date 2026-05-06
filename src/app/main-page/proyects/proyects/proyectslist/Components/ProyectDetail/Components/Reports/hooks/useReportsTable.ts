'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useCallback, useState } from 'react'
import useDocument from './useDocument/useDocument'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useReportsStore } from '@/app/stores/useReportsStore/useReportsStore'
import { CreatePDF } from '@/app/utilities/PDF/PDF'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import useQuery from '@/app/hooks/useQuery/useQuery'
import { ReportView, ReportsTable } from '@/app/mappings/reports/reports.types'
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore'
import { ReportsTableMap } from '@/app/mappings/reports/report.mapper'
import { shallow } from 'zustand/shallow'
const useReportsTable = () => {
  const [reportPendingDelete, setReportPendingDelete] = useState<ReportView | null>(null);
  const [forceActionButton, setForceActionButton] = useState(false);
  const searchParams = useSearchParams()
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { currentPagePermissions, user } = useAuth();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert
  const { makePictureDocument, exportExcel } = useDocument();
  const idproyect = searchParams.get('id') ?? '';
  const reportId = searchParams.get('reportId') ?? ''
  const reportIdFront = searchParams.get('frontId') ?? ''
  const newReport = searchParams.get('newReport') ?? false
  const isMobile = useIsMobile();
  const { setReport } = useReportBuilderStore();
  const {
    currentReport,
    reports,
    localReports,
    loadLocalReports,
    deleteLocal,
    deleteRemoteReport,
    loading,
    fetchAllReportsByProyect,
    setCurrentReport,
    reset,
    resetflags,
    error
  } = useReportsStore((s) => ({
    currentReport: s.currentReport,
    reports: s.reports,
    localReports: s.localReports,
    loadLocalReports: s.fetchLocalReports,
    deleteLocal: s.deleteLocal,
    deleteRemoteReport: s.deleteReport,
    loading: s.loading,
    fetchAllReportsByProyect: s.fetchAllReportsByProyect,
    setCurrentReport: s.setCurrentReport,
    reset: s.reset,
    resetflags: s.resetFlags,
    error: s.error
  }), shallow)


  const { updateQuery } = useQuery();
  const reportList = ReportsTableMap(reports);
  const reportLocalList = ReportsTableMap(localReports);



  const handleCloseDetails = useCallback(() => {
    updateQuery({ reportId: null, frontId: null }) // elimina reportId de la URL
    updateQuery({ reportId: null, frontId: null }) // elimina reportId de la URL
    setCurrentReport(null);
    // limpia el reporte actual en el store
  }, [updateQuery, setCurrentReport])

  const RefreshData = () => {
    reset();
    fetchAllReportsByProyect(String(idproyect), true);
    loadLocalReports(true, String(idproyect));
  }

  useEffect(() => {
    if (!newReport) {
      RefreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newReport]);

  useEffect(() => {
    if (error) {
      showAlert({
        type: "warning",
        title: "No se encontraron reportes",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      resetflags();
    }
  }, [error])




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
      
      const pdfData = await makePictureDocument();
      if (pdfData) {
        const url: any = await new Promise((resolve, reject) => {
          const membret = idproyect == "b30f2236-bce8-4bf8-9edd-731e760f35cc" ?"DISITREK":"DR"
          try {
            CreatePDF(pdfData, resolve,membret);
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
        description: String(e) || "Hubo uema al descargar el reporte",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      hideSpinner();
    });

  }

  useEffect(() => {
    if (!reportId) {
      setForceActionButton(false);
    }
  }, [reportId]);



  const [activeFilter, setActiveFilter] = useState<string>('all:mine');
  const controlFilterOptions = [
    { label: "Todos", value: "all" },
    { label: "Reportes completos", value: "all:complete" },
    { label: "Reportes incompletos", value: "all:incomplete" },
    { label: "Mis Reportes", value: "all:mine" },
    { label: "Mis Completos", value: "all:minecomplete" },
    { label: "Mis Incompletos", value: "all:mineincomplete" },
  ];

  const normalizeName = useCallback((value?: string) => {
    if (!value) return '';
    return value.replace(/\s+/g, '').toLowerCase();
  }, []);

  const computeFilteredReports = useCallback(
    (filter: string, list: ReportsTable[]): ReportsTable[] => {
      const userName = normalizeName(user?.fullName);

      switch (filter) {
        case 'all':
          return list;
        case 'all:complete':
          return list.filter((report) => report.status.text === "Completo");
        case 'all:incomplete':
          return list.filter((report) => report.status.text !== "Completo");
        case 'all:mine':
          return list.filter(
            (report) => normalizeName(report.employe) === userName
          );
        case 'all:minecomplete':
          return list.filter(
            (report) =>
              normalizeName(report.employe) === userName &&
              report.status.text === "Completo"
          );
        case 'all:mineincomplete':
          return list.filter(
            (report) =>
              normalizeName(report.employe) === userName &&
              report.status.text !== "Completo"
          );
        default:
          return list;
      }
    },
    [normalizeName, user?.fullName]
  );

  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter(value);
  }, []);

  const reportListFiltered = useMemo(
    () => computeFilteredReports(activeFilter, reportList),
    [activeFilter, reportList, computeFilteredReports]
  );


  const handleSelectReportOnline = useCallback(
    (row: ReportsTable, options?: { forceButton?: boolean }) => {
      const latestreports = useReportsStore.getState().reports;
      const report = latestreports.find((report) => (row.id == report.id))
      if (report) {
        setForceActionButton(Boolean(options?.forceButton));
        setCurrentReport(report);
        updateQuery({ reportId: report.id, frontId: report.front_identifier })
      }

    },
    [setCurrentReport, updateQuery, setForceActionButton]
  );

  const handleSelectReportOffline = useCallback(
    (row: ReportsTable, options?: { forceButton?: boolean }) => {
      // leer siempre el array más reciente del store
      const latestLocal = useReportsStore.getState().localReports;
      const report = latestLocal.find((report) => row.id == report.front_identifier||row.id == report.id);
      if (report) {
        setForceActionButton(Boolean(options?.forceButton));
        setCurrentReport(report);
        updateQuery({ reportId: null, frontId: report.front_identifier });
      }
    },
    [setCurrentReport, updateQuery, setForceActionButton]
  );



  const handleEdit = (row: ReportView) => {
    setCurrentReport(null);
    updateQuery({ newReport: true })
    setReport(row);
  }

  const handleNewReport = () => {
    updateQuery({ newReport: true })
  }
  const handleClosePanel = useCallback(() => {
    setForceActionButton(false);
    handleCloseDetails();
  }, [handleCloseDetails, setForceActionButton]);

  const handleDelete = useCallback(async (row: ReportView) => {
    if (!row) {
      return false
    }

    if (reportId) {
      showSpinner({ message: 'Eliminando reporte...' })
      try {
        const deleted = await deleteRemoteReport(reportId, row.proyect?.id)

        if (!deleted) {
          showAlert({
            type: 'error',
            title: 'No se pudo eliminar',
            description: 'Intenta nuevamente en unos segundos.',
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 2500,
          })
          return false
        }

        const matchesCurrent = [currentReport?.id, currentReport?.front_identifier].includes(reportId)

        if (matchesCurrent) {
          handleCloseDetails()
        }

        showAlert({
          type: 'info',
          title: 'Reporte eliminado',
          description: 'El reporte se elimino correctamente.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        })
        RefreshData();

        return true
      } finally {
        hideSpinner()
      }
    }
    else {

      const identifier = row.front_identifier || row.id

      if (!identifier) {
        return false
      }

      const isLocalReport = localReports.some((local) => {
        return [local.front_identifier, local.id].includes(identifier)
      })

      if (!isLocalReport) {
        return false
      }

      const deleted = await deleteLocal(identifier)

      if (!deleted) {
        showAlert({
          type: 'error',
          title: 'No se pudo eliminar',
          description: 'Intenta nuevamente en unos segundos.',
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2500,
        })
        return false
      }

      const matchesCurrent = [currentReport?.front_identifier, currentReport?.id].includes(identifier)

      if (matchesCurrent) {
        handleCloseDetails()
      }

      showAlert({
        type: 'info',
        title: 'Reporte eliminado',
        description: 'El reporte se elimino correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
      })
      return true
    }

  }, [
    reportId,
    showSpinner,
    deleteRemoteReport,
    showAlert,
    currentReport?.id,
    currentReport?.front_identifier,
    handleCloseDetails,
    hideSpinner,
    localReports,
    deleteLocal,
  ])

  return {
    reportPendingDelete,
    setReportPendingDelete,
    forceActionButton,
    currentReport,
    reports,
    reportList: reportListFiltered,
    reportLocalList,
    localReports,
    fetchLocalReports: loadLocalReports,
    loading,
    searchableKeys,
    reportId,
    reportIdFront,
    handleCloseDetails,
    handleDownloadPicReport,
    handleDownloadDigitalReport,
    handleEdit,
    handleDelete,
    handleNewReport,
    handleSelectReportOnline,
    handleSelectReportOffline,
    currentPagePermissions,
    isMobile,
    newReport,
    setForceActionButton,
    controlFilterOptions,
    handleFilterChange,
    activeFilter,
    handleClosePanel,
  }
}
export default useReportsTable;
