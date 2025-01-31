import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setSession, verifyToken } from "@/lib/auth/session";
import setCookie from "set-cookie-parser";

const REDIRECT_ROUTES = ["/sign-in", "/confirm-connection"];
const protectedRoutes = "/app";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const cookieVerified = sessionCookie && (await verifyToken(sessionCookie.value));

  // TODO: Try this again with same domain
  if (REDIRECT_ROUTES.some((p) => pathname.startsWith(p))) {
    if (pathname.startsWith("/sign-in") && cookieVerified) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Get the session id from the url
    const params = request.nextUrl.searchParams;
    const sessionId = params.get("session");
    if (sessionId) {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({
            sessionId,
          }),
        });
        const cookieHeader = resp.headers.getSetCookie()[0];
        const sessionCookie = setCookie.parse(cookieHeader)[0];
        if (resp.ok && sessionCookie) {
          await verifyToken(sessionCookie.value);
          await setSession(sessionCookie);
          if (pathname.startsWith("/sign-in")) {
            return NextResponse.redirect(new URL("/app", request.url));
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        const url = request.nextUrl.clone();
        url.searchParams.delete("session");
        return NextResponse.redirect(url);
      }
    }
  }
  //   if (!sessionCookie) {
  //     console.log("Redirect not verified");
  //     // return NextResponse.redirect(new URL("/sign-in", request.url));
  //     return NextResponse.next();
  //   }
  //   await verifyToken(sessionCookie.value);
  //   console.log("Redirect verified");
  //   return NextResponse.next();
  // }

  const isProtectedRoute = pathname.startsWith(protectedRoutes);

  if (isProtectedRoute && !cookieVerified) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let res = NextResponse.next();

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
