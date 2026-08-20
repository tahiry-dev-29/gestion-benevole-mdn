import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth-options";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export POST et GET pour Next.js App Router
export { handlers as GET, handlers as POST };