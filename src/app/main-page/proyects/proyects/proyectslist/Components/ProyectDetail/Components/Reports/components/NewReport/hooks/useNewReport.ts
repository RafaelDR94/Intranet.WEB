import { useEffect, useMemo, useState, useRef, } from 'react';
import { useReportsStore } from '@/app/stores/useReportsStore/useReportsStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import useQuery from '@/app/hooks/useQuery/useQuery';
import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { resolveModel } from '../utilities/newReportutilities';
import useStepsController from './useStepsController';
import useReportSaver from './useReportSaver';
import useReportTypehandler from './useReportTypehandler';
import { shallow } from 'zustand/shallow';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
const useNewReport = () => {
  const { user } = useAuth();
  const { all, updateQuery } = useQuery();
  const [canStart, setCanStart] = useState(false);
  const { usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const submitRef = useRef<() => void | Promise<void>>(null);
  const hassubmitedBySignaturedetect = useRef(false);
  const [currentModelName, setCurrentModelName] = useState<string>('');
  const currentModel = useMemo(() => resolveModel(currentModelName), [currentModelName]);
  const { steps, currentStep, handleBackValidChange, handleAdvanceValidChange, handleCanSaveReport, handleBack, handleNext, handleStepChange, isBackValid, isAdvanceValid, isSaveValid } = useStepsController({ currentModel });
  const { SaveReport } = useReportSaver();
  const { typeOptions, selectedTypeId, handleTypeChange } = useReportTypehandler({ canStart: canStart });
  const frontIdFromQuery = all.frontId;
  const backIdFromQuery = all.reportId;
  const proyectFromQuery = all.id;
  const {
    typesofReports,
    loadingTypes,
  } = useReportsStore();


  const {
    report,
    updateModel,
    readReportByFrontId,
    createReportInDB,
    startNewReport,
    readReportOnline,
    reset
  } = useReportBuilderStore(
    (state) => ({
      updateModel: state.updateModel,
      report: state.report,
      readReportByFrontId: state.readReportByFrontId,
      startNewReport: state.startNewReport,
      createReportInDB: state.createReportInDB,
      readReportOnline: state.readReportOnline,
      reset: state.reset,

    }),
    shallow
  );


  /**Asignamos el nombre del Modelo seleccionado dependiendo del tipo */
  useEffect(() => {
    if (!selectedTypeId) return;
    const selectedReport = typesofReports.find((type) => type.id === selectedTypeId);
    setCurrentModelName(selectedReport?.name ?? '');
  }, [setCurrentModelName, selectedTypeId, typesofReports]);


  useEffect(() => {
    if (!selectedTypeId) return;
    if (user) {
      updateModel({
        model: currentModel,
        type: selectedTypeId,
      });

    }
  }, [currentModel, selectedTypeId, user, updateModel]);

  const CreateReport = async () => {
    const report = await createReportInDB();
    updateQuery({ frontId: report?.frontId || "" })

  }

  useEffect(() => {
    if (canStart) {
      CreateReport();
    }
  }, [canStart])

  const readLocalReport = async () => {
    await readReportByFrontId(String(frontIdFromQuery));
    hideSpinner();
    setCanStart(true);
  }

  const readOnlineReport = async () => {
    if (!report.id) await readReportOnline(String(backIdFromQuery));
    hideSpinner();
    setCanStart(true);
  }

  useEffect(() => {

    showSpinner({ message: "Obteniendo información del reporte" });
    if (backIdFromQuery) {
      readOnlineReport();
      return
    }
    if (frontIdFromQuery) {
      readLocalReport();
      return;
    }
    if (user) {
      reset();
      setTimeout(() => {

        startNewReport(String(proyectFromQuery), user.idEmployee, user.idWorkPosition);
        hideSpinner();
        setCanStart(true);
      }, 500)

    }


  }, [frontIdFromQuery, backIdFromQuery, user, reset, startNewReport, createReportInDB, readReportByFrontId]);

  useEffect(() => {
    if (report.clientsign.url && canStart && !hassubmitedBySignaturedetect.current) setTimeout(() => {
      hassubmitedBySignaturedetect.current = true;
      SaveReport(report)
    }, 1000)

  }, [report?.clientsign?.url, canStart])

  const handleSaveReport = () => {
    SaveReport(report)
  }

  return {
    steps,
    currentStep,
    onStepChange: handleStepChange,
    handleNext,
    currentModel,
    typeOptions,
    selectedTypeId,
    onTypeChange: handleTypeChange,
    loadingTypes,
    onAdvanceValidChange: handleAdvanceValidChange,
    submitRef,
    currentModelName,
    isSaveValid,
    isBackValid,
    isAdvanceValid,
    handleCanSaveReport,
    handleBackValidChange,
    handleBack,
    handleSaveReport, canStart,
    report
  };
};

export default useNewReport;