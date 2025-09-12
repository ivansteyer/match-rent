'use client';

import { useState, useTransition } from 'react';

type Property = {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number;
  photos: unknown; // array de strings
  // opcionales si luego los agregas al modelo:
  // sizeM2?: number; rooms?: number; stayType?: string; neighborhood?: string;
};

export default function SwipeCard({
  initial,
  onLike,
  onSkip,
}: {
  initial: Property[];
  onLike: (id: string) => Promise<void>;
  onSkip: (id: string) => Promise<void>;
}) {
  const [queue, setQueue] = useState<Property[]>(initial);
  const [isPending, startTransition] = useTransition();

  const current = queue[0];
  const photos = current && Array.isArray(current.photos) ? (current.photos as string[]) : [];
  const [idx, setIdx] = useState(0);
  const img = photos[idx] ?? 'https://images.unsplash.com/photo-1505691938895-1758d7feb511';

  function nextCard() {
    setQueue((q) => q.slice(1));
    setIdx(0);
  }

  if (!current) {
    return (
      <div className="w-[360px] md:w-[420px] rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-xl">
        <p className="text-slate-300">¡No hay más pisos por ahora! 🎉</p>
      </div>
    );
  }

  return (
    <div className="w-[360px] md:w-[420px] rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-2xl">
      {/* Imagen + flechas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-600 bg-slate-800">
        <img src={img} alt={current.title} className="h-56 w-full object-cover" />
        <button
          aria-label="prev"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-900/70 grid place-items-center"
          onClick={() => setIdx((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0))}
        >
          ‹
        </button>
        <button
          aria-label="next"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-900/70 grid place-items-center"
          onClick={() => setIdx((i) => (photos.length ? (i + 1) % photos.length : 0))}
        >
          ›
        </button>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <Badge icon="㎡" label="m²" value="100" />
        <Badge icon="🛏️" label="Habitaciones" value="2" />
        <Badge icon="🏷️" label="Larga estancia" value="" />
        <Badge icon="☕" label="Balcón" value="✔" />
        <Badge icon="🧳" label="Amueblado" value="✔" />
        <Badge icon="📍" label={current.city} value="" />
      </div>

      {/* Precio */}
      <div className="text-center mt-3 text-lg font-semibold">
        €{current.price.toLocaleString()}/mes
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between mt-2 mb-1 px-4">
        <button
          className="h-14 w-14 rounded-full grid place-items-center border-2 border-slate-500 hover:bg-slate-800 text-3xl"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await onSkip(current.id);
              nextCard();
            })
          }
        >
          ✖
        </button>
        <button
          className="h-14 w-14 rounded-full grid place-items-center bg-red-600 hover:bg-red-500 text-3xl"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await onLike(current.id);
              nextCard();
            })
          }
        >
          ❤
        </button>
      </div>
    </div>
  );
}

function Badge({ icon, label, value }: { icon?: string; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2 text-sm">
      {icon && <span className="opacity-80">{icon}</span>}
      <span className="text-slate-200">{label}</span>
      {value ? <span className="ml-auto text-slate-300">{value}</span> : null}
    </div>
  );
}