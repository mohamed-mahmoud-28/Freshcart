import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const myToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const accessToken = myToken?.accessToken;

    const protectAuth = ["/login", "/register"];
    const protectPages = ["/cart", "/profile", "/addresses", "/orders", "/checkout", "/wishlist"];

    // User NOT logged in
    if (
        !accessToken &&
        protectPages.some((protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`))
    ) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }


    // User IS logged in
    if (
        accessToken &&
        protectAuth.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))
    ) {
        return NextResponse.redirect(
            new URL("/profile", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart/:path*",
        "/profile/:path*",
        "/addresses/:path*",
        "/orders/:path*",
        "/checkout/:path*",
        "/wishlist/:path*",
        "/login",
        "/register",
    ],
};
