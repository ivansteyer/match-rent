"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", { email, callbackUrl: "/" });
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-slate-300">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
          placeholder="nombre@correo.com"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {isSubmitting ? "Iniciando..." : "Continuar"}
      </button>
    </form>
  );
}
