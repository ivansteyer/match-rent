import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import FilterBar from './FilterBar';
import SwipeCard from './SwipeCard';
import { likeAction, skipAction } from './actions';

// Schema para validar los search params (?city=&min=&max=)
const QuerySchema = z.object({
  city: z.string().min(1).optional(),
  min: z.coerce.number().int().nonnegative().optional(),  // coerce: convierte "1000" -> 1000
  max: z.coerce.number().int().nonnegative().optional(),
});

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SwipePage({ searchParams }: PageProps) {
  // 1) Parseo y validación de los params
  const parsed = QuerySchema.safeParse({
    city: typeof searchParams?.city === 'string' && searchParams.city !== '' ? searchParams.city : undefined,
    min: typeof searchParams?.min === 'string' && searchParams.min !== '' ? searchParams.min : undefined,
    max: typeof searchParams?.max === 'string' && searchParams.max !== '' ? searchParams.max : undefined,
  });

  // Si no pasan la validación (ej: min negativo), ignoramos filtros de precio
  const filters = parsed.success ? parsed.data : { city: undefined, min: undefined, max: undefined };

  // 2) Armar condición "where" para Prisma
  const where: any = {};
  if (filters.city) where.city = filters.city;
  if (filters.min || filters.max) {
    where.price = {};
    if (filters.min) where.price.gte = filters.min;
    if (filters.max) where.price.lte = filters.max;
  }

  // 3) Conseguir ciudades disponibles (para el select)
  //    Nota: hacemos dedupe en JS para compatibilidad con SQLite.
  const allCitiesRows = await prisma.property.findMany({ select: { city: true } });
  const cities = Array.from(new Set(allCitiesRows.map(r => r.city))).sort();

  // 4) Traer propiedades filtradas
  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <section className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-semibold">Encuentra tu piso</h1>

      <FilterBar
        cities={cities}
        initial={{ city: filters.city, min: filters.min ?? null, max: filters.max ?? null }}
      />

      <div className="flex justify-center pt-2">
        <SwipeCard initial={properties as any} onLike={likeAction} onSkip={skipAction} />
      </div>
    </section>
  );
}