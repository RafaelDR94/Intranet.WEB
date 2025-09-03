"use client";

import Image from "next/image";

const Announcements = () => {
    return (
        <div style={{ ['--topbar-h' as any]: '130px' }}>


            <section className="relative w-full overflow-hidden">
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

                {/* Grid de 2 filas: contenido centrado + leyenda.
          Altura = 100dvh - --topbar-h (sin scroll) */}
                <div
                    className="
                        mx-auto grid
                        /* Fallback para navegadores sin svh */
                        h-[calc(100vh-var(--topbar-h,0px)-1px)]
                        /* Si el navegador soporta svh, úsalo (más estable que vh/dvh) */
                        supports-[height:100svh]:h-[calc(100svh-var(--topbar-h,0px)-1px)]
                        max-w-[1020px]
                        grid-rows-[1fr_auto]
                        px-4 pb-6
                        overflow-y-clip
                    "
>
                    {/* Contenido centrado */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6 h-28 w-28 md:h-32 md:w-32">
                            <Image
                                src="/images/DR_Logo.svg"
                                alt="DR Security"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <h1 className="font-display text-h1 leading-[0.95] tracking-[-0.01em] text-blue-90">
                            BIENVENIDO A LA INTRANET
                        </h1>

                        <p className="mt-6 max-w-[860px] font-sans text-s1 font-semibold text-gray-70">
                            Un nuevo espacio donde podrás acceder a información, herramientas y recursos clave.
                        </p>

                        <p className="mt-4 font-sans text-b2 font-medium text-gray-70">
                            Este es tu espacio ¡Disfrútalo!
                        </p>
                    </div>

                    {/* Leyenda: sin margins que empujen, se mantiene visible */}
                    <p className="self-start ps-6 max-w-[1020px] font-sans text-c1 text-gray-70">
                        *Seguimos trabajando constantemente para mejorar y ampliar las funcionalidades, con el objetivo de que cada vez sea más útil y práctica para todos.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Announcements;
