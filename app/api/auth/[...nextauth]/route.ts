import NextAuth from "next-auth";
import Authoption from "./../../../../next-auth/auth/authoption";

const handler = NextAuth(Authoption);

export { handler as GET, handler as POST }; 