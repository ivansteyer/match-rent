import { prisma } from '@/lib/prisma';

export default async function MatchesPage() {
  const tenant = await prisma.tenant.findFirst({ select: { id: true } });
  const tenantId = tenant?.id;

  const likes = tenantId
    ? await prisma.match.findMany({
        where: { tenantId, status: 'LIKED' },
        include: { property: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Mis matches (LIKED)</h1>
      {likes.length === 0 ? (
        <p className="text-slate-300">Aún no tienes likes.</p>
      ) : (
        <ul className="space-y-2">
          {likes.map((m) => (
            <li key={m.id} className="rounded-lg border border-slate-800 p-3">
              <div className="font-semibold">{m.property.title}</div>
              <div className="text-sm text-slate-400">
                {m.property.city} · €{m.property.price}/mes
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}