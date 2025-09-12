import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenido</h1>
      <p className="text-slate-300">MVP del sistema de match tipo Tinder para alquileres.</p>
      <div className="flex gap-3">
        <Link className="px-4 py-2 bg-blue-600 rounded" href="/tenant/dashboard">Ir al dashboard de inquilino</Link>
        <Link className="px-4 py-2 bg-slate-800 rounded" href="/landlord/dashboard">Ir al panel de propietario</Link>
      </div>
    </section>
  );
}
