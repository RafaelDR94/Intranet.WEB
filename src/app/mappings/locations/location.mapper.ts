import { ProyectLocationType } from "./locations.types";

export const mapProyectLocation = (loc: any): ProyectLocationType => ({
  id: loc?.id,
  name: loc?.name,
  linkmaps: loc?.linkmaps,
  address: loc?.address,
  proyect: loc?.proyect ?? [],
});

export const mapProyectLocations = (locs: any[]): ProyectLocationType[] =>
  locs.map(mapProyectLocation);
