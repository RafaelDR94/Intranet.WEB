export type OverlayOpts = { blur: boolean; backdropOpacity: number };

const overlayBase =
  // NOTA: absolute + inset-0 = cubre SOLO el contenedor relativo donde se renderice
  'absolute inset-0 z-[20000] flex items-center justify-center transition-all';

const box =
  'flex flex-col items-center gap-4 ' ;

const text =
  'text-center text-b2 text-black-100';

const overlay = ({ blur }: OverlayOpts) =>
  [
    overlayBase,
    `bg-[rgba(75,75,75,0.6)]`,
    blur ? 'backdrop-blur-[2px]' : '',
  ].join(' ');

export const classes = { overlay, box, text };
