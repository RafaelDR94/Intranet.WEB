import { DeviceExternalView } from "../devices/devices.types";
import { mapEmployee } from "../employees/employee.mapper";
import { mapProyectLocation } from "../locations/location.mapper";
import { ProyectMap } from "../proyects/proyects.mapper";
import { mapWorkPosition } from "../workposition/workposition.mapper";
import { formatDateHour, currentDate ,formatDateOnlyDate} from "@/app/utilities/DatesHelper/Dateshelper";
import { Activities, Refaction, ClientSignatureinterface, CategoriesType, TypesOfReportType, ReportDeviceView, ReportView, ReportPost, ReportPut, ReportsTable } from "./reports.types";

export const mapTypeReport = (type: any): TypesOfReportType => ({
  id: type?.id,
  name: type?.name,
  description: type?.description,
});

export const mapTypesOfReports = (types: any[]): TypesOfReportType[] =>
  types.map(mapTypeReport);
export const mapDevicesExternal = (devs: any[]): DeviceExternalView[] =>
  devs.map(mapDeviceExternal);
export const mapDeviceExternal = (dev: any): DeviceExternalView => ({
  id: dev?.id,
  brand: dev?.brand,
  model: dev?.model,
  serialnumber: dev?.serialnumber,
  "idproyect": dev?.idproyect,
  "keyproyect": dev?.keyproyect,
  "idlocation": dev?.idlocation,
  "locationname": dev?.locationname,
  "is_active": dev?.is_active
});

export const mapClientSignature = (sign: any): ClientSignatureinterface => ({
  clientname: sign?.clientname,
  clientworkposition: sign?.clientworkposition,
  datetime: sign?.datetime,
  url: sign?.url,
});

export const mapReportDevicesExternal = (devices: any[]): ReportDeviceView[] =>
  devices.map((dev: any) => ({
    id: dev?.id,
    device_external_view: mapDeviceExternal(dev?.device_external_view),
  }));
export const mapCategory = (category: any): CategoriesType => ({
  id: category?.id,
  name: category?.name,
  typesofreports: mapTypeReport(category?.typesofreports),
});

export const mapCategories = (categories: any[]): CategoriesType[] =>
  categories.map(mapCategory);

export const mapRefaction = (ref: any): Refaction => ({
  description: ref?.description,
  brand: ref?.brand,
  model: ref?.model,
  serialnumber: ref?.serialnumber,
  partnumber: ref?.partnumber,
});

export const activitiyMap = (act: any): Activities => ({
  title: act?.title,
  date: act?.date,
  description: act?.description,
  urlimage: act?.urlimage,
});
export const mapActivities = (acts: any[]): Activities[] => {
  const list = Array.isArray(acts) ? acts : []
  return list.map(activitiyMap)
}
export const mapRefactions = (refs: any[]): Refaction[] => {
  const list = Array.isArray(refs) ? refs : []
  return list.map(mapRefaction)
}
// Utilidad: intenta parsear JSON si llega como string, de lo contrario devuelve el valor original
const parseMaybeJson = <T = any>(val: any): T | undefined => {
  if (val == null) return undefined as any
  if (typeof val === 'string') {
    try { return JSON.parse(val) as T } catch { return undefined as any }
  }
  if (typeof val === 'object') return val as T
  return undefined as any
}

// Mapea un registro de Report. Soporta que las relaciones vengan como string JSON.
export const ReportMap = (raw: any): ReportView => {

  const src = parseMaybeJson<any>(raw) ?? raw ?? {}
  const activitiesRaw = parseMaybeJson<any>(src?.Activities ?? src.activities) ?? []
  const mapsRaw = parseMaybeJson<any>(src?.Maps ?? src.maps) ?? []
  const modelRaw = parseMaybeJson<any>(src?.model ?? src?.Model) ?? []
  const devicesRaw = parseMaybeJson<any>(src?.reportDeviceView ?? src?.devices ?? src?.reportDevices) ?? []
  const refaccionsRaw = parseMaybeJson<any>(src?.refactions ?? src?.Refactions) ?? []
  const clientSignRaw = parseMaybeJson<any>(src?.Clientsign ?? src?.Clientsign) ?? {}
  const proyectLocation = mapProyectLocation(src?.location ?? src?.ProyectLocation)
  const rawEmployee = mapEmployee(src?.employe ?? src?.Employee)
  const raWorkposition = mapWorkPosition(src?.workposition ?? src?.WorkPosition)
  // Relaciones que pueden venir como string u objeto
  const reportCategory = mapCategory(src?.category ?? src?.reportcategories)
  const clientSign = mapClientSignature(clientSignRaw) ?? {}
  // Normaliza posibles estructuras: array directo o envoltorio con propiedad
  const refactionsList = Array.isArray(refaccionsRaw)
    ? refaccionsRaw
    : Array.isArray(refaccionsRaw?.refaccionsList)
      ? refaccionsRaw.refaccionsList
      : []
  const activitiesList = Array.isArray(activitiesRaw)
    ? activitiesRaw
    : Array.isArray(activitiesRaw?.activities)
      ? activitiesRaw.activities
      : []
  const mapsList = Array.isArray(mapsRaw)
    ? mapsRaw
    : Array.isArray(mapsRaw?.maps)
      ? mapsRaw.maps
      : []

  const refactions = mapRefactions(refactionsList)
  const activities = mapActivities(activitiesList)
  const maps = mapActivities(mapsList)
  return {
    "id": String(src?.id ?? ''),
    "model": modelRaw,
    "startdate": formatDateOnlyDate(src?.startdate) ?? '',
    "enddate": formatDateOnlyDate(src?.enddate) ?? '',
    "datecreate": formatDateHour(src?.datecreate) ?? '',
    "proyect": ProyectMap(src?.proyect ?? {}),
    "type": src?.type ?? '',
    "reportcategories": reportCategory,
    "location": proyectLocation,
    "employe": rawEmployee,
    "workposition": raWorkposition,
    "remarks": src?.remarks ?? '',
    "progress": src?.progress ?? '',
    "ticket": src?.Ticket ?? '',
    "employeesignurl": src?.Employeesignurl ?? '',
    "activities": activities,
    "maps": maps,
    "diagnostic": src?.Diagnostic ?? '',
    "solution": src?.Solution ?? '',
    "refactions": refactions,
    "clientsign": clientSign,
    "front_identifier": src?.front_identifier ?? '',
    "reportDeviceView": devicesRaw ?? []
  }
}
export const mapReportViewToPost = (view: ReportView): ReportPost => {
  return {
    model: JSON.stringify(view.model ?? []) || "",                          // asumiendo que Model tiene un campo id
    startdate: view.startdate,
    enddate: view.enddate.replaceAll("/", "-"),
    datecreated: view.datecreate.replaceAll("/", "-"),                         // ojo: en ReportView es "datecreate"
    idproyect: view.proyect?.id || "",
    idtype: view.type || "",                              // depende si "type" es string o un objeto
    idreportcategories: view.reportcategories?.id || "",
    idlocation: view.location?.id || "",
    idemploye: view.employe?.employee_id || "",
    IdWorkposition: view.workposition?.workposition_id || "",
    remarks: view.remarks,
    progress: view.progress,
    Ticket: view.ticket,
    Employeesignurl: view.employeesignurl,
    Activities: JSON.stringify(view.activities ?? []),    // convertir a string
    Maps: JSON.stringify(view.maps ?? []),
    Diagnostic: view.diagnostic,
    Solution: view.solution,
    Refactions: JSON.stringify(view.refactions ?? []),
    Clientsign: JSON.stringify(view.clientsign ?? {}),    // si es objeto lo serializamos
    front_identifier: view.front_identifier,
    devices_external: view.reportDeviceView?.map(d => d.id) ?? []
  };
};

export const ReportsTableMap = (reports: ReportView[]): ReportsTable[] => {

  const obtainStatusLabel = (current: ReportView) => {
    if (current?.clientsign?.url) return ({ text: "Completo", type: "valido" });
    else if (current?.activities?.length == 0) return ({ text: "Sin Act", type: "prohibido" });
    else if (!current?.clientsign?.url) return ({ text: "Sin F.Cliente", type: "invalido" });
    else return ({ text: "No definido", type: "pendiente" });
  };
  return reports.map(report => ({
    "id": report.id||report.front_identifier,
    "datecreate": report.datecreate,
    "ticket": report.ticket,
    "type": report.reportcategories.typesofreports.name,
    "category": report.reportcategories.name,
    "location": report.location.name,
    "employe": report.employe.fullname,
    "status":obtainStatusLabel(report)
  })
  )


}

export const mapReportViewToPut = (view: ReportView): ReportPut => {
  return {
    id: view.id,
    model: JSON.stringify(view.model ?? []) || "",                          // asumiendo que Model tiene un campo id
    startdate: view.startdate.replaceAll("/", "-"),
    enddate: view.enddate.replaceAll("/", "-"),
    datecreated: currentDate(),                         // ojo: en ReportView es "datecreate"
    idproyect: view.proyect?.id || "",
    idtype: view.type || "",                              // depende si "type" es string o un objeto
    idreportcategories: view.reportcategories?.id || "",
    idlocation: view.location?.id || "",
    idemploye: view.employe?.employee_id || "",
    IdWorkposition: view.workposition?.workposition_id || "",
    remarks: view.remarks,
    progress: view.progress,
    Ticket: view.ticket,
    Employeesignurl: view.employeesignurl,
    Activities: JSON.stringify(view.activities ?? []),    // convertir a string
    Maps: JSON.stringify(view.maps ?? []),
    Diagnostic: view.diagnostic,
    Solution: view.solution,
    Refactions: JSON.stringify(view.refactions ?? []),
    Clientsign: JSON.stringify(view.clientsign ?? {}),    // si es objeto lo serializamos
    front_identifier: view.front_identifier,
    devices_external: view.reportDeviceView?.map(d => d.id) ?? []
  };
};
export const ReportsMap = (list: any[]): ReportView[] => {
  if (!Array.isArray(list)) return []
  const output: ReportView[] = []
  for (const item of list) {
    try {
      output.push(ReportMap(item))
    } catch (e) {
      // Evita que un elemento corrupto rompa todo el mapeo
      console.error('Failed to map report item', e, item)
    }
  }
  return output
}


// Para POST/PUT el backend espera un string con el modelo serializado
export const ReportPostMap = (model: ReportPost): string => JSON.stringify(model)
export const ReportPutMap = (model: ReportPut): string => JSON.stringify(model)
