import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { normalizeIntranetApiUrl } from "./normalizeIntranetApiUrl";

export type CallbackFunction = (response: AxiosResponse) => void;

const getDefaultConfig = (token: string): AxiosRequestConfig => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
  validateStatus: () => true, // <-- siempre retorna la respuesta, no lanza
});

const request = async (
  method: "get" | "post" | "put" | "delete",
  client: AxiosInstance,
  url: string,
  callback: CallbackFunction,
  token = "",
  data?: any,
  additionalConfig: AxiosRequestConfig = {},
) => {
  const config = { ...getDefaultConfig(token), ...additionalConfig };
  const normalizedUrl = normalizeIntranetApiUrl(url);
  let response: AxiosResponse;
  try {
    if (method === "delete") {
      response = await client.delete(
        normalizedUrl,
        data === undefined ? config : { ...config, data },
      );
    } else if (method === "get") {
      response = await client[method](normalizedUrl, config);
    } else {
      response = await client[method](normalizedUrl, data, config);
    }
    callback(response);
  } catch (error: any) {
    callback(error);
  }
};

// Métodos específicos
export const basicGet = (
  client: AxiosInstance,
  url: string,
  callback: CallbackFunction,
  token = "",
  additionalConfig: AxiosRequestConfig = {},
) => request("get", client, url, callback, token, undefined, additionalConfig);

export const basicPost = (
  client: AxiosInstance,
  url: string,
  data: any,
  callback: CallbackFunction,
  token = "",
  additionalConfig: AxiosRequestConfig = {},
) => request("post", client, url, callback, token, data, additionalConfig);

export const basicPut = (
  client: AxiosInstance,
  url: string,
  data: any,
  callback: CallbackFunction,
  token = "",
  additionalConfig: AxiosRequestConfig = {},
) => request("put", client, url, callback, token, data, additionalConfig);

export const basicDelete = (
  client: AxiosInstance,
  url: string,
  callback: CallbackFunction,
  token = "",
  additionalConfig: AxiosRequestConfig = {},
  data?: unknown,
) => request("delete", client, url, callback, token, data, additionalConfig);
