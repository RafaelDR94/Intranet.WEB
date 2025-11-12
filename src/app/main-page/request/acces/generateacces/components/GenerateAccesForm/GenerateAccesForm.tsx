import useGenerateAccesForm from "./hooks/useGenerateAccesForm";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
const GenerateAccesForm = () => {
    const { fields, submitRef, handleSubmit, handleValidChange, formCompleted, canStart,loadingForm } = useGenerateAccesForm();
    if (!canStart) return (<> Return</>)
    return (<FormsLayout title="Registra Acceso de empleado" primaryLabel="Registrar Acceso" onPrimaryClick={() => submitRef.current?.()} primaryDisabled={!formCompleted}>
        <DynamicForm
            responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10], [10], [10], [10], [10]],
                md: [[10], [10], [10], [10], [10], [10], [10], [10]],
                lg: [[3.3,3.3,3.3], [3.3,3.3,3.3], [3.3,3.3,3.3], [3.3,3.3], [3.3,3.3,3.3]],
            }}
            onSubmit={handleSubmit}
            externalSubmitRef={submitRef}
            fields={fields}
            loading={loadingForm}
            onValidChange={handleValidChange}
        />
    </FormsLayout>)
}
export default GenerateAccesForm;