import { Proyect } from "../proyects/proyects.types";
export type ProyectLocationType = {
  id: string;
  name: string;
  linkmaps: string;
  address: string;
  proyect: Proyect[];
};

export type LocationPost = {
  name: string;
  linkmaps: string;
  address: string;
};

export type LocationPut = {
  id: string;
  name: string;
  linkmaps: string;
  address: string;
};
