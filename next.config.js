const withSvgr = require("next-svgr");
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' ? true : false, 
  sw: 'sw.js',               // nombre del archivo SW de salida (opcional, por defecto sw.js)
  swSrc: 'src/sw.ts',        // ruta al archivo de fuente del SW personalizado

});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: false,
  },
  reactStrictMode: true,
};

module.exports = withPWA(withSvgr(nextConfig));
