import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import HomeCarousel from './HomeCarousel';

export default async function Home() {
  const session = await auth();
  
  const activeEvents = await db.event.findMany({
    where: { isActive: true },
    orderBy: { eventDate: 'asc' }
  });

  return (
    <main className="min-h-screen flex flex-col bg-black text-foreground relative overflow-hidden">
      {/* Luces de evento de fondo (Rojas Sexys) - Fijas para brillar en toda la página */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-700/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-accent/15 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-[-10%] left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-rose-700/15 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Header explícito */}
      <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-6 flex items-center bg-transparent">
        {/* Espacio izquierdo para balancear */}
        <div className="flex-1"></div>
        

        {/* Botones a la derecha */}
        <div className="flex gap-4 flex-1 justify-end">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link href={(session.user as any).role === 'ADMIN' ? '/admin' : (session.user as any).role === 'PROMOTOR' ? '/promoter' : '/user'} className="px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] text-xs uppercase">
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
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-5 py-2 bg-transparent text-white font-medium tracking-widest hover:text-accent transition-all hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.4)] text-xs uppercase">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="hidden sm:block px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] text-xs uppercase">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </header>
      {/* Sección Principal Dividida (Hero + Carrusel) */}
      <section className="relative w-full pt-32 sm:pt-40 pb-16 flex flex-col lg:flex-row items-center justify-between z-10 px-6 sm:px-12 max-w-[1400px] mx-auto gap-8 lg:gap-16">
        
        {/* Izquierda: Textos y Botón */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif uppercase tracking-widest text-white mb-6 drop-shadow-lg leading-tight">
            <span className="font-light tracking-[0.3em] text-xl md:text-2xl block mb-2 text-neutral-400">
              VIVE LA
            </span>
            <span className="text-accent">
              EXPERIENCIA
            </span>
          </h1>
          <p className="text-base md:text-lg text-neutral-400 max-w-md mb-10 font-light leading-relaxed">
            La lista de invitados más exclusiva de la ciudad. Acumula puntos en cada fiesta y canjéalos por tragos gratis y zonas VIP.
          </p>
          <div className="flex">
            <Link href="/login" className="w-full sm:w-auto px-8 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-sm uppercase">
              Unirme Ahora
            </Link>
          </div>
        </div>

        {/* Derecha: Carrusel de Eventos */}
        <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
          <HomeCarousel activeEvents={activeEvents.map(e => ({
            ...e,
            eventDate: e.eventDate.toISOString(),
            eventTime: e.eventTime.toISOString(),
            entryCost: Number(e.entryCost)
          }))} />
        </div>
      </section>

      {/* Sección de Información de Puntos */}
      <section className="w-full z-10 py-16 px-6 sm:px-12 relative bg-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif uppercase tracking-widest text-white drop-shadow-lg leading-none mb-6">
              <span className="font-light tracking-[0.3em] text-xl md:text-3xl block mb-1 text-neutral-400">
                RECOMPENSAS
              </span>
              <span className="text-accent">
                VIP
              </span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-light">
              Tu lealtad tiene premio. Sé parte del club, asiste a nuestros eventos y obtén beneficios exclusivos directamente en la barra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-transparent border border-neutral-800 p-8 text-center hover:border-accent hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all group duration-500">
              <div className="w-16 h-16 mx-auto bg-transparent border border-neutral-700 rounded-full flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-500">
                <svg className="w-6 h-6 text-neutral-400 group-hover:text-accent transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 20.646V21a2 2 0 01-2 2h-1a2 2 0 01-2-2v-.354c0-.422-.218-.82-.57-1.077l-3.39-2.455A2.99 2.99 0 015 14.697V14a2 2 0 012-2h10a2 2 0 012 2v.697c0 .927-.433 1.79-1.14 2.348l-3.39 2.455a1.36 1.36 0 00-.57 1.077z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10a4 4 0 100-8 4 4 0 000 8z" /></svg>
              </div>
              <h3 className="text-sm font-medium tracking-widest uppercase text-white mb-4 group-hover:text-accent transition-colors duration-500">1. Regístrate y Asiste</h3>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                Crea tu cuenta gratis, navega por nuestra cartelera de eventos exclusivos y dale clic a "Asistir".
              </p>
            </div>

            <div className="bg-transparent border border-neutral-800 p-8 text-center hover:border-accent hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all group duration-500">
              <div className="w-16 h-16 mx-auto bg-transparent border border-neutral-700 rounded-full flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-500">
                <svg className="w-6 h-6 text-neutral-400 group-hover:text-accent transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-sm font-medium tracking-widest uppercase text-white mb-4 group-hover:text-accent transition-colors duration-500">2. Escanea en Puerta</h3>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                Al llegar al evento, escanea el QR en la puerta o la barra para hacer check-in y acumular tus puntos automáticamente.
              </p>
            </div>

            <div className="bg-transparent border border-neutral-800 p-8 text-center hover:border-accent hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all group duration-500">
              <div className="w-16 h-16 mx-auto bg-transparent border border-neutral-700 rounded-full flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-500">
                <svg className="w-6 h-6 text-neutral-400 group-hover:text-accent transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" /></svg>
              </div>
              <h3 className="text-sm font-medium tracking-widest uppercase text-white mb-4 group-hover:text-accent transition-colors duration-500">3. Canjea Premios</h3>
              <p className="text-neutral-400 text-sm font-light leading-relaxed">
                Usa tus puntos acumulados para canjear entradas gratis, botellas en la zona VIP o tragos directos en la barra.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full text-center text-neutral-600 text-sm font-medium z-10 pb-8 bg-black" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} Discoteca. Todos los derechos reservados.
      </div>
    </main>
  );
}
