import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nom: string;
      prenom: string;
      role: string;
      photo: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    nom?: string;
    prenom?: string;
    role?: string;
    photo?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    name?: string;
    email?: string;
    nom?: string;
    prenom?: string;
    role?: string;
    photo?: string | null;
  }
}
