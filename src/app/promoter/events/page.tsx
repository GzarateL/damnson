import { db } from '@/lib/db';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function PromoterEventsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const promoterId = parseInt(session.user.id);

  const activeEvents = await db.event.findMany({
    where: { isActive: true },
    orderBy: { eventDate: 'asc' }
  });

  return (
    <div className="max-w-6xl space-y-12">
      <header className="border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Eventos Activos</h1>
        <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Selecciona un evento para gestionar tu lista</p>
      </header>

      {activeEvents.length === 0 ? (
        <div className="p-12 border border-neutral-800 bg-transparent shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center">
          <p className="text-neutral-500 text-sm font-light uppercase tracking-widest">No hay eventos activos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEvents.map(event => (
            <div key={event.id} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col group relative overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="w-full aspect-[4/5] bg-black relative flex items-center justify-center text-center overflow-hidden border-b border-neutral-800">
                {event.flyerImageUrl ? (
                  <img src={event.flyerImageUrl} alt={event.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-neutral-900"></div>
                )}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors pointer-events-none"></div>
                <h3 className="absolute inset-0 flex items-center justify-center z-10 text-xl font-serif text-white uppercase tracking-widest px-4 pointer-events-none text-center">
                  {!event.flyerImageUrl && event.title}
                </h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="mb-6">
                  <p className="text-[10px] text-accent uppercase tracking-[0.2em]">{event.eventDate.toISOString().split('T')[0]}</p>
                  <p className="font-serif text-white tracking-widest uppercase mt-2">{event.title}</p>
                </div>

                <div className="mt-auto">
                  <Link href={`/promoter/events/${event.id}`} className="block w-full text-center py-3 bg-transparent border border-neutral-600 text-neutral-300 font-medium tracking-widest hover:border-accent hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase">
                    Gestionar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
