/// <reference lib="webworker" />
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { skipWaiting, clientsClaim } from 'workbox-core';

// —————————————————————————————————————————
// 0) Instalación rápida y toma de control
// —————————————————————————————————————————
skipWaiting();
clientsClaim();

// —————————————————————————————————————————
// 1) Precaché inyectado por VitePWA al build
// —————————————————————————————————————————
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<import('workbox-precaching').PrecacheEntry>;
};
precacheAndRoute(self.__WB_MANIFEST);

// —————————————————————————————————————————
// 2) Flag que togglean desde tu app
// —————————————————————————————————————————
let cacheOnlyMode = false;
self.addEventListener('message', (evt) => {
  if (evt.data?.type === 'CACHE_ONLY_MODE') {
    cacheOnlyMode = !!evt.data.payload;
    console.log('[SW] ▶ cacheOnlyMode =', cacheOnlyMode);
  }
});

// —————————————————————————————————————————
// Helper: elige la estrategia según modo
// —————————————————————————————————————————
async function handleRequest(
  request: Request,
  event: ExtendableEvent,
  strategy: { handle: (args: any) => Promise<Response> },
  label: string
): Promise<Response> {
  if (cacheOnlyMode) {
    console.log(`[SW][OFFLINE] CacheOnly para ${label} → ${request.url}`);
    // 1) runtime cache
    const rt = await caches.match(request);
    if (rt) return rt;
    // 2) precache (lo que inyectó VitePWA)
    const pc = await matchPrecache(request.url);
    if (pc) return pc;
    console.warn(`[SW] Recurso NO encontrado en cache: ${request.url}`);
    return Response.error();
  } else {
    console.log(`[SW][ONLINE] ${label} → estrategia ${strategy.constructor.name} → ${request.url}`);
    return strategy.handle({ request, event });
  }
}

// —————————————————————————————————————————
// 3) JS / CSS: NetworkFirst (cachea de la red y luego runtime)
// —————————————————————————————————————————
registerRoute(
  /\.(?:js|css)$/,
  ({ request, event }) =>
    handleRequest(
      request,
      event,
      new NetworkFirst({
        cacheName: 'static-resources',
        networkTimeoutSeconds: 3,
      }),
      'static-resources'
    )
);

// —————————————————————————————————————————
// 4) Imágenes / fuentes: StaleWhileRevalidate
// —————————————————————————————————————————
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|woff2?)$/,
  ({ request, event }) =>
    handleRequest(
      request,
      event,
      new StaleWhileRevalidate({
        cacheName: 'assets-cache',
      }),
      'assets-cache'
    )
);

// —————————————————————————————————————————
// 5) API: NetworkFirst (cachea respuestas)
// —————————————————————————————————————————
const apiPattern =
  /^https:\/\/drintranet\.somee\.com\/.*$|^https:\/\/drintranetqa\.somee\.com\/.*$|^https:\/\/localhost:7040\/.*$/;
registerRoute(
  apiPattern,
  ({ request, event }) =>
    handleRequest(
      request,
      event,
      new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
      }),
      'api-cache'
    )
);

// Patrón para todas las URLs de Firebase Storage
const firebasePattern = /^https:\/\/firebasestorage\.googleapis\.com\/.*/;

// 5.1) Ruta para Firebase Storage
registerRoute(
  firebasePattern,
  ({ request, event }) => {
    const url = request.url;
    if (url.includes('signature')) {
      // ———————— Cache “signature” ————————
      return handleRequest(
        request,
        event,
        new NetworkFirst({
          cacheName: 'firebase-signature-cache',
        }),
        'FirebaseSignature'
      );
    } else {
      return handleRequest(
        request,
        event,
        new NetworkFirst({
          cacheName: 'firebase-images-cache',
          plugins: [
            new ExpirationPlugin({
              maxEntries: 50,            // aprox. 50 imágenes
              purgeOnQuotaError: true,    // en caso de límite de espacio del navegador
            })
          ]
        }),
        'FirebaseStorage'
      );
    }
  }
);

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");
declare var firebase: any; // Asegúrate de que firebase esté disponible
firebase.initializeApp({
  apiKey: "AIzaSyBtlZct5NCo1_a6pxywUnuzESfj69HEQtY",
  authDomain: "intranetdr-50f9e.firebaseapp.com",
  projectId: "intranetdr-50f9e",
  messagingSenderId: "1069765395792",
  appId: "1:1069765395792:web:503f82a1ee32c02f7c9855"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload: any) => {
  console.log('[firebase-messaging-sw.js] Mensaje en background:', payload);

  const notification = payload.notification ?? {};
  const title = notification.title ?? 'Notificación';

  const options = {
    body: notification.body ?? 'Tienes una nueva notificación',
    icon:  '/DRUso2.png', // ✅ tu ícono personalizado
    badge: '/DRUso2.png',                             // opcional: ícono pequeño
    image: notification.image ?? undefined,                     // opcional: imagen visible
    data: {
      url: payload?.data?.click_action ?? '/',                  // para redirigir al hacer clic
      ...payload.data,
    },
  };

  self.registration.showNotification(title, options);
});

