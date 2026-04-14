export type Department = {
    department_id: string,
    name: string,
    enterprise_id: string,
    enterprice_name: string
}
export type Enterprise = {
    enterprise_id: string,
    name: string,
    companytype?: string,
    rfc?: string,
    businessindustry?: string,
    imgurl?: string,
    departments: Department[],
    is_external:boolean
}
export type EnterprisePost = {
    enterprise_id?: string,
    name: string,
    companytype: string,
    rfc: string,
    businessindustry: string,
    imgurl?: string
}
export type EnterprisePut = {
    enterprise_id: string,
    name: string,
    companytype: string,
    rfc: string,
    businessindustry: string,
    is_external: boolean,
    imgurl?: string
}
export type ExternalEnterprisePost = {
    newEnterprise: string,
    RFC: string,
}
