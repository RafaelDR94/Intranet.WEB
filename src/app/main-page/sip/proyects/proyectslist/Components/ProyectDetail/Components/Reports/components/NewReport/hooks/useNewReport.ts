import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useReportsStore } from '@/app/stores/useReportsStore/useReportsStore';
import { resolveModel } from '../utilities/newReportutilities';
import { Step, StepId } from '../types';
import { BASE_STEPS } from '../utilities/constants';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import useQuery from '@/app/hooks/useQuery/useQuery';

const useNewReport = () => {
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [currentStep, setCurrentStep] = useState<StepId>('avance');
  const [currentModelName, setCurrentModelName] = useState<string>('');
  const [isAdvanceValid, setIsAdvanceValid] = useState(false);
  const submitRef = useRef<() => void | Promise<void>>(null);
  const attemptedFrontIdRef = useRef<string | null>(null);

  const {
    typesofReports,
    fetchReportTypes,
    fetchReportCategories,
    loadingTypes,
    error,
    resetFlags,
    reportCategoriesTypeId,
  } = useReportsStore(
    (state) => ({
      typesofReports: state.typesofReports,
      reportCategories: state.reportCategories,
      fetchReportTypes: state.fetchReportTypes,
      fetchReportCategories: state.fetchReportCategories,
      loadingTypes: state.loadingTypes,
      loadingCategories: state.loadingCategories,
      error: state.error,
      resetFlags: state.resetFlags,
      reportCategoriesTypeId: state.reportCategoriesTypeId,
    }),
    shallow
  );

  const { updateQuery, all } = useQuery();
  const frontIdFromQuery = (() => {
    const raw = all.frontId;
    if (Array.isArray(raw)) return raw[0] ?? '';
    return raw ? String(raw) : '';
  })();

  const {
    updateModel,
    currentReportfrontguid,
    setCurrentReportfrontguid,
    readReportByFrontId,
    reportType,
    isReportHydrated,
  } = useReportBuilderStore(
    (state) => ({
      updateModel: state.updateModel,
      currentReportfrontguid: state.currentReportfrontguid,
      setCurrentReportfrontguid: state.setCurrentReportfrontguid,
      readReportByFrontId: state.readReportByFrontId,
      reportType: state.report.type,
      isReportHydrated: state.isReportHydrated,
    }),
    shallow
  );

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const currentModel = useMemo(() => resolveModel(currentModelName), [currentModelName]);

  const steps = useMemo<Step[]>(() => {
    return BASE_STEPS.filter((step) => {
      if (step.id === 'mapas') return currentModel.maps;
      if (step.id === 'refacciones') return currentModel.refactions;
      if (step.id === 'firma') return currentModel.clientsign;
      return true;
    });
  }, [currentModel]);

  useEffect(() => {
    fetchReportTypes();
  }, [fetchReportTypes]);

  useEffect(() => {
    if (typesofReports.length === 0) return;

    setSelectedTypeId((prev) => {
      if (reportType && prev !== reportType) {
        return reportType;
      }

      if (prev) return prev;

      if (frontIdFromQuery) return prev;

      const fallback = reportCategoriesTypeId ?? typesofReports[0]?.id ?? '';
      return fallback ?? '';
    });
  }, [typesofReports, reportCategoriesTypeId, reportType, frontIdFromQuery]);

  useEffect(() => {
    if (!selectedTypeId) return;
    const selectedReport = typesofReports.find((type) => type.id === selectedTypeId);
    setCurrentModelName(selectedReport?.name ?? '');
    fetchReportCategories(selectedTypeId);
  }, [fetchReportCategories, selectedTypeId, typesofReports]);

  useEffect(() => {
    if (!selectedTypeId) return;
    const frontIdForModel = frontIdFromQuery || currentReportfrontguid;
    updateModel({ model: currentModel, type: selectedTypeId, frontId: frontIdForModel || undefined });
  }, [currentModel, selectedTypeId, currentReportfrontguid, frontIdFromQuery, updateModel]);

  useEffect(() => {
    if (currentReportfrontguid) {
      updateQuery({ frontId: currentReportfrontguid });
    }
  }, [currentReportfrontguid, updateQuery]);

  useEffect(() => {
    if (!frontIdFromQuery) return;
    if (currentReportfrontguid === frontIdFromQuery) return;
    setCurrentReportfrontguid(frontIdFromQuery);
  }, [frontIdFromQuery, currentReportfrontguid, setCurrentReportfrontguid]);

  useEffect(() => {
    if (!frontIdFromQuery) {
      attemptedFrontIdRef.current = null;
      return;
    }

    if (isReportHydrated && currentReportfrontguid === frontIdFromQuery) {
      attemptedFrontIdRef.current = frontIdFromQuery;
      return;
    }

    if (attemptedFrontIdRef.current === frontIdFromQuery) return;

    attemptedFrontIdRef.current = frontIdFromQuery;
    void readReportByFrontId(frontIdFromQuery);
  }, [frontIdFromQuery, currentReportfrontguid, isReportHydrated, readReportByFrontId]);

  useEffect(() => {
    if (loadingTypes) {
      showSpinner({ message: 'Cargando tipos de reporte...' });
      return;
    }

    hideSpinner();
  }, [hideSpinner, loadingTypes, showSpinner]);

  useEffect(() => {
    if (!error) return;
    hideSpinner();
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No fue posible cargar la informacion',
      description: error,
      autoCloseMs: 4000,
      showPrimaryButton: false,
      showSecondaryButton: false,
      onClose: hideAlert,
    });
    resetFlags();
  }, [error, hideAlert, hideSpinner, resetFlags, showAlert]);

  const typeOptions = useMemo(
    () => typesofReports.map((type) => ({ label: type.name, value: type.id })),
    [typesofReports]
  );

  const handleTypeChange = useCallback((values: string[]) => {
    const next = values[0] ?? '';
    setSelectedTypeId(next);
  }, []);

  const handleAdvanceValidChange = useCallback((isValid: boolean) => {
    setIsAdvanceValid(isValid);
  }, []);

  const handleStepChange = useCallback((id: StepId) => {
    setCurrentStep(id);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 'avance') {
      if (!isAdvanceValid) {
        return;
      }
      submitRef.current?.();
      return;
    }
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const next = steps[currentIndex + 1];
    if (next) {
      setCurrentStep(next.id);
    }
  }, [currentStep, steps, isAdvanceValid]);

  return {
    steps,
    currentStep,
    onStepChange: handleStepChange,
    handleNext,
    currentModel,
    isAdvanceValid,
    typeOptions,
    selectedTypeId,
    onTypeChange: handleTypeChange,
    loadingTypes,
    onAdvanceValidChange: handleAdvanceValidChange,
    submitRef,
    currentModelName,
  };
};

export default useNewReport;