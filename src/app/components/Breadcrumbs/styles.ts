export const breadcrumbsStyles = {
  // Contenedor de la hilera de migas
  // - scroll horizontal en mobile
  // - no wraps
  // - padding lateral pequeño para que el scroll no “corte” el primer/último item
  container:
    [
      'flex items-center',
      'gap-1 sm:gap-2',
      'text-c2 sm:text-b2',          // tipografías semánticas (mobile ↓)  📝
      'overflow-x-auto overscroll-x-contain',
      'whitespace-nowrap',
      '-mx-2 px-2',                  // “sangrado” para scroll cómodo
      'py-1',
      'rounded-md',
      // oculta scrollbars de forma cross-browser sin plugins
      '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    ].join(' '),

  // El icono separador
  separator:
    [
      'text-gray-70',
      'shrink-0',                    // no se colapsa al trunca textos
      'mx-1 sm:mx-2',
    ].join(' '),
};

export const itemStyles = {
  base:
    [
      'rounded-md',
      'px-1.5 py-1 sm:px-2 sm:py-1', // toque cómodo en mobile, más aire en desktop
      'text-c2 sm:text-b2',
      'shrink-0',                    // evita que el botón encoja
      'max-w-[60vw] sm:max-w-none',  // trunca en mobile para no romper layout
      'truncate',                    // “Texto muy largo…”
      'align-middle',
    ].join(' '),

  active:   'text-green-100 font-semibold hover:bg-gray-20',
  inactive: 'text-gray-70 hover:text-gray-70 hover:bg-gray-20',
  disabled: 'text-gray-50 cursor-not-allowed',
};