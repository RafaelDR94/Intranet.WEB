// src/app/mappings/proyects/proyects.mapper.ts
import { mapEmployee, mapEmployees } from "../employees/employee.mapper";

import type { Proyect, ProyectPost, ProyectPut } from "./proyects.types";
/**
 * ProyectMap
 * Mapea un registro crudo de la API a un objeto tipado Proyect.
 */
export const ProyectMap = (raw: any): Proyect => ({
  id: String(raw?.id ?? ""),
  name: String(raw?.name ?? ""),
  // Acepta ambas variantes por si el backend envía camelCase o lower
  proyectKey: String(raw?.proyectKey ?? raw?.proyectkey ?? ""),
  client: String(raw?.client ?? ""),
  collaborators: mapEmployees(raw?.collaborators ?? []),
  manager: mapEmployee(raw?.manager),
});

/**
 * ProyectsMap
 * Mapea una colección cruda a un arreglo tipado.
 */
export const ProyectsMap = (list: any[]): Proyect[] =>
  Array.isArray(list) ? list.map(ProyectMap) : [];

/**
 * ProyectPostMap
 * Construye el payload para crear un proyecto (POST).
 */
export const ProyectPostMap = (src: Partial<ProyectPost> | any) => ({
  name: String(src?.name ?? ""),
  proyectkey: String(src?.proyectKey ?? src?.proyectkey ?? ""),
  proyectKey: String(src?.proyectKey ?? src?.proyectkey ?? ""),
  client: String(src?.client ?? ""),
  collaborators_ids: Array.isArray(src?.collaborators) ? src.collaborators : [],
  collabarators_ids: Array.isArray(src?.collaborators) ? src.collaborators : [],
  managerId: src?.managerId ?? null,
});

/**
 * ProyectPutMap
 * Construye el payload para actualizar un proyecto (PUT).
 */
export const ProyectPutMap = (src: Partial<ProyectPut> | any) => ({
  id: String(src?.id ?? ""),
  name: String(src?.name ?? ""),
  proyectkey: String(src?.proyectKey ?? src?.proyectkey ?? ""),
  proyectKey: String(src?.proyectKey ?? src?.proyectkey ?? ""),
  client: String(src?.client ?? ""),
  collaborators_ids: Array.isArray(src?.collaborators) ? src.collaborators : [],
  collabarators_ids: Array.isArray(src?.collaborators) ? src.collaborators : [],
  managerId: src?.managerId ?? null,
});
