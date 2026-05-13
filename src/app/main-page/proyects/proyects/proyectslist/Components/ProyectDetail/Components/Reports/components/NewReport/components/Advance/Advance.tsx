import React, { useEffect } from "react";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

import useAdvanceForm from "./hooks/useAdvanceForm";
import { AdvanceProps } from "../../types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
const Advance: React.FC<AdvanceProps> = ({ submitRef, currentModelName, onStepValidChange }) => {
  const safeModelName = currentModelName ?? "";
  const {
    report,
    canStart,
    formFields,
    formVersion,
    onFormSubmit,
    formId,
    categoriesLoading,
    onFormValidChange,
    isStepValid,
    handleValuesChange,
  } = useAdvanceForm(safeModelName);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!currentModelName) return;
    onStepValidChange(isStepValid);
  }, [currentModelName, isStepValid, onStepValidChange]);

  if (!currentModelName) return null;

  return (
    <div className={!isMobile ? "overflow-y-auto max-h-[50vh]" : ""}>
      {canStart &&
        <DynamicForm
          disabled={Boolean(report?.clientsign?.url)}
          fields={formFields}
          onSubmit={onFormSubmit}
          externalSubmitRef={submitRef}
          showSubmitIf={() => false}
          onValidChange={onFormValidChange}
          onValuesChange={handleValuesChange}
          loadingFormInfo={categoriesLoading}
          dataTestId={formId}
          valuesVersion={formVersion}
          valuesVersionActive
          responsiveLayoutMatrix={{ sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]], md: [[3.3, 3.3, 3.3], [3.3, 3.3, 3.3], [10], [10], [10], [10], [10]] }}
        />
      }


    </div>


  )
}
export default Advance
