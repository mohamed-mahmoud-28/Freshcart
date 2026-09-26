import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getUserToken() {
    const cookieStore = await cookies();

    const sessionCookie =
        cookieStore.get("next-auth.session-token") ??
        cookieStore.get("__Secure-next-auth.session-token") ??
        cookieStore.get("__Host-next-auth.session-token");

    if (!sessionCookie?.value) {
        return undefined;
    }

    const decoded = await decode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: sessionCookie.value,
    });

    return (
        (decoded && typeof decoded === "object" && "accessToken" in decoded
            ? decoded.accessToken
            : decoded && typeof decoded === "object" && "token" in decoded
                ? decoded.token
                : undefined) as string | undefined
    );
}