import AuthForm from "./AuthForm";
import { cookies } from "next/headers";

type Role = "LANDLORD" | "TENANT";

function parseRole(value: string | undefined): Role {
  return value === "LANDLORD" ? "LANDLORD" : "TENANT";
}

export default async function AuthStartPage() {
  const cookieStore = await cookies();
  const role = parseRole(cookieStore.get("intendedRole")?.value);

  return (
    <section className="max-w-md mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Accede a tu cuenta</h1>
        <p className="text-sm text-slate-400">
          Continuarás como: <span className="font-medium text-white">{role}</span>
        </p>
      </header>

      <AuthForm />
    </section>
  );
}
