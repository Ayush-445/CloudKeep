import { clerkMiddleware, createRouteMatcher, auth} from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher(["/", "/sign-up(.*)", "/sign-in(.*)"])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api(.*)'])
export default clerkMiddleware(async (auth, req) => {
    // const user = auth();
    // const userId = (await user).userId;
    // const url = new URL(request.url);

    // if (userId && isPublicRoute(request) && url.pathname !== "/") {
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    // if (userId && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))) {
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    // Protect non-public routes
    // if (!isPublicRoute(request)) {
    //     await auth.protect();
    // } 
    if (isProtectedRoute(req)) await auth.protect()
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
}