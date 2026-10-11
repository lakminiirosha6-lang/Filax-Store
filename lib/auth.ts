import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getPermissions, isSuperAdminEmail } from "./roles";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user?.email) {
        token.email = user.email;
        const isSuper = isSuperAdminEmail(user.email);
        const perms = getPermissions(user.email, isSuper ? "admin" : "customer");
        token.role = isSuper ? "admin" : "customer";
        token.displayRole = perms.displayRole;
        token.isSuperAdmin = perms.isSuperAdmin;
        token.canAddOwner = perms.canAddOwner;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user && token?.email) {
        session.user.email = token.email as string;
        const isSuper = isSuperAdminEmail(token.email as string);
        const perms = getPermissions(token.email as string, isSuper ? "admin" : (token.role || "customer"));
        session.user.role = token.role;
        session.user.displayRole = perms.displayRole;
        session.user.isSuperAdmin = perms.isSuperAdmin;
        session.user.canAddOwner = perms.canAddOwner;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "filax-store-secure-fallback-development-secret-key-32b",
};
