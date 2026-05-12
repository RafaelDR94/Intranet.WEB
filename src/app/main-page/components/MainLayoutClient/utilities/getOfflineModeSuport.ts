const routesSupport = [
    "/main-page/home/",
    "/main-page/proyects/proyects/proyectslist/",
    "/main-page/proyects/proyects/locations/",
    "/main-page/proyects/proyects/devices/",
    "/main-page/proyects/proyects/refactions/",
    "/main-page/proyects/inventory/devices/",
    "/main-page/proyects/inventory/refactions/",
    "/main-page/proyects/inventory/locations/",
    "/main-page/proyects/inventory/providers/",
    "/main-page/home/announcements/"]

export const getOfflineModeSuport = (route: string) => {
    return routesSupport.includes(route);
}
