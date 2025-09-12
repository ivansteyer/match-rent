import Link from 'next/link';

export function DashboardCard({
  title, description, href, icon,
}: { title: string; description: string; href: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition p-5">
      <div className="flex items-center gap-3">
        <div className="text-xl">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-slate-400 mt-2 text-sm">{description}</p>
    </Link>
  );
}