
import { intranetClient, isProduction } from "@/app/configurations/Axios/Clients";
import { FirebaseRealtimeHelper } from "./useFirebaseRealTimeHelpet";
import { Database } from "firebase/database";
import { useEffect, useRef } from "react";
import { User } from "../../AuthContext/types";

import { currentDateDataBase, getTime } from "@/app/utilities/DatesHelper/Dateshelper";
interface Uselogsprops {
    firebaserealtime: FirebaseRealtimeHelper;
    database: Database | null
    user: User | null
    offlineMode: boolean
    setHasExpired: React.Dispatch<React.SetStateAction<boolean>>
}
const Uselogs = ({ firebaserealtime, database, user, setHasExpired, offlineMode }: Uselogsprops) => {
    const path = isProduction() ? "Production" : "Sandbox"
    const errorQueueRef = useRef<any[]>([]);
    const flushErrorQueue = async () => {
        if (firebaserealtime && errorQueueRef.current.length > 0) {
            const queueToFlush = [...errorQueueRef.current];
            // Vaciar la cola
            errorQueueRef.current = [];
            for (const errorData of queueToFlush) {
                try {
                    await firebaserealtime.pushData("Logs/" + path + "/Front/" + currentDateDataBase() + "/" + getTime(), errorData);
                } catch (err) {
                    errorQueueRef.current.push(errorData);
                }
            }
        }
    };

    const logError = async (service: string, error: any) => {

        const errorDetails = {
            advisor: user?.userName,
            message: error?.message ?? error?.data?.error_Message,
            status: error?.response?.status ?? error?.status,
            url: error?.config?.url || "N/A",
            method: error?.config?.method || "N/A",
            data: error.response?.data || "Sin datos",
            timestamp: new Date().toISOString(),
        };
        if (!user) return;

        try {
            if (firebaserealtime) {
                await firebaserealtime.pushData("Logs/" + path + "/Front/" + currentDateDataBase() + "/" + getTime(), { service, ...errorDetails });
            } else {
                errorQueueRef.current.push({ service, ...errorDetails });
            }
        } catch (firebaseError) {
            errorQueueRef.current.push({ service, ...errorDetails });
            console.error("Error al registrar en Firebase:", firebaseError);
        }
    };

    useEffect(() => {
        const handleOnline = () => {
            flushErrorQueue();
        };
        window.addEventListener("online", handleOnline);
        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [firebaserealtime]);


    useEffect(() => {
        if (database) flushErrorQueue();
    }, [database]);




    useEffect(() => {
        if (intranetClient) {
            const interceptor = intranetClient.interceptors.response.use(
                (response) => {
                    if (response.status < 200 || response.status >= 300) {
                        if (response.status == 401 && !offlineMode) {
                            setHasExpired(true);
                        }
                        if (firebaserealtime) {
                            logError("INTRANET", response);
                        }
                    }

                    return response;
                },
                async (error) => {
                    if (firebaserealtime) {
                        await logError("INTRANET", error);
                        if ((error?.code == "ERR_FAILED" ||
                            error?.code == "ERR_HTTP2_PROTOCOL_ERROR" ||
                            error?.code == "ECONNABORTED" ||
                            error?.code == "ERR_ABORTED" ||
                            error?.code == "ERR_NAME_NOT_RESOLVED" ||
                            error?.code == "ERR_NETWORK") && !offlineMode) {
                            setHasExpired(true);
                        }
                        return;
                    }

                    if ((error?.code == "ERR_FAILED" ||
                        error?.code == "ERR_HTTP2_PROTOCOL_ERROR" ||
                        error?.code == "ECONNABORTED" ||
                        error?.code == "ERR_ABORTED" ||
                        error?.code == "ERR_NAME_NOT_RESOLVED" ||
                        error?.code == "ERR_NETWORK") && !offlineMode) {
                        setHasExpired(true);
                    }
                    return Promise.reject(error);
                }
            );
            return () => {
                intranetClient.interceptors.response.eject(interceptor);
            };
        }
    }, [firebaserealtime, intranetClient]);


    return {}
}
export default Uselogs;