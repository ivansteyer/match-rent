// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'A TU CASA',
  description: 'MVP de matching de alquileres',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur">
          <nav className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
            <Link href="/" className="font-bold tracking-wide">A TU CASA</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/tenant/dashboard">Inquilino</Link>
              <Link href="/landlord/dashboard">Propietario</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}