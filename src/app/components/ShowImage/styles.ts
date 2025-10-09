type Cx = (...c: (string | false | undefined)[]) => string;
import { OverlayOpts } from "../LoadingOverLay/styles";
const cx: Cx = (...c) => c.filter(Boolean).join(' ');

const overlayBase =
  // NOTA: absolute + inset-0 = cubre SOLO el contenedor relativo donde se renderice
  'absolute inset-0 z-[90] flex items-center justify-center transition-all';
// Overlay pantalla completa (mismo enfoque visual que LoadingOverlay)

const overlay = ({ blur }: OverlayOpts) =>
  [
    overlayBase,
    `bg-[rgba(75,75,75,0.6)]`,
    blur ? 'backdrop-blur-[2px]' : '',
  ].join(' ');

// Tarjeta contenedora
const card = () =>
  cx(
    'relative',
    'max-w-[min(90vw,560px)]',
    'outline-none'
  );

// Botón de cierre (esquina superior derecha)
const closeBtn = () =>
  cx(
    'absolute -top-3 -right-3',
    'w-8 h-8 flex items-center justify-center',
    'rounded-full bg-gray-10 shadow-300',
    'hover:opacity-90 focus:outline-none'
  );

// Contenedor de imagen (centrada, con sombra)
const imageWrap = () =>
  cx(
    'w-full',
    'flex items-center justify-center',
    'p-2'
  );

const image = () =>
  cx(
    'max-h-[70vh] w-auto',
    'rounded-md shadow-500'
  );

// Contenedor del botón de acción (abajo, centrado)
const actions = () =>
  cx(
    'mt-4 w-full flex justify-center'
  );

export const classes = {
  overlay,
  card,
  closeBtn,
  imageWrap,
  image,
  actions,
};
