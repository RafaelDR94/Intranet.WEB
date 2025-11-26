'use client'
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import useRegisterEnterprise from "./hooks/useRegisterenterprise";

const RegisterEnterprise = () => {
    const { model, submitRef, handleSubmit } = useRegisterEnterprise()
    return (
        <FormsLayout title="Registro de empresa" primaryLabel="Registrar empresa" onPrimaryClick={() => submitRef.current?.()} >
            <DynamicForm onSubmit={handleSubmit} fields={model}externalSubmitRef={submitRef}/>
        </FormsLayout>)
}
export default RegisterEnterprise;