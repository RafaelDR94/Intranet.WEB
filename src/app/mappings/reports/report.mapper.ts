import { DeviceExternalView } from "../devices/devices.types";
import { mapEmployee } from "../employees/employee.mapper";
import { mapProyectLocation } from "../locations/location.mapper";
import { ProyectMap } from "../proyects/proyects.mapper";
import { mapWorkPosition } from "../workposition/workposition.mapper";

import { Activities, Refaction, ClientSignatureinterface, CategoriesType, TypesOfReportType, ReportDeviceView, ReportView, ReportPost, ReportPut } from "./reports.types";

import { formatDate } from "@/app/utilities/DatesHelper/Dateshelper";
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
  const devicesRaw = parseMaybeJson<any>(src?.report_devices ?? src?.devices ?? src?.reportDevices) ?? []
  const refaccionsRaw = parseMaybeJson<any>(src?.refactions ?? src?.Refactions) ?? []
  const clientSignRaw = parseMaybeJson<any>(src?.clientsign ?? src?.Clientsign) ?? {}
  const proyectLocation = mapProyectLocation(src?.location ?? src?.ProyectLocation)
  const rawEmployee = mapEmployee(src?.employe ?? src?.Employee)
  const raWorkposition = mapWorkPosition(src?.workposition ?? src?.WorkPosition)
  // Relaciones que pueden venir como string u objeto
  const reportCategory = mapCategory(src?.category ?? src?.reportcategories)
  const clientSign = mapClientSignature(clientSignRaw?.clientsign ?? src?.Clientsign) ?? {}
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
    "startdate": formatDate(src?.startdate) ?? '',
    "enddate": formatDate(src?.enddate) ?? '',
    "datecreate": formatDate(src?.datecreate) ?? '',
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
