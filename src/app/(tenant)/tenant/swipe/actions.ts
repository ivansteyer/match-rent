'use server';
import { prisma } from '@/lib/prisma';

// TODO: reemplazar por sesión real si ya integraste NextAuth
async function getDemoTenantId() {
  const t = await prisma.tenant.findFirst({ select: { id: true } });
  if (!t) throw new Error('No hay tenants (corre el seed).');
  return t.id;
}

export async function likeAction(propertyId: string) {
  const tenantId = await getDemoTenantId();
  await prisma.match.upsert({
    where: { tenantId_propertyId: { tenantId, propertyId } },
    update: { status: 'LIKED' },
    create: { tenantId, propertyId, status: 'LIKED' },
  });
}

export async function skipAction(propertyId: string) {
  const tenantId = await getDemoTenantId();
  await prisma.match.upsert({
    where: { tenantId_propertyId: { tenantId, propertyId } },
    update: { status: 'DISLIKED' },
    create: { tenantId, propertyId, status: 'DISLIKED' },
  });
}