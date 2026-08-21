import type { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import { loginSchema } from "@/features/auth/auth.schema";
import { prisma } from "@/lib/prisma";

const SESSION_MAX_AGE_SHORT = 60 * 60;

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: SESSION_MAX_AGE_SHORT,
    updateAge: 60 * 30,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login?error=access_denied",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@benevol.local" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
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

        const valid = await bcryptjs.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          photo: user.photo,
          rememberMe: parsed.data.rememberMe === true,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.nom = (user as Record<string, unknown>).nom as string;
        token.prenom = (user as Record<string, unknown>).prenom as string;
        token.role = (user as Record<string, unknown>).role as string;
        token.photo = (user as Record<string, unknown>).photo as string | null;
        token.rememberMe = (user as Record<string, unknown>).rememberMe as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.nom = token.nom ?? "";
        session.user.prenom = token.prenom ?? "";
        session.user.role = token.role ?? "";
        session.user.photo = token.photo ?? null;
      }
      return session;
    },
  },
};
