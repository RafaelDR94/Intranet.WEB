import { Proyect } from "../proyects/proyects.types";
export type ProyectLocationType = {
  id: string;
  name: string;
  linkmaps: string;
  address: string;
  proyect: Proyect[];
};
