import { prisma } from '@/lib/prisma';
import SwipeCard from '@/app/tenant/swipe/SwipeCard';

// ⚠️ En producción, el tenantId viene de la sesión (NextAuth).
// Para el MVP, usamos "el primer tenant" como usuario demo.
async function getDemoTenantId() {
  const t = await prisma.tenant.findFirst({ select: { id: true } });
  if (!t) throw new Error('No hay tenants en la DB. ¿Corriste el seed?');
  return t.id;
}

// --- Server Actions ---
export async function likeAction(propertyId: string) {
  'use server';
  const tenantId = await getDemoTenantId();

  await prisma.match.upsert({
    where: { tenantId_propertyId: { tenantId, propertyId } },
    update: { status: 'LIKED' },
    create: { tenantId, propertyId, status: 'LIKED' },
  });
}

export async function skipAction(propertyId: string) {
  'use server';
  const tenantId = await getDemoTenantId();

  await prisma.match.upsert({
    where: { tenantId_propertyId: { tenantId, propertyId } },
    update: { status: 'DISLIKED' },
    create: { tenantId, propertyId, status: 'DISLIKED' },
  });
}

// --- Page (Server Component) ---
export default async function FindPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    take: 24,
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Encuentra tu piso</h1>
      <p className="text-slate-300">Haz Like o Skip. (Luego afinamos filtros, ciudad y rango de precio.)</p>

      <SwipeClient
        initial={properties as any}
        onLike={likeAction}
        onSkip={skipAction}
      />
    </section>
  );
}