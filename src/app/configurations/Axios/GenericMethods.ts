import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type CallbackFunction = (response: AxiosResponse | Error) => void;

const getDefaultConfig = (token: string): AxiosRequestConfig => ({
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
  }
});

export const basicPost = async (
  client: AxiosInstance,
  url: string,
  data: any,
  callback: CallbackFunction,
  token = '',
  additionalConfig: AxiosRequestConfig = {}
) => {
  try {
    const config = { ...getDefaultConfig(token), ...additionalConfig };
    const response = await client.post(url, data, config);
    callback(response);
  } catch (error) {
    callback(error as Error);
  }
};

export const basicGet = async (
  client: AxiosInstance,
  url: string,
  callback: CallbackFunction,
  token = '',
  additionalConfig: AxiosRequestConfig = {}
) => {
  try {
    const config = { ...getDefaultConfig(token), ...additionalConfig };
    const response = await client.get(url, config);
    callback(response);
  } catch (error) {
    callback(error as Error);
  }
};

export const basicPut = async (
  client: AxiosInstance,
  url: string,
  data: any,
  callback: CallbackFunction,
  token = '',
  additionalConfig: AxiosRequestConfig = {}
) => {
  try {
    const config = { ...getDefaultConfig(token), ...additionalConfig };
    const response = await client.put(url, data, config);
    callback(response);
  } catch (error) {
    callback(error as Error);
  }
};

export const basicDelete = async (
  client: AxiosInstance,
  url: string,
  callback: CallbackFunction,
  token = '',
  additionalConfig: AxiosRequestConfig = {}
) => {
  try {
    const config = { ...getDefaultConfig(token), ...additionalConfig };
    const response = await client.delete(url, config);
    callback(response);
  } catch (error) {
    callback(error as Error);
  }
};


