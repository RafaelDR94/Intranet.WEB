import useAddExternalPersonForm from "./hooks/useAddExternalPersonForm";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { AddExtneralPersonFormProps } from "./types";

const AddExternalPersonForm:React.FC<AddExtneralPersonFormProps> = ({formId,currentexternalperson,onCancel,canUpdateForm}) => {
    const { fields, handleSubmit, canStart } = useAddExternalPersonForm({formId,currentexternalperson});
    if (!canStart) return (<></>)
    return (
        <DynamicForm
            responsiveLayoutMatrix={{
                sm: [[10], [10], [10], [10], [10], [10], [10], [10]],
                md: [[10], [10], [10], [10], [10], [10], [10], [10]],
                lg: [[2.5,2.5,2.5,2.5], [3.3, 3.3, 3.3], [3.3, 3.3, 3.3], [3.3, 3.3], [3.3, 3.3, 3.3]],
            }}
            onSubmit={handleSubmit}
            fields={fields}
            submitLabel={currentexternalperson?"Actualizar información":"Registrar persona"}
            showSecondaryButtonIf={()=>!!onCancel}
            secondaryButtonLabel="Cancelar"
            onSecondaryButtonClick={onCancel ?? (() =>{})}
            disabled={!canUpdateForm}
        />
    )
}
export default AddExternalPersonForm;
