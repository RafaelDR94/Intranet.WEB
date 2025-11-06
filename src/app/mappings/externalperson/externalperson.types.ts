import { Enterprise } from "../enterprises/enterprises.types"

export type ExternalPersonModel = {
    id: string,
    enterprise: Enterprise,
    frontal_ine_json: string,
    back_ine_json: string,
    license_json: string,
    pictureURL: string,
    frontal_ine_url: string,
    back_ine_url: string,
    license_url?: string,
    name: string,
    lastname: string,
    motherslastname: string,
    curp: string,
    electorkey: string,
    electorvigence: string,
    nss: string,
    license_number: string,
    vigence: string,
    phone_number: string,
    email: string
}

export type ExternalPersonPost = {
    id_enterprise: string,
    frontal_ine_json: string,
    back_ine_json: string,
    license_json: string,
    pictureURL: string,
    frontal_ine_url: string,
    back_ine_url: string,
    license_url?: string,
    name: string,
    lastname: string,
    motherslastname: string,
    curp: string,
    electorkey: string,
    electorvigence: string,
    nss: string,
    license_number: string,
    vigence: string,
    phone_number: string,
    email: string
}

export type ExternalPersonPut = {
    id: string,
    id_enterprise: string,
    frontal_ine_json: string,
    back_ine_json: string,
    license_json: string,
    pictureURL: string,
    frontal_ine_url: string,
    back_ine_url: string,
    license_url?: string,
    name: string,
    lastname: string,
    motherslastname: string,
    curp: string,
    electorkey: string,
    electorvigence: string,
    nss: string,
    license_number: string,
    vigence: string,
    phone_number: string,
    email: string
}



