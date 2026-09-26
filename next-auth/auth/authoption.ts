import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

const apiBase = (process.env.API ?? 'https://ecommerce.routemisr.com/api/v1').replace(/\/+$/, '')

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
        const response = await fetch(`${apiBase}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "Login failed");
        }

        const userdata: { id?: string } = payload?.token ? jwtDecode(payload.token) : {};

        return {
          id: userdata.id || payload?.user?.id || payload?.user?._id || "",
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
