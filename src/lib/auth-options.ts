import type { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  nom: string;
  prenom: string;
  role: "ADMIN" | "BENEVOLE";
  photo: string | null;
}

interface CustomJWT {
  sub: string;
  name: string;
  email: string;
  nom: string;
  prenom: string;
  role: "ADMIN" | "BENEVOLE";
  photo: string | null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@benevol.local" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role as "ADMIN" | "BENEVOLE",
          photo: user.photo,
        } as AuthUser;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ session, token }) {
      const customToken = token as unknown as CustomJWT;
      if (customToken) {
        (session.user as Record<string, unknown>).id = customToken.sub;
        (session.user as Record<string, unknown>).name = customToken.name;
        (session.user as Record<string, unknown>).email = customToken.email;
        (session.user as Record<string, unknown>).nom = customToken.nom;
        (session.user as Record<string, unknown>).prenom = customToken.prenom;
        (session.user as Record<string, unknown>).role = customToken.role;
        (session.user as Record<string, unknown>).photo = customToken.photo;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as unknown as AuthUser;
        token.sub = authUser.id;
        token.name = authUser.name;
        token.email = authUser.email;
        token.nom = authUser.nom;
        token.prenom = authUser.prenom;
        token.role = authUser.role;
        token.photo = authUser.photo;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=access_denied",
  },
  secret: process.env.NEXTAUTH_SECRET,
};