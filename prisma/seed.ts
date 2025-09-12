// prisma/seed.ts
import { PrismaClient, Role, DocumentType, MatchStatus } from "@prisma/client";

const prisma = new PrismaClient();

const photosPool = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1507086182422-97bd7ca241ed",
  "https://images.unsplash.com/photo-1560185008-b033106af2cf",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
];

function pick(n: number) {
  const shuffled = [...photosPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const now = new Date();
// algunas fechas de disponibilidad de ejemplo
const availSoon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);   // +7 días
const availNextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 días

async function main() {
  // Limpieza en orden por FK
  await prisma.match.deleteMany();
  await prisma.document.deleteMany();
  await prisma.property.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.landlord.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken?.deleteMany?.().catch(() => {}); // por si existe

  // Usuarios base
  const [llUser1, llUser2, tnUser] = await Promise.all([
    prisma.user.create({
      data: { email: "landlord1@atc.local", name: "Laura Prop", role: Role.LANDLORD },
    }),
    prisma.user.create({
      data: { email: "landlord2@atc.local", name: "Miguel Rent", role: Role.LANDLORD },
    }),
    prisma.user.create({
      data: { email: "tenant1@atc.local", name: "Iván Tenant", role: Role.TENANT },
    }),
  ]);

  // Landlords y Tenant
  const [landlord1, landlord2] = await Promise.all([
    prisma.landlord.create({ data: { userId: llUser1.id } }),
    prisma.landlord.create({ data: { userId: llUser2.id } }),
  ]);

  const tenant1 = await prisma.tenant.create({
    data: {
      userId: tnUser.id,
      monthlyIncome: 2200,
      employment: "Contrato indefinido",
      hasPets: false,
      // el resto de campos del Tenant son opcionales según tu schema
    },
  });

  // Propiedades demo (coincide con tus títulos/ciudades/precios)
  const propsData: Array<{
    title: string;
    city: string;
    price: number;
    landlordId: string;
    available: Date;
    bedrooms?: number;
    terrace?: boolean | null;
    elevator?: boolean | null;
  }> = [
    { title: "Piso luminoso en Gràcia", city: "Barcelona", price: 1200, landlordId: landlord1.id, available: availSoon, bedrooms: 2, terrace: true, elevator: true },
    { title: "Estudio cerca de Sagrada Familia", city: "Barcelona", price: 980, landlordId: landlord1.id, available: now, bedrooms: 1, terrace: false, elevator: true },
    { title: "2 ambientes en Eixample", city: "Barcelona", price: 1350, landlordId: landlord1.id, available: availSoon, bedrooms: 2, terrace: false, elevator: true },
    { title: "Ático con terraza en Poblenou", city: "Barcelona", price: 1600, landlordId: landlord2.id, available: availNextMonth, bedrooms: 2, terrace: true, elevator: true },
    { title: "Loft moderno en Malasaña", city: "Madrid", price: 1100, landlordId: landlord2.id, available: now, bedrooms: 1, terrace: false, elevator: false },
    { title: "1 dormitorio en Lavapiés", city: "Madrid", price: 950, landlordId: landlord2.id, available: now, bedrooms: 1, terrace: false, elevator: false },
    { title: "Duplex en Chamberí", city: "Madrid", price: 1550, landlordId: landlord2.id, available: availSoon, bedrooms: 2, terrace: true, elevator: true },
    { title: "Céntrico en Ciutat Vella", city: "Valencia", price: 900, landlordId: landlord1.id, available: now, bedrooms: 1, terrace: false, elevator: false },
    { title: "A pasos del Turia", city: "Valencia", price: 1000, landlordId: landlord1.id, available: availSoon, bedrooms: 2, terrace: true, elevator: false },
    { title: "Cabañita urbana", city: "Barcelona", price: 875, landlordId: landlord1.id, available: now, bedrooms: 1, terrace: false, elevator: false },
    { title: "Piso familiar en Sants", city: "Barcelona", price: 1300, landlordId: landlord2.id, available: availNextMonth, bedrooms: 3, terrace: true, elevator: true },
    { title: "Estudio minimalista en Born", city: "Barcelona", price: 1050, landlordId: landlord2.id, available: now, bedrooms: 1, terrace: false, elevator: true },
  ];

  // Crear propiedades con relaciones (sin Unchecked) + photos JSON[] + available requerido
  await prisma.$transaction(async (tx) => {
    for (const p of propsData) {
      await tx.property.create({
        data: {
          title: p.title,
          city: p.city,
          price: p.price,
          bedrooms: p.bedrooms ?? 1,
          terrace: p.terrace ?? null,
          elevator: p.elevator ?? null,
          available: p.available, // <- requerido por tu schema
          photos: pick(3),        // Json? (array de URLs)
          landlord: { connect: { id: p.landlordId } },
        },
      });
    }
  });

  // Documentos del tenant (demo)
  await prisma.document.createMany({
    data: [
      { tenantId: tenant1.id, type: DocumentType.IDDOC, url: "https://example.com/docs/dni.pdf" },
      { tenantId: tenant1.id, type: DocumentType.PAYSLIP, url: "https://example.com/docs/nomina.pdf" },
    ],
  });

  // Likes iniciales para que “Mis matches” tenga contenido
  const sampleProps = await prisma.property.findMany({ take: 3, orderBy: { price: "asc" } });
  for (const prop of sampleProps) {
    await prisma.match.create({
      data: {
        tenantId: tenant1.id,
        propertyId: prop.id,
        status: MatchStatus.LIKED,
      },
    });
  }

  console.log("✅ Seed completado: users, landlords, tenant, properties, documents y matches demo.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
