import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import { loginSchema } from "@/features/auth/auth.schema";
import { prisma } from "@/lib/prisma";

// 7 jours si "Se souvenir de moi", 1h sinon (session JWT)
const SESSION_MAX_AGE_LONG = 60 * 60 * 24 * 7; // 7j
const SESSION_MAX_AGE_SHORT = 60 * 60; // 1h

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Durée par défaut ; sera surchargée dans le JWT callback via token.rememberMe
    maxAge: SESSION_MAX_AGE_SHORT,
    updateAge: 60 * 30, // sliding refresh 30 min
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        const parsed = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
          rememberMe:
            (credentials as Record<string, unknown>).rememberMe === "on" ||
            (credentials as Record<string, unknown>).rememberMe === "true",
        });
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user || !user.password) return null;

        const valid = await bcryptjs.compare(
          parsed.data.password,
          user.password
        );
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          rememberMe: parsed.data.rememberMe === true,
        };
      },
    }),
  ],
  callbacks: {
    // Le rafraîchissement du token ajuste la durée de vie de la session selon "rememberMe".
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = String(user.id);
        token.role = user.role;
        if (!token.rememberMe) token = { ...token, rememberMe: false };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id ?? "");
        session.user.role = token.role ?? "BENEVOLE";
        session.maxAge = token.rememberMe
          ? SESSION_MAX_AGE_LONG
          : SESSION_MAX_AGE_SHORT;
      }
      return session;
    },
  },
};
