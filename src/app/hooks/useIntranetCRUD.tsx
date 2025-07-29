import { basicGet,basicPost,basicPut,basicDelete,CallbackFunction } from "@/app/configurations/Axios/GenericMethods";
import { intranetClient } from "@/app/configurations/Axios/Clients";

const useIntranetCRUD = ()=>{
    const IntranetPost = (url: string, data: any, callback: CallbackFunction)=>{
        basicPost(intranetClient,url,data,callback);
    }
    const IntranetGet = ( url: string, callback: CallbackFunction)=>{
       basicGet(intranetClient,url,callback);
    }
    const IntranetPut = ( url: string, data: any, callback: CallbackFunction)=>{
        basicPut(intranetClient,url,data,callback);
    }
    const IntranetDelete = (url: string, callback: CallbackFunction)=>{
        basicDelete(intranetClient,url,callback);
    }
    return {
        IntranetPost,
        IntranetGet,
        IntranetPut,
        IntranetDelete,
    }
}
export default useIntranetCRUD;