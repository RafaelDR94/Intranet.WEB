
import { EmployeeType } from "../employees/employee.types"
export type Proyect = {
    id: string,
    name: string,
    proyectKey: string,
    client: string,
    manager: EmployeeType,
    collaborators: EmployeeType[]
}

export type ProyectPost = {
    name: string,
    proyectKey: string,
    client: string
    managerId: string | null,
    collaborators: string[]
}

export type ProyectPut = {
    id: string,
    name: string,
    proyectKey: string,
    client: string,
    managerId: string | null,
    collaborators: string[]
}

export type LinkProyectLocationsPayload = {
    proyect_id: string,
    location_ids: string[]
}
