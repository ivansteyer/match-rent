// src/app/api/match/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const BodySchema = z.object({
  tenantId: z.string().cuid(),
  propertyId: z.string().cuid(),
  action: z.enum(['LIKE', 'DISLIKE']),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { tenantId, propertyId, action } = parsed.data;

  // En el futuro, obtendremos tenantId de la sesión (NextAuth). Por ahora es explícito.
  const status = action === 'LIKE' ? 'LIKED' : 'DISLIKED';

  const match = await prisma.match.upsert({
    where: { tenantId_propertyId: { tenantId, propertyId } },
    update: { status: status as any },
    create: { tenantId, propertyId, status: status as any },
  });

  return NextResponse.json(match, { status: 201 });
}
