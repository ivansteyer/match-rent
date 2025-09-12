'use client';

import { useEffect, useState } from 'react';

type Props = {
  cities: string[];                // opciones de ciudad (las trae el server)
  initial: { city?: string; min?: number | null; max?: number | null }; // valores actuales
};

/**
 * Componente de filtros.
 * - Es un <form method="get">, así Next pone los filtros en la URL (?city=&min=&max=)
 * - No hace fetch directo: recarga la página con nuevos search params
 * - El Server Component (page.tsx) re-lee esos params y filtra en Prisma.
 */
export default function FilterBar({ cities, initial }: Props) {
  const [city, setCity] = useState(initial.city ?? '');
  const [min, setMin] = useState<string>(initial.min?.toString() ?? '');
  const [max, setMax] = useState<string>(initial.max?.toString() ?? '');

  // Si cambian los search params desde fuera, sincronizamos (defensivo)
  useEffect(() => {
    setCity(initial.city ?? '');
    setMin(initial.min?.toString() ?? '');
    setMax(initial.max?.toString() ?? '');
  }, [initial.city, initial.min, initial.max]);

  return (
    <form method="get" className="grid gap-3 sm:grid-cols-4 items-end">
      {/* Ciudad */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300">Ciudad</label>
        <select
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
        >
          <option value="">Todas</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Precio mínimo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300">Precio mínimo (€)</label>
        <input
          type="number"
          name="min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="Ej: 900"
          min={0}
          className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
        />
      </div>

      {/* Precio máximo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-300">Precio máximo (€)</label>
        <input
          type="number"
          name="max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          placeholder="Ej: 1300"
          min={0}
          className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
        >
          Filtrar
        </button>
        <a
          href="/tenant/swipe"
          className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-800"
        >
          Limpiar
        </a>
      </div>
    </form>
  );
}