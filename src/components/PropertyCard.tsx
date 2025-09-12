// src/components/PropertyCard.tsx
type Property = {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number;
  photos: unknown; // JSON en SQLite
};

export function PropertyCard({ p }: { p: Property }) {
  const photos = Array.isArray(p.photos) ? (p.photos as string[]) : [];
  const cover = photos[0] ?? 'https://images.unsplash.com/photo-1505691938895-1758d7feb511';

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
      <img src={cover} alt={p.title} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="font-semibold">{p.title}</h3>
        <p className="text-sm text-slate-400">{p.city} · €{p.price}/mes</p>
        <p className="text-sm text-slate-300 line-clamp-2">{p.description}</p>
      </div>
    </div>
  );
}
