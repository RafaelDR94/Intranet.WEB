import { ExternalPersonModel } from "@/app/mappings/externalperson/externalperson.types"
export interface AddExtneralPersonFormProps {
    formId:string,
    currentexternalperson?:ExternalPersonModel
    onCancel?:()=>void
}