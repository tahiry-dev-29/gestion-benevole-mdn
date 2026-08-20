import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { AuthOptions, SessionStrategy, DefaultSession, JWT } from "next-auth";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

// Extend les types pour inclure nos champs personnalisés
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nom: string;
      prenom: string;
      role: UserRole;
      photo: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    sub: string;
    nom: string;
    prenom: string;
    role: UserRole;
    photo: string | null;
  }
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

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        // Vérifier le mot de passe
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
          role: user.role as UserRole,
          photo: user.photo,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.nom = token.nom;
        session.user.prenom = token.prenom;
        session.user.role = token.role;
        session.user.photo = token.photo;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.nom = (user as Record<string, unknown>).nom as string;
        token.prenom = (user as Record<string, unknown>).prenom as string;
        token.role = (user as Record<string, unknown>).role as UserRole;
        token.photo = (user as Record<string, unknown>).photo as string | null;
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