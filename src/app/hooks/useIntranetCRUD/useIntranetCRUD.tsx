import {
  IntranetGetType,
  IntranetPostType,
  IntranetPutType,
  IntranetDeleteType,
} from "./types";

import { intranetClient } from "@/app/configurations/Axios/Clients";
import {
  basicGet,
  basicPost,
  basicPut,
  basicDelete,
  CallbackFunction,
} from "@/app/configurations/Axios/GenericMethods";
/**
 * Hook personalizado que expone un conjunto de métodos CRUD
 * preconfigurados para interactuar con el cliente HTTP `intranetClient`.
 *
 * Utiliza las funciones genéricas `basicGet`, `basicPost`, `basicPut` y `basicDelete`
 * para ejecutar peticiones HTTP y manejar sus respuestas mediante callbacks.
 *
 * @returns {object} API de métodos CRUD
 *
 * @property {(url: string, data: any, callback: CallbackFunction) => void} IntranetPost
 *  Envía una petición HTTP POST con el `intranetClient`.
 *
 * @property {(url: string, callback: CallbackFunction) => void} IntranetGet
 *  Envía una petición HTTP GET con el `intranetClient`.
 *
 * @property {(url: string, data: any, callback: CallbackFunction) => void} IntranetPut
 *  Envía una petición HTTP PUT con el `intranetClient`.
 *
 * @property {(url: string, callback: CallbackFunction) => void} IntranetDelete
 *  Envía una petición HTTP DELETE con el `intranetClient`.
 *
 * @example
 * const { IntranetGet, IntranetPost } = useIntranetCRUD();
 *
 * IntranetGet('/users', (response) => {
 *   console.log('Lista de usuarios:', response.data);
 * });
 *
 * IntranetPost('/users', { name: 'John' }, (response) => {
 *   console.log('Usuario creado:', response.data);
 * });
 */
const useIntranetCRUD = () => {
  const IntranetPost: IntranetPostType = (
    url: string,
    data: any,
    callback: CallbackFunction,
  ) => {
    basicPost(intranetClient, url, data, callback);
  };
  const IntranetGet: IntranetGetType = (
    url: string,
    callback: CallbackFunction,
  ) => {
    basicGet(intranetClient, url, callback);
  };
  const IntranetPut: IntranetPutType = (
    url: string,
    data: any,
    callback: CallbackFunction,
  ) => {
    basicPut(intranetClient, url, data, callback);
  };
  const IntranetDelete: IntranetDeleteType = (
    url: string,
    dataOrCallback: unknown | CallbackFunction,
    callback?: CallbackFunction,
  ) => {
    if (typeof dataOrCallback === "function") {
      basicDelete(intranetClient, url, dataOrCallback as CallbackFunction);
      return;
    }
    if (callback) {
      basicDelete(intranetClient, url, callback, "", {}, dataOrCallback);
    }
  };

  return {
    IntranetPost,
    IntranetGet,
    IntranetPut,
    IntranetDelete,
  };
};
export default useIntranetCRUD;
