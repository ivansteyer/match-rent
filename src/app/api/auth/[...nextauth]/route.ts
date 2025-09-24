import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// Para empezar simple: Credentials “dev” (luego agregas Email/Google)
import Credentials from "next-auth/providers/credentials";

function parseCookie(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(";")
      .map((s) => s.trim().split("=", 2))
      .filter((x) => x.length === 2)
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/start" },
  providers: [
    Credentials({
      name: "Dev Login",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds, req) {
        if (!creds?.email) return null;
        // Crea/recupera usuario por email y rol por defecto TENANT
        const existing = await prisma.user.findUnique({ where: { email: creds.email } });
        if (existing) {
          // Usuarios existentes mantienen su rol actual (seguridad)
          return { id: existing.id, email: existing.email ?? undefined, role: existing.role };
        }

        const cookieHeader = req?.headers?.get("cookie") || "";
        console.log("cookie header:", cookieHeader);
        const cookies = parseCookie(cookieHeader);
        const intendedRole = cookies["intendedRole"] === "LANDLORD" ? "LANDLORD" : "TENANT";
        console.log("creating user with role:", intendedRole);

        const user = await prisma.user.create({
          data: { email: creds.email, role: intendedRole },
        });

        return { id: user.id, email: user.email ?? undefined, role: user.role };
      },
    }),
    // Luego: Email / Google / GitHub ...
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof (user as { role?: unknown }).role === "string") {
        token.role = (user as { role: string }).role;
      } else if (user) {
        token.role = "TENANT";
      }
      if (typeof token.role !== "string") {
        token.role = "TENANT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const role = typeof token.role === "string" ? token.role : "TENANT";
        session.user = {
          ...session.user,
          role,
          ...(token.sub ? { id: token.sub } : {}),
        } as typeof session.user & { role: string; id?: string };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };