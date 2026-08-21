import { db } from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function RewardsCatalogPage() {
  const session = await auth();
  
  // Si está logueado como asistente, obtenemos sus puntos reales
  let myPoints = 0;
  let isLoggedIn = false;

  if (session?.user?.id) {
    isLoggedIn = true;
    const userDb = await db.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { points: true }
    });
    if (userDb) myPoints = userDb.points;
  }

  const activeRewards = await db.reward.findMany({
    where: { isActive: true },
    orderBy: { pointsCost: 'asc' }
  });

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Público */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-end">
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                  <span className="text-neutral-400 text-[10px] uppercase tracking-widest">Mis Puntos:</span>
                  <span className="text-accent font-bold">{myPoints}</span>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <Link href="/user" className="px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] text-[10px] uppercase">
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
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="px-5 py-2 bg-transparent text-white font-medium tracking-widest hover:text-accent transition-all text-xs uppercase">Ingresar</Link>
                <Link href="/register" className="px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all text-xs uppercase">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest text-white drop-shadow-md">
            Catálogo de <span className="text-accent">Premios</span>
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] font-light leading-relaxed">
            Canjea los puntos que has acumulado asistiendo a nuestras fiestas por bebidas y beneficios exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeRewards.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-neutral-800 bg-neutral-900/10">
              <p className="text-neutral-500 text-xs uppercase tracking-widest font-light">Pronto añadiremos premios al catálogo. ¡Sigue acumulando puntos!</p>
            </div>
          ) : (
            activeRewards.map(reward => {
              const canAfford = myPoints >= reward.pointsCost;

              return (
                <div key={reward.id} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group relative">
                  {/* Etiqueta de Precio */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-accent/50 text-accent font-bold px-3 py-1 text-[10px] uppercase tracking-widest z-10 flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    ★ {reward.pointsCost} PTS
                  </div>

                  <div className="h-56 bg-neutral-900 relative flex items-center justify-center overflow-hidden border-b border-neutral-800">
                    {reward.imageUrl ? (
                      <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 group-hover:text-accent transition-all duration-700 drop-shadow-2xl grayscale opacity-50">🎁</span>
                    )}
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif uppercase tracking-widest text-white mb-3">{reward.name}</h3>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed flex-1">{reward.description}</p>
                    
                    <button 
                      disabled={!canAfford}
                      className={`w-full mt-8 py-4 font-bold tracking-[0.2em] transition-all text-[10px] uppercase ${
                        canAfford 
                          ? 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Canjear Premio' : 'Puntos Insuficientes'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
