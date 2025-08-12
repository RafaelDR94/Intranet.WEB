export type Requisition = {
    "id_billingrequisition": string,
    "requisitionkey": string,
    "id_Employee": string,
    "employeename": string,
    "idProject": string,
    "projectname": string
}
export type RequitionPost = {
    "requisitionkey": string,
    "employeename": string,
    "projectname": string
}
export type RequitionPut = {
    "id_billingrequisition": string,
    "requisitionkey": string,
    "employeename": string,
    "projectname": string
}