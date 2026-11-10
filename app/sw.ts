/// <reference lib="webworker" />
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
} from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Privacy-first caching (docs/PLAN.md section 6, CLAUDE.md security rules):
 * only public, identical-for-everyone files are cached (app code, fonts,
 * icons, garden art). Pages, data and anything from Supabase always come
 * from the network, so private content is never stored on the phone.
 */
export const runtimeCaching: RuntimeCaching[] = [
  {
    // Built app code and fonts: content-hashed, safe to keep.
    matcher: ({ sameOrigin, url }) =>
      sameOrigin && url.pathname.startsWith("/_next/static/"),
    handler: new CacheFirst({
      cacheName: "tend-static",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  },
  {
    // Public icons and illustrations shipped with the app.
    matcher: ({ sameOrigin, url }) =>
      sameOrigin && /^\/(icons|garden|illustrations|photos|clips)\//.test(url.pathname),
    handler: new CacheFirst({
      cacheName: "tend-public-images",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  },
  {
    // Everything else (pages, server data, Supabase, photos): never cached.
    matcher: () => true,
    handler: new NetworkOnly(),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
