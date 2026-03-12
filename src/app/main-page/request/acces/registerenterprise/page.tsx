"use client"
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import useRegisterEnterprise from "./hooks/useRegisterenterprise";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const RegisterEnterprise = () => {
    const { model, submitRef, handleSubmit } = useRegisterEnterprise()
    useTutorialAutoRun({
        moduleId: "request-acces-register",
        tutorialId: "request-acces-register:form",
    })
    return (
        <div data-tour="acces-register-form">
        <FormsLayout title="Registro de empresa" primaryLabel="Registrar empresa" onPrimaryClick={() => submitRef.current?.()} primaryButtonDataTour="acces-register-submit" >
            <DynamicForm onSubmit={handleSubmit} fields={model}externalSubmitRef={submitRef}/>
        </FormsLayout>
        </div>)
}
export default RegisterEnterprise;