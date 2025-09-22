import { useEffect } from "react";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

import useAdvance from "./hooks/useAdvance";
import { AdvanceProps } from "../../types";

const Advance: React.FC<AdvanceProps> = ({ submitRef, currentModelName, onStepValidChange }) => {
  const { formFields, onFormSubmit, formId, categoriesLoading, onFormValidChange, isStepValid ,handleValuesChange} = useAdvance(currentModelName);

  useEffect(() => {
    onStepValidChange(isStepValid);
  }, [isStepValid, onStepValidChange]);

  return (
    <DynamicForm
      fields={formFields}
      onSubmit={onFormSubmit}
      externalSubmitRef={submitRef}
      showSubmitIf={() => false}
      onValidChange={onFormValidChange}
      onValuesChange={handleValuesChange}
      loadingFormInfo={categoriesLoading}
      dataTestId={formId}
      responsiveLayoutMatrix={{ sm: [[10], [10], [10], [10], [10], [10],[10],[10],[10]], md: [[3.3,3.3,3.3], [3.3,3.3,3.3], [10], [10], [10], [10],[10]] }}
    />

  )
}
export default Advance
