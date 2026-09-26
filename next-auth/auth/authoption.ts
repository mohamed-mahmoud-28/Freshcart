import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { routeApiUrl } from '@/API/server'

const Authoption: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "LogIn",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },

        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        let response: Response;
        let payload: { message?: string; token?: string; user?: { id?: string; _id?: string; name?: string; email?: string; phone?: string } };
        try {
          response = await fetch(routeApiUrl('/auth/signin'), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          payload = await response.json();
        } catch {
          // Keep backend/network failures inside the credentials flow instead of
          // allowing an unhandled exception to send users to the generic auth error page.
          throw new Error("Authentication service is unavailable");
        }

        if (!response.ok) {
          throw new Error(payload?.message || "Login failed");
        }

        let userdata: { id?: string } = {};
        if (payload?.token) {
          try {
            userdata = jwtDecode(payload.token);
          } catch {
            throw new Error("Authentication service returned an invalid token");
          }
        }

        const id = userdata.id || payload?.user?.id || payload?.user?._id;
        if (!payload?.token || !id) {
          throw new Error("Authentication service returned an invalid response");
        }

        return {
          id,
          name: payload?.user?.name,
          email: payload?.user?.email,
          phone: payload?.user?.phone,
          token: payload?.token,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        const backendToken = user.token || "";
        token.id = user.id as string;
        token.token = backendToken;
        token.accessToken = backendToken;
        token.phone = user.phone as string | undefined;
      }
      if (trigger === 'update' && session?.user) {
        if (typeof session.user.name === 'string') token.name = session.user.name
        if (typeof session.user.email === 'string') token.email = session.user.email
        if (typeof session.user.phone === 'string') token.phone = session.user.phone
      }
      return token;
    },

    session({ session, token }) {
      if (token?.id) {
        session.user.id = String(token.id);
      }

      if (typeof token.name === 'string') session.user.name = token.name
      if (typeof token.email === 'string') session.user.email = token.email
      if (typeof token.phone === 'string') session.user.phone = token.phone
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export default Authoption;
