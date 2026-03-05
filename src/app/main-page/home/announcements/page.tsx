"use client"

import Image from "next/image";

const Announcements = () => {
  return (
    // Puedes ajustar este valor por breakpoint si tu topbar cambia de altura
    <div style={{ ["--topbar-h" as any]: "130px" }}>
      <section className="relative w-full">
        {/* Fondo fijo */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/DR_IntranetBackground_Bienvenida-01.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 
          GRID: contenido centrado + leyenda 
          - En mobile (base): se permite scroll si el contenido no cabe (overflow-y-auto).
          - Desde md: se bloquea el scroll (overflow-y-clip) para mantener el layout hero sin desplazamiento.
        */}
        <div
          className="
            mx-auto grid
            /* Alturas responsivas y estables */
            h-[calc(100vh-var(--topbar-h,0px))]
            supports-[height:100svh]:h-[calc(100svh-var(--topbar-h,0px))]
            max-w-[1020px]
            grid-rows-[1fr_auto]
            px-4
            pb-[calc(24px+env(safe-area-inset-bottom))]  /* respiración en móviles con notch */
            overflow-y-auto md:overflow-y-clip
          "
        >
          {/* Contenido centrado */}
          <div className="flex flex-col items-center justify-center text-center py-8 md:py-0">
            {/* Logo responsivo */}
            <div className="relative mb-5 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <Image
                src="/images/DR_Logo.svg"
                alt="DR Security"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Título responsivo: en móviles baja a h3/h2 para evitar cortes */}
            <h1 className="font-display leading-[0.98] tracking-[-0.01em] text-blue-90
                           text-h3 sm:text-h2 md:text-h1">
              BIENVENIDO A LA INTRANET
            </h1>

            {/* Párrafo 1: reduce tamaño y ancho en móviles */}
            <p className="mt-4 sm:mt-5 max-w-[860px] font-sans text-blue-50
                          text-b2 sm:text-s1 font-semibold">
              Un nuevo espacio donde podrás acceder a información, herramientas y recursos clave.
            </p>

            {/* Párrafo 2 */}
            <p className="mt-3 sm:mt-4 font-sans text-blue-50
                          text-c1 sm:text-b2 font-medium">
              Este es tu espacio ¡Disfrútalo!
            </p>
          </div>

          {/* Leyenda inferior */}
          <p className="self-start ps-2 sm:ps-6 max-w-[1020px] font-sans text-blue-50
                        text-c2 sm:text-c1">
            *Seguimos trabajando constantemente para mejorar y ampliar las funcionalidades, con el objetivo de que cada vez sea más útil y práctica para todos.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Announcements;
