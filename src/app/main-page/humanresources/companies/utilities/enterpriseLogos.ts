import type { StaticImageData } from "next/image";

import LogoDR from "@/assets/images/Empresas/DR.png";
import LogoDisitrek from "@/assets/images/Empresas/DISITREK.jpg";
import LogoDisiva from "@/assets/images/Empresas/DISIVA.jpg";
import LogoItedesca from "@/assets/images/Empresas/ITEDESCA.jpg";
import LogoVip from "@/assets/images/Empresas/VIP.png";

export const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getEnterpriseLogo = (name: string): StaticImageData => {
  const normalized = normalizeText(name);
  if (normalized.includes("disitrek")) return LogoDisitrek;
  if (normalized.includes("disiva")) return LogoDisiva;
  if (normalized.includes("itedesca")) return LogoItedesca;
  if (normalized.includes("vip")) return LogoVip;
  return LogoDR;
};

export const getEnterpriseLogoAlt = (name: string): string => {
  const normalized = normalizeText(name);
  if (normalized.includes("disitrek")) return "Logo Disitrek";
  if (normalized.includes("disiva")) return "Logo Disiva";
  if (normalized.includes("itedesca")) return "Logo Itedesca";
  if (normalized.includes("vip")) return "Logo VIP";
  return "Logo DR";
};
