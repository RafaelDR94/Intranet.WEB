import axios, { AxiosInstance } from "axios";
const mode: number = 2;
export const intranetClient = createIntranetClient(mode);

function createIntranetClient(mode:number): AxiosInstance {

    let baseURL = "";
    switch (mode) {
        case 1:
            baseURL = process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_PROD!; ///Produccion
            break;
        case 2:
            baseURL =process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_STAGING!; ///Stagging
            break;
        case 3:
            baseURL = process.env.NEXT_PUBLIC_INTRANET_ENDPOINT_LOCAL!; //Local
            break;
    }
    return axios.create({
        baseURL: baseURL
    });
}

export const isProduction = () => mode === 1;
