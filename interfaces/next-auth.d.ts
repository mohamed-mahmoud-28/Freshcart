import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    token?: string;
    phone?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      phone?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    token?: string;
    accessToken?: string;
  }
}
