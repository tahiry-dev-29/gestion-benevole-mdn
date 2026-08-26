"use client";

import { Session } from "next-auth";
import { SessionProvider as NextSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextSessionProvider session={session}>{children}</NextSessionProvider>
  );
}
