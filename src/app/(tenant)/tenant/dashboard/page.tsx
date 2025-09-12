import { DashboardCard } from '@/components/DashboardCard';

export default function TenantDashboard() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Panel del inquilino</h1>
      <p className="text-slate-300">Completa tu perfil y empieza a hacer match con pisos.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Encuentra tu piso" description="Swipe tipo Tinder" href="/tenant/swipe" />
        <DashboardCard title="Mis matches" description="Pisos que te gustaron" href="/tenant/matches" />
        <DashboardCard title="Chat" description="Habla con propietarios" href="/tenant/matches" />
        <DashboardCard title="Subir documentos" description="DNI, nóminas, contrato" href="/tenant/docs" />
      </div>
    </section>
  );
}