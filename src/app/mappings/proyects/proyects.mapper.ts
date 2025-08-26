import { Proyect } from "./proyects.types";

export const ProyectMap = (proy: any): Proyect => {
    return ({
        id: proy?.id??"",
        name:proy.name??"",
        proyectKey: proy.proyectkey??"",
        client: proy.client??"",
    })
}
export const ProyectsMap = (proyects:any[]):Proyect[] =>{
        return proyects.map(ProyectMap);
}