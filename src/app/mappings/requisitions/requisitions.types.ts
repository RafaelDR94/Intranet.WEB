export type Requisition = {
    "billingrequisition_id": string,
    "requisitionkey": string,
    "id_Employee": string,
    "employeename": string,
    "idProject": string,
    "projectname": string,
    "date_created": string
}
export type RequitionPost = {
    "requisitionkey": string,
    "employeename": string,
    "projectname": string
}
export type RequitionPut = {
    "billingrequisition_id": string,
    "requisitionkey": string,
    "employeename": string,
    "projectname": string
}