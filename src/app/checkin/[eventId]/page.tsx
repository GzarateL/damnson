import { getEventDetails, getActivePromoters } from '@/actions/checkin.actions';
import { db } from '@/lib/db';
import { CheckinForm } from './CheckinForm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function CheckinPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId);
  
  if (isNaN(eventId)) {
    notFound();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;

  const [event, promoters] = await Promise.all([
    getEventDetails(eventId),
    getActivePromoters()
  ]);

  let isAlreadyRegistered = false;
  if (isLoggedIn) {
    const existing = await db.attendance.findFirst({
      where: { eventId, attendeeId: parseInt(session.user.id) }
    });
    if (existing) isAlreadyRegistered = true;
  }

  if (!event || !event.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-foreground p-4">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Evento no disponible</h1>
          <p className="text-neutral-500 font-light">Este evento ya no está activo o no existe.</p>
          <Link href="/" className="inline-block mt-4 px-8 py-3 bg-transparent border border-neutral-600 text-white font-medium tracking-widest hover:border-white transition-all text-xs uppercase">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).toUpperCase();

  const formattedTime = new Date(event.eventTime).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <main className="min-h-screen flex flex-col bg-black text-foreground relative overflow-hidden">
      {/* Header flotante */}
      <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-6 flex items-center bg-transparent">

        <div className="w-full flex justify-start">
           <Link href="/" className="text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium">&larr; Volver</Link>
        </div>
      </header>

      {/* Ambient lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-700/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-accent/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-32 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center z-10 relative">
        
        {/* Flyer (Left) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
           <div className="relative w-full max-w-[320px] aspect-[2/3] bg-neutral-900 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
             {event.flyerImageUrl ? (
               <Image src={event.flyerImageUrl} alt={event.title} fill className="object-cover" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center">
                 <span className="text-neutral-700 font-serif tracking-widest">FLYER</span>
               </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
             <div className="absolute bottom-0 left-0 p-8 w-full text-left">
                <p className="text-accent font-medium tracking-[0.2em] text-[10px] mb-2 uppercase">{formattedDate}</p>
                <h1 className="text-3xl font-serif uppercase tracking-widest text-white leading-none mb-3">{event.title}</h1>
                <p className="text-neutral-400 font-light text-xs tracking-widest">{formattedTime}</p>
             </div>
           </div>
        </div>

        {/* Checkin Form (Right) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
           <div className="w-full max-w-md bg-transparent border border-neutral-800 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-serif uppercase tracking-widest text-white mb-3">
                 {isAlreadyRegistered ? 'Estás en lista' : 'Asistir al Evento'}
               </h2>
               <p className="text-neutral-400 font-light text-sm leading-relaxed">
                 {isAlreadyRegistered 
                   ? 'Ya has confirmado tu asistencia para este evento. ¡Te esperamos en la fiesta!'
                   : 'Confirma tu asistencia y apoya a tu promotor favorito.'}
               </p>
             </div>
             
             {isAlreadyRegistered ? (
               <div className="text-center space-y-6">
                 <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <Link href="/user" className="w-full inline-block py-4 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all text-sm uppercase">
                   Ir a mi panel
                 </Link>
               </div>
             ) : (
               <CheckinForm eventId={event.id} promoters={promoters} isLoggedIn={isLoggedIn} />
             )}
           </div>
        </div>

      </div>
    </main>
  );
}
