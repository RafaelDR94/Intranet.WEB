'use client'
import React from "react";
import useCreateEemployee from "./hooks/useCreatEmployee";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
const CreateEmployee = () => {
    const { loadingForm, fields, submitRef,canStart,handleSubmit,handleValidChange,formCompleted} = useCreateEemployee();
    if(!canStart) return (<></>)
    return (
        

        <FormsLayout title="Registro de empleado" primaryLabel="Registrar empleado" onPrimaryClick={() => submitRef.current?.()} primaryDisabled={!formCompleted}>
            {fields && <DynamicForm
                responsiveLayoutMatrix={{
                    sm: [[10],[10],[10],[10],[10],[10],[10],[10],[10],[10],[10]],
                    md: [[2.5,2.5,2.5,2.5],[3.3,3.3,3.3],[3.33,3.3,3.3],[3.33,3.3,3.3],[3.33,3.3,3.3]],
                    lg: [[2.5,2.5,2.5,2.5],[3.3,3.3,3.3],[5,5],[5,5],[3.33,3.3,3.3],[10]],
                }}
                onSubmit={handleSubmit}
                externalSubmitRef={submitRef}
                fields={fields}
                loadingFormInfo={loadingForm}
                onValidChange={handleValidChange}
            />}

        </FormsLayout>)
}
export default CreateEmployee;
