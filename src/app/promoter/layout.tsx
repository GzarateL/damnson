import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PromoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-red-700/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-transparent border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col z-10 relative backdrop-blur-sm">
        <div className="p-8 text-center md:text-left">
          <Link href="/" className="inline-block text-xl font-black italic tracking-widest text-white drop-shadow-md">
            
          </Link>
          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mt-1">Panel Promotor</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/promoter" className="block px-6 py-3 text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-colors border-l-2 border-transparent hover:border-accent">
            Mis Ganancias
          </Link>
          <Link href="/promoter/events" className="block px-6 py-3 text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-colors border-l-2 border-transparent hover:border-accent">
            Mis Eventos
          </Link>
        </nav>
        <div className="p-6 mt-auto space-y-3">
          <Link href="/" className="w-full block px-4 py-3 text-[10px] text-center uppercase tracking-widest text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-600 bg-transparent">
            &larr; Volver a Inicio
          </Link>
          <form action={async () => {
            'use server';
            const { logoutAction } = await import('@/actions/auth.actions');
            await logoutAction();
          }}>
            <button type="submit" className="w-full block px-4 py-3 text-[10px] text-center uppercase tracking-widest text-accent hover:text-white transition-colors border border-accent/30 hover:border-accent hover:bg-accent hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-transparent">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10 relative">
        {children}
      </main>
    </div>
  );
}
