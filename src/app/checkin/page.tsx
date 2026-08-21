import { db } from '@/lib/db';
import Link from 'next/link';

export default async function CheckinSelectEventPage() {
  const activeEvents = await db.event.findMany({
    where: { isActive: true },
    orderBy: { eventDate: 'desc' }
  });

  return (
    <main className="min-h-screen flex flex-col items-center pt-20 p-4 sm:p-8 bg-background text-foreground relative overflow-hidden">
      <div className="z-10 w-full max-w-2xl text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Selecciona tu Evento</h1>
        <p className="text-neutral-400">Escanea el QR en la barra o selecciona tu evento de la lista para hacer Check-in.</p>
      </div>

      <div className="z-10 w-full max-w-2xl grid grid-cols-1 gap-4">
        {activeEvents.length === 0 ? (
          <div className="text-center p-8 border border-neutral-800 rounded-2xl bg-[#0a0a0a]">
            <p className="text-neutral-500">No hay eventos activos esta noche.</p>
          </div>
        ) : (
          activeEvents.map(event => (
            <Link 
              href={`/checkin/${event.id}`} 
              key={event.id}
              className="flex items-center justify-between p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-accent hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all group"
            >
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{event.title}</h2>
                <p className="text-sm text-neutral-500 mt-1">{event.eventDate.toISOString().split('T')[0]}</p>
              </div>
              <div className="text-accent">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </Link>
          ))
        )}
      </div>
      
      <Link href="/" className="mt-12 text-neutral-500 hover:text-white transition-colors z-10 font-medium">
        ← Volver al Inicio
      </Link>
    </main>
  );
}
