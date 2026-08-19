import axios, { AxiosInstance } from "axios";
import { normalizeIntranetApiUrl } from "./normalizeIntranetApiUrl";

// Lee el modo desde .env y lo convierte a número (fallback a 1 si no se define)
const mode: number = parseInt(process.env.NEXT_PUBLIC_MODE || '1', 10);

export const intranetClient = createIntranetClient(mode);

function createIntranetClient(mode: number): AxiosInstance {
  let baseURL = "";

  switch (mode) {
    case 1:
      baseURL = process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_PROD!;
      break;
    case 2:
      baseURL = process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_STAGING!;
      break;
    case 3:
      baseURL = process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_LOCAL!;
      break;
    default:
      throw new Error(`Modo inválido: ${mode}`);
  }

  const client = axios.create({
    baseURL,
  });

  client.interceptors.request.use((config) => {
    if (config.url) {
      config.url = normalizeIntranetApiUrl(config.url);
    }
    return config;
  });

  return client;
}

export const isProduction = () => mode === 1;
