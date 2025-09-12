export default function Login() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Ingresa a tu cuenta</h1>
      <p className="text-slate-300"></p>

      <form method="get" className="grid gap-3 sm:grid-cols-4 items-end">
        {/* Usuario */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Usuario</label>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Contraseña</label>
          <input
            type="text"
            placeholder="Contraseña"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
          >
            Ingresar
          </button>
        </div>
      </form>
    </section>
  );
}
