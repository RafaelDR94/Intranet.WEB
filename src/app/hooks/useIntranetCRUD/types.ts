

import { CallbackFunction } from "@/app/configurations/Axios/GenericMethods"
export type IntranetGetType = (url: string, callback: CallbackFunction) => void
export type IntranetPostType = (url: string, data: any, callback: CallbackFunction) => void
export type IntranetPutType = (url: string, data: any, callback: CallbackFunction) => void
export type IntranetDeleteType = (url: string, callback: CallbackFunction) => void