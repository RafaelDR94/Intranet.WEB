import { CompleteTransport } from "../transport/transport.types"
import { EmployeeType } from "../employees/employee.types"
import { ExternalPersonModel } from "../externalperson/externalperson.types"
import { Enterprise } from "../enterprises/enterprises.types"
import { ProyectLocationType } from "../locations/locations.types"
export type Tools = {
    quantity: string,
    description: string,
    brand: string,
    model: string,
    materialtype: 'Ferretero' | 'Desechos Inorgánicos' | 'Líquidos' | 'Mercancías peligrosas' | 'A granel'
    meditiontype: 'Metros' | 'Litros' | 'Toneladas' | 'Kilos' | 'Pieza'| 'Gramos'| 'Metros cúbicos'| 'Metros cuadrados'
}
export type AccesRequirmentGet = {
    id: string,
    location: ProyectLocationType,
    external_enterprise?: Enterprise,
    location_responsible: string,
    location_workposition: string,
    vehicles: CompleteTransport[],
    internalpersons: EmployeeType[],
    externalpersons: ExternalPersonModel[],
    tools: Tools[],
    status: 'Creada' | 'Pendiente' | 'I Aprobada' | 'I Rechazada' | 'Enviada' | 'A rechazado' | 'A finalizado' | 'Cancelada' | 'Incidencia',
    motive: string,
    dateCreate: string,
    createdBy: string,
    start_date: string,
    end_date: string,
    dr_responsiblename: string,
    dr_responsiblesignature: string,
    evidence_send_email: string,
    evidence_response_email: string,
    internal_comments: string,
    external_comments: string
}

export type AccesPost = {
    id_location: string,
    id_external_enterprise?: string,
    location_responsible: string,
    location_workposition: string,
    vehicles: string[],//GUID[]
    internalpersons: string[],//GUID[]
    externalpersons: string[],//GUID[]
    tools: string,//Yo lo envio como string
    motive: string,
    start_date: string,
    end_date: string,
    dr_responsiblename: string,
    dr_responsiblesignature: string,

}


export type AccesPut = {
    id: string,
    id_location: string,
    id_external_enterprise?: string,
    location_responsible: string,
    location_workposition: string,
    vehicles: string[],//GUID[]
    internalpersons: string[],//GUID[]
    externalpersons: string[],//GUID[]
    tools: string,//Yo lo envio como string
    id_status: string,
    motive: string,
    start_date: string,
    end_date: string,
    dr_responsiblename: string,
    dr_responsiblesignature: string,
    evidence_send_email: string,
    evidence_response_email: string,
    internal_comments: string,
    external_comments: string
}

export type AccesInternalCommentsPut = {
    id: string,
    internal_comments: string,
    title: string
}

export type AccesExternalCommentsPut = {
    id: string,
    external_comments: string,
    title: string
}