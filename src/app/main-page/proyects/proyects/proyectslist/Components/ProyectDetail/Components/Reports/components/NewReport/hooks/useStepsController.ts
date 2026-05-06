import { useState, useEffect, useCallback, useMemo } from "react";
import { StepId, Step, ReportModelContent } from "../types";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { BASE_STEPS } from '../utilities/constants';


type useStepsControllerProps = {
  currentModel: ReportModelContent
}

const useStepsController = ({ currentModel }: useStepsControllerProps) => {

  const [currentStep, setCurrentStep] = useState<StepId>('avance');
  const [isAdvanceValid, setIsAdvanceValid] = useState(false);
  const [isBackValid, setIsBackValid] = useState(false);
  const [isSaveValid, setIsSaveValid] = useState(false);
  const { updateQuery, all } = useQuery();


  const steps = useMemo<Step[]>(() => {
    return BASE_STEPS.filter((step) => {
      if (step.id === 'mapas') return currentModel.maps;
      if (step.id === 'refacciones') return currentModel.refactions;
      if (step.id === 'firma') return currentModel.clientsign;
      return true;
    });
  }, [currentModel]);


  useEffect(() => {
    if (currentStep) {
      updateQuery({ currentStep: currentStep });
      if (currentStep === 'avance') {
        handleBackValidChange(false);
        handleAdvanceValidChange(true);
      }
      else if (currentStep === 'firma') {
        handleBackValidChange(true);
        handleAdvanceValidChange(false);
      }
      else {
        handleBackValidChange(true);
        handleAdvanceValidChange(true);
      }

    }
  }, [currentStep, updateQuery]);


  useEffect(() => {
    if (all?.currentStep) {
      setCurrentStep(all?.currentStep as StepId);
    }
  }, [all])


  const handleAdvanceValidChange = useCallback((isValid: boolean) => {
    setIsAdvanceValid(isValid);
  }, []);
  const handleBackValidChange = useCallback((isValid: boolean) => {
    setIsBackValid(isValid);
  }, []);
  const handleCanSaveReport = useCallback((isValid: boolean) => {
    setIsSaveValid(isValid);
  }, []);

  const handleStepChange = useCallback((id: StepId) => {
    setCurrentStep(id);
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const next = steps[currentIndex + 1];
    if (next) {
      setCurrentStep(next.id);
    }
  }, [currentStep, steps, isAdvanceValid]);


  const handleBack = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const next = steps[currentIndex - 1];
    if (next) {
      setCurrentStep(next.id);
    }
  }, [currentStep, steps, isAdvanceValid]);


  return {
    steps,currentStep,handleBackValidChange,handleAdvanceValidChange,handleCanSaveReport, handleBack, handleNext, handleStepChange,isBackValid,isAdvanceValid,isSaveValid
  }
}
export default useStepsController;