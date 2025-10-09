const routesSupport = [
    "/main-page/home/",
    "/main-page/sip/proyects/proyectslist/",
    "/main-page/home/announcements/"]

export const getOfflineModeSuport = (route: string) => {
    return routesSupport.includes(route);
}