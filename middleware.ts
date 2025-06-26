// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   // Add cache headers for static assets
//   if (request.nextUrl.pathname.startsWith("/_next/static/")) {
//     // Cache static assets for 1 year
//     response.headers.set(
//       "Cache-Control",
//       "public, max-age=31536000, immutable"
//     );
//   }

//   // Add cache headers for public assets
//   if (request.nextUrl.pathname.startsWith("/public/")) {
//     // Cache public assets for 1 day
//     response.headers.set("Cache-Control", "public, max-age=86400");
//   }

//   // Add performance headers
//   response.headers.set("X-Content-Type-Options", "nosniff");
//   response.headers.set("X-Frame-Options", "DENY");
//   response.headers.set("X-XSS-Protection", "1; mode=block");

//   // Enable gzip compression for text-based resources
//   if (request.headers.get("accept-encoding")?.includes("gzip")) {
//     response.headers.set("Content-Encoding", "gzip");
//   }

//   // Add resource hints for better performance
//   if (request.nextUrl.pathname === "/") {
//     response.headers.set(
//       "Link",
//       "</fonts/firago-regular-webfont.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous"
//     );
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For admin routes, role check is handled by AdminGuard component
    // This middleware only ensures authentication
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
