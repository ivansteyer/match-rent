// src/app/api/properties/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const QuerySchema = z.object({
  city: z.string().min(1).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    city: searchParams.get('city') ?? undefined,
    min: searchParams.get('min') ?? undefined,
    max: searchParams.get('max') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { city, min, max } = parsed.data;

  const where: any = {};
  if (city) where.city = city;
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = min;
    if (max) where.price.lte = max;
  }

  const data = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return NextResponse.json(data);
}
