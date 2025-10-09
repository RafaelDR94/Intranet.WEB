import { FieldModel } from "@/app/components/DynamicForm/types";
import { RefObject } from "react";
export type Step = {
  id: 'avance' | 'actividades' | 'equipos' | 'mapas' | 'refacciones' | 'firma';
  label: string;
};
export type StepId = Step['id'];

export type UseNewReportReturn = {
  steps: Step[];
  activeStep: StepId;
  onStepChange: (id: StepId) => void;
  handleNext: () => void;
  isNextDisabled: boolean;
  typeOptions: { label: string; value: string }[];
  selectedTypeId: string;
  onTypeChange: (values: string[]) => void;
  loadingTypes: boolean;
  categoriesLoading: boolean;
  formFields: FieldModel[];
  formSubmitRef: React.RefObject<(() => void | Promise<void>) | null>
  onFormSubmit: (values: Record<string, any>) => void;
  onFormValidChange: (isValid: boolean) => void;
  formId: string;
};
export interface ReportModelContent {
  maps: boolean;
  diagnostic: boolean;
  solution: boolean;
  refactions: boolean;
  clientsign: boolean;
  ticket: boolean;
}

export type ModelsList = Record<string, ReportModelContent>;

export interface AdvanceProps {
  submitRef: RefObject<(() => void | Promise<void>) | null>
  currentModelName:string
  onStepValidChange: (isValid: boolean) => void;
  
}