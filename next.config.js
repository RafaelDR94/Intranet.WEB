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

// const ContentSecurityPolicy = `default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none';`;

// const securityHeaders = [
//   {
//     key: "Content-Security-Policy",
//     value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
//   },
//   {
//     key: "Strict-Transport-Security",
//     value: "max-age=63072000; includeSubDomains; preload",
//   },
//   {
//     key: "X-Frame-Options",
//     value: "DENY",
//   },
//   {
//     key: "X-Content-Type-Options",
//     value: "nosniff",
//   },
//   {
//     key: "Referrer-Policy",
//     value: "same-origin",
//   },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=()",
//   },
// ];
const nextConfig = {
  experimental: {
    useLightningcss: false,
    workerThreads: false,
    cpus: 1,
  },
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
      unoptimized: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: securityHeaders,
  //     },
  //   ];
  // },
};

module.exports = withPWA(withSvgr(nextConfig));
