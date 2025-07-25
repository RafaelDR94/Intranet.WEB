// next.config.js
const withSvgr = require('next-svgr');
/** @type {import('next').NextConfig} */
module.exports = withSvgr({
  // Desactiva Lightning CSS para forzar el pipeline clásico de PostCSS/Tailwind
  experimental: {
    useLightningcss: false,
  },
  
  // Puedes añadir aquí cualquier otra configuración de Next.js que necesites
  reactStrictMode: true,
  swcMinify: true,
});
