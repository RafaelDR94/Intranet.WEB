export type Department = {
    department_id: string,
    name: string,
    enterprise_id: string,
    enterprice_name: string
}
export type Enterprise = {
    enterprise_id: string,
    name: string,
    departments: Department[],
    is_external:boolean
}
export type EnterprisePost = {
    newEnterprise: string,
}
export type EnterprisePut = {
    "enterprise_id": string,
    "name": string,
    "is_external": boolean
}
export type ExternalEnterprisePost = {
    newEnterprise: string,
}
