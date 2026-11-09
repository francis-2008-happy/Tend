import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip static files, icons, the service worker and the manifest.
  matcher: [
    "/((?!_next/static|_next/image|serwist|icons|garden|illustrations|favicon.ico|manifest.webmanifest|~offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
