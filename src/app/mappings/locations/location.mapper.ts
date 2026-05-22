import { ProyectLocationType } from "./locations.types";
import type { LocationPost, LocationPut } from "./locations.types";

export const mapProyectLocation = (loc: any): ProyectLocationType => ({
  id: loc?.id,
  name: loc?.name,
  linkmaps: loc?.linkmaps,
  address: loc?.address,
  proyect: loc?.proyect ?? loc?.proyects ?? [],
});

export const mapProyectLocations = (locs: any[]): ProyectLocationType[] =>
  locs.map(mapProyectLocation);

export const mapLocationPost = (src: Partial<LocationPost> | any): LocationPost => ({
  name: String(src?.name ?? ""),
  linkmaps: String(src?.linkmaps ?? ""),
  address: String(src?.address ?? ""),
  proyects: Array.isArray(src?.proyects)
    ? src.proyects
        .map((projectId: unknown) => String(projectId ?? "").trim())
        .filter(Boolean)
    : undefined,
});

export const mapLocationPut = (src: Partial<LocationPut> | any): LocationPut => ({
  id: String(src?.id ?? ""),
  name: String(src?.name ?? ""),
  linkmaps: String(src?.linkmaps ?? ""),
  address: String(src?.address ?? ""),
  proyects: Array.isArray(src?.proyects)
    ? src.proyects
        .map((projectId: unknown) => String(projectId ?? "").trim())
        .filter(Boolean)
    : undefined,
});
