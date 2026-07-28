import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Normalize host (strip port number if present)
  const host = hostname.split(":")[0].toLowerCase();
  const path = url.pathname;

  console.log(`[Middleware] Incoming: ${host}${path}`);

  // 1. Skip static files, Next internal routes, and API endpoints
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Loop Guard: If path already starts with /academy, /admin, or /marketing, stop rewriting
  if (
    path.startsWith("/academy") ||
    path.startsWith("/admin") ||
    path.startsWith("/marketing")
  ) {
    return NextResponse.next();
  }

  // 2.5 Global Auth Routes: Rewrite /login and /forgot-password to marketing
  if (path === "/login" || path === "/forgot-password") {
    url.pathname = `/marketing${path}`;
    return NextResponse.rewrite(url);
  }

  // 3. Determine target application subdomain
  let subdomain = "marketing";

  if (
    host.startsWith("admin.") ||
    host === "admin.sientoops.com" ||
    host === "admin.localhost"
  ) {
    subdomain = "admin";
  } else if (
    host.startsWith("academy.") ||
    host.startsWith("egitim.") ||
    host === "academy.sientoops.com" ||
    host === "egitim.sientoops.com" ||
    host === "academy.localhost" ||
    host === "egitim.localhost"
  ) {
    subdomain = "academy";
  }

  // 4. Perform direct internal rewrite to target app route without server redirects
  if (subdomain === "academy") {
    url.pathname = `/academy${path === "/" ? "/dashboard" : path}`;
  } else if (subdomain === "admin") {
    url.pathname = `/admin${path === "/" ? "/dashboard" : path}`;
  } else {
    url.pathname = `/marketing${path === "/" ? "" : path}`;
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
