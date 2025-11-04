export type Department = {
    department_id:string,
    name: string,
    enterprise_id: string,
    enterprice_name: string
}
export type Enterprise = {
    enterprise_id: string,
    name: string,
    departments: Department[]
}