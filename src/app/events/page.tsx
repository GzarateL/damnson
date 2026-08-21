import { db } from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function PublicEventsPage() {
  const session = await auth();
  
  const activeEvents = await db.event.findMany({
    where: { isActive: true },
    orderBy: { eventDate: 'asc' } // Show upcoming events first
  });

  return (
    <main className="min-h-screen bg-background text-foreground pb-12">
      {/* Header Público */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-end">
          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link href={(session.user as any).role === 'ADMIN' ? '/admin' : (session.user as any).role === 'PROMOTOR' ? '/promoter' : '/user'} className="px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] text-[10px] uppercase">
                  Mi Panel
                </Link>
                <form action={async () => {
                  'use server';
                  const { logoutAction } = await import('@/actions/auth.actions');
                  await logoutAction();
                }}>
                  <button title="Cerrar Sesión" className="p-2 border border-neutral-800 text-neutral-500 hover:text-accent hover:border-accent hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors py-2">Ingresar</Link>
                <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Próximos Eventos</h1>
          <p className="text-lg text-neutral-400">Descubre las mejores fiestas de la ciudad. Asiste y acumula puntos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEvents.length === 0 ? (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
              <p className="text-neutral-500">No hay eventos programados en este momento. ¡Vuelve pronto!</p>
            </div>
          ) : (
            activeEvents.map(event => (
              <div key={event.id} className="bg-[#0a0a0a] rounded-none border border-neutral-800 overflow-hidden flex flex-col group relative">
                <div className="h-56 bg-neutral-900 relative flex items-center justify-center text-center overflow-hidden">
                  {event.flyerImageUrl ? (
                    <img src={event.flyerImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <h3 className="absolute inset-0 flex items-center justify-center z-10 text-3xl font-black text-white uppercase italic tracking-widest drop-shadow-lg px-4">
                    {!event.flyerImageUrl && event.title}
                  </h3>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-neutral-400">
                        {event.eventDate.toISOString().split('T')[0]} • {event.eventTime.toISOString().substring(11, 16)}
                      </p>
                      <p className="font-bold text-white mt-1">Entrada: S/ {Number(event.entryCost).toFixed(2)}</p>
                    </div>
                    <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded">
                      +{event.pointsReward} pts
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-400 flex-1">{event.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-widest font-light">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {event.location}
                    </div>
                    
                    <Link 
                      href={`/checkin/${event.id}`}
                      className="w-full py-3 bg-accent/10 border border-accent/30 text-accent font-bold tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] text-[10px] uppercase text-center"
                    >
                      Anotarse en Lista
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
