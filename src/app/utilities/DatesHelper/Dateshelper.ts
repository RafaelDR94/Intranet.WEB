


/** Obtiene el mes actual con dos dígitos. */
export const month = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        return (month < 10) ? ("0" + month) : month
}
/** Obtiene el día del mes con dos dígitos. */
export const date = () => {
        const today = new Date();
        const date = today.getDate();
        return (date < 10) ? ("0" + date) : date
}
/** Obtiene el año actual. */
export const year = () => {
        const today = new Date();
        const year = today.getFullYear();
        return (year < 10) ? ("0" + year) : year
}
/** Fecha en formato YYYY-MM-DD. */
export const currentDate = () => { return year() + "-" + month() + "-" + date(); }
/** Fecha en formato YYYY/MM/DD. */
export const currentDateDataBase = () => { return year() + "/" + month() + "/" + date(); }
/** Hora en formato HH. */
export const getHour = (): string => {
        const today = new Date();
        const hour = today.getHours();
        return (hour < 10) ? ("0" + hour) : hour.toString();
}
/** Minutos en formato MM. */
export const getMinutes = (): string => {
        const today = new Date();
        const minutes = today.getMinutes();
        return (minutes < 10) ? ("0" + minutes) : minutes.toString();
}

/** Segundos en formato SS. */
export const getSeconds = (): string => {
        const today = new Date();
        const seconds = today.getSeconds();
        return (seconds < 10) ? ("0" + seconds) : seconds.toString();
}

/** Hora completa en formato HH:MM:SS. */
export const getTime = (): string => {
        return `${getHour()}:${getMinutes()}:${getSeconds()}`;
}

export const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
};
export interface UrlsFilterdInterface {
        onlydates: string;
        withtimefilter: string;
        withterminalfilter: string;
        onlydatesintermedial: string;
}

export const todayFilters = (): UrlsFilterdInterface => {
        let onlydates = "?StartDate=" + currentDateDataBase() + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let onlydatesintermedial = "&StartDate=" + currentDateDataBase() + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let withtimefilter = "?StartDate=" + currentDateDataBase() + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&filter=H"
        let withterminalfilter = "?StartDate=" + currentDateDataBase() + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&Terminals=1"
        return { onlydates, withtimefilter, withterminalfilter, onlydatesintermedial }
}

export const monthFilters = (): UrlsFilterdInterface => {
        let onlydates = "?StartDate=" + +year() + "/" + month() + "/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let onlydatesintermedial = "&StartDate=" + +year() + "/" + month() + "/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let withtimefilter = "?StartDate=" + +year() + "/" + month() + "/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&filter=D"
        let withterminalfilter = "?StartDate=" + +year() + "/" + month() + "/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&Terminals=1"
        return { onlydates, withtimefilter, withterminalfilter, onlydatesintermedial }
}

export const yearsFilters = (): UrlsFilterdInterface => {
        let onlydates = "?StartDate=" + year() + "/01/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let onlydatesintermedial = "&StartDate=" + year() + "/01/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59"
        let withtimefilter = "?StartDate=" + year() + "/01/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&filter=M"
        let withterminalfilter = "StartDate=" + year() + "/01/01" + " 00:00:00&EndDate=" + currentDateDataBase() + " 23:59:59&Terminals=1"
        return { onlydates, withtimefilter, withterminalfilter, onlydatesintermedial }
}

export const  formatDateHour=(fechaStr: string): string =>{
        //Solo para fechas con el siguiente formato 2025-04-23 16:47:20.66"
        const [fecha, horaCompleta] = fechaStr.split(" ");
        const [hora, minuto] = horaCompleta.split(":");
        return `${fecha} ${hora}:${minuto}`;
      }



