import { DeviceExternalView } from "../devices/devices.types";
import { EmployeeType } from "../employees/employee.types";
import { ProyectLocationType } from "../locations/locations.types";
import { Proyect } from "../proyects/proyects.types";
import { WorkPositionType } from "../workposition/workposition.types";

export type TypesOfReportType = {
  id: string;
  name: string;
  description: string;
};

export type CategoriesType = {
  id: string;
  name: string;
  typesofreports: TypesOfReportType;
};

export interface ReportDeviceView {
  id: string;
  device_external_view: DeviceExternalView;
}

export interface Model {
  maps: boolean,
  diagnostic: boolean,
  solution: boolean,
  refactions: boolean,
  clientsign: boolean,
  ticket: boolean,
}

export interface Activities {
  title: string;
  date: string;
  description: string;
  urlimage: string;
}

export interface Refaction {
  description: string;
  brand: string;
  model: string;
  serialnumber: string;
  partnumber: string;
}

export interface ClientSignatureinterface {
  clientname?: string;
  clientworkposition?: string;
  datetime?: string;
  url?: string;
}

export interface ReportView {
  "id": string,
  "model": Model,
  "startdate": string,
  "enddate": string,
  "datecreate": string,
  "proyect": Proyect,
  "type": string,
  "reportcategories": CategoriesType,
  "location": ProyectLocationType,
  "employe": EmployeeType,
  "workposition": WorkPositionType,
  "remarks": string,
  "progress": string,
  "ticket": string,
  "employeesignurl": string,
  "activities": Activities[],
  "maps": Activities[],
  "diagnostic": string,
  "solution": string,
  "refactions": Refaction[],
  "clientsign": ClientSignatureinterface,
  "front_identifier": string,
  "reportDeviceView": ReportDeviceView[]
}

export type ReportPost = {
  "model": string,
  "startdate": string,
  "enddate": string,
  "datecreated": string,
  "idproyect": string,
  "idtype": string,
  "idreportcategories": string,
  "idlocation": string,
  "idemploye": string,
  "IdWorkposition": string,
  "remarks": string,
  "progress": string,
  "Ticket": string,
  "Employeesignurl": string,
  "Activities": string,
  "Maps": string,
  "Diagnostic": string,
  "Solution": string,
  "Refactions": string,
  "Clientsign": string,
  "front_identifier": string,
  "devices_external": string[]
}

export type ReportPut = {
  "id": string
  "model": string,
  "startdate": string,
  "enddate": string,
  "datecreated": string,
  "idproyect": string,
  "idtype": string,
  "idreportcategories": string,
  "idlocation": string,
  "idemploye": string,
  "IdWorkposition": string,
  "remarks": string,
  "progress": string,
  "Ticket": string,
  "Employeesignurl": string,
  "Activities": string,
  "Maps": string,
  "Diagnostic": string,
  "Solution": string,
  "Refactions": string,
  "Clientsign": string,
  "front_identifier": string
}