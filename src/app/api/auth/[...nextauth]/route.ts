import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// Para empezar simple: Credentials “dev” (luego agregas Email/Google)
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Dev Login",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        if (!creds?.email) return null;
        // Crea/recupera usuario por email y rol por defecto TENANT
        let user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) user = await prisma.user.create({ data: { email: creds.email } });
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
    // Luego: Email / Google / GitHub ...
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role ?? "TENANT";
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      (session as any).userId = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };