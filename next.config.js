const withSvgr = require("next-svgr");
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  sw: "sw.js", 
  swSrc: "src/sw.ts", 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: false,
  },
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, 
  },
};

module.exports = withPWA(withSvgr(nextConfig));
