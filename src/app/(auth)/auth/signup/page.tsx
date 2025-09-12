const roles = [
  {
    value: "propietario",
    label: "Propietario",
  },
  {
    value: "inquilino",
    label: "Inquilino",
  },
];

export default function SignUp() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Crea tu cuenta</h1>
      <p className="text-slate-300"></p>

      <form method="get" className="grid gap-3 sm:grid-cols-2 items-end">
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
            name="password"
            placeholder="Contraseña"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Nombre</label>
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>

        {/* Apellido */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Apellido</label>
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>

        {/* Rol */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">
            ¿Eres inquilino o propietario?
          </label>
          <select
            name="city"
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          >
            <option value={undefined}>Selecciona</option>
            {roles.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
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
