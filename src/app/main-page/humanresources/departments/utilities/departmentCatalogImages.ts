import type { StaticImageData } from "next/image";

import Default1 from "@/assets/images/DefautlImagesCards/Default1.png";
import Default2 from "@/assets/images/DefautlImagesCards/Default2.png";
import Default3 from "@/assets/images/DefautlImagesCards/Default3.png";

const departmentImages: StaticImageData[] = [Default1, Default2, Default3];

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Resuelve la imagen de catalogo a mostrar para un departamento.
 *
 * @param name Nombre o identificador del departamento.
 * @returns URL estatica de la imagen.
 */
export const getDepartmentCatalogImage = (name: string): string => {
  if (!name) return departmentImages[0].src;
  const normalized = normalizeText(name);
  let hash = 0;
  for (const char of normalized) {
    hash = (hash + char.charCodeAt(0)) % departmentImages.length;
  }
  return departmentImages[hash].src;
};

/**
 * Resuelve texto alterno para la imagen del catalogo.
 *
 * @param name Nombre del departamento.
 * @returns Alt descriptivo.
 */
export const getDepartmentCatalogAlt = (name: string): string =>
  name ? `Departamento ${name}` : "Departamento";
