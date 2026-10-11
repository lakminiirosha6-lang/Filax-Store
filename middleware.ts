import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { SUPER_ADMIN_EMAIL } from "./lib/roles";

export default withAuth(
  function middleware(req: any) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;
    
    // Check if accessing admin routes
    if (path.startsWith("/admin")) {
      const email = token?.email?.toLowerCase();
      const role = token?.role as string | undefined;

      // Allow if Super Admin email or admin role
      const isAuthorized = email === SUPER_ADMIN_EMAIL.toLowerCase() || role === "admin" || role === "owner";
      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: any }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
