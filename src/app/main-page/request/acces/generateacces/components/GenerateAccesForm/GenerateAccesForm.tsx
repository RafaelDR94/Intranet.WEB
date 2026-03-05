import useGenerateAccesForm from "./hooks/useGenerateAccesForm";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

const GenerateAccesForm = () => {
  const {
    fields,
    submitRef,
    handleSubmit,
    handleValidChange,
    formCompleted,
    canStart,
    loadingForm,
    submitText,
    titleText
  } = useGenerateAccesForm();
  if (!canStart) return <> Return</>;

  
  return (
    <div data-tour="acces-generate-form">
      <FormsLayout
      title={titleText()}
      primaryLabel={submitText()}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formCompleted}
      primaryButtonDataTour="acces-generate-submit"
    >
      <DynamicForm
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10], [10], [10]],
          md: [[10], [10], [10], [10], [10], [10], [10], [10]],
          lg: [
            [3.3, 3.3, 3.3],
            [3.3, 3.3, 3.3],
            [3.3, 3.3, 3.3],
            [3.3, 3.3],
            [3.3, 3.3, 3.3],
          ],
        }}
        onSubmit={handleSubmit}
        externalSubmitRef={submitRef}
        fields={fields}
        loading={loadingForm}
        onValidChange={handleValidChange}
      />
    </FormsLayout>
    </div>
  );
};
export default GenerateAccesForm;
