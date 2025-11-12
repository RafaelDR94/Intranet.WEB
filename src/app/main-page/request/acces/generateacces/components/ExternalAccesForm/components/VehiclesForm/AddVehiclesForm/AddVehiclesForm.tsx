import useAddVehiclesForm from "./hooks/useAddVehiclesForm";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { AddExtneralPersonFormProps } from "./types";

const AddVehiclesForm:React.FC<AddExtneralPersonFormProps> = ({formId,currentexternalperson,onCancel}) => {
    const { fields, handleSubmit, canStart } = useAddVehiclesForm({formId,currentexternalperson});
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
        />
    )
}
export default AddVehiclesForm;
