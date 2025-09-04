export type Requisition = {
    "billingrequisition_id": string,
    "requisitionkey": string,
    "id_Employee": string,
    "employeename": string,
    "idProject": string,
    "projectname": string,
    "assignmentdate":string,
    "endDate":string,
    "motive":string,
    "state":string,
    "status":string,
    "amountdeposited":string,
    "provenamount":string,
    "amountdifference":string,
    "date_created": string
}
export type RequitionPost = {
    "requisitionkey": string,
    "employeename": string,
    "projectname": string,
    "assignmentdate": string,
    "endDate": string,
    "motive": string,
    "state": string,
    "amountdeposited": number,
    "provenamount": number
}
export type RequitionPut = {
    "billingrequisition_id": string,
    "requisitionkey": string,
    "employeename": string,
    "projectname": string
    "assignmentdate": string,
    "endDate": string,
    "motive": string,
    "state": string,
    "amountdeposited": number,
    "provenamount": number
}