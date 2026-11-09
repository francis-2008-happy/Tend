import { createSerwistRoute } from "@serwist/turbopack";

// Builds and serves the service worker at /serwist/sw.js.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
    // Only the public offline page is precached as a page. Signed-in pages
    // are never stored on the phone (security rule in CLAUDE.md).
    additionalPrecacheEntries: [
      {
        url: "/~offline",
        revision: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
      },
    ],
  });
