import { getEvents, deleteEvent, toggleEventStatus } from '@/actions/event.actions';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Eventos</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Gestiona los eventos de la discoteca</p>
        </div>
        <Link 
          href="/admin/events/new" 
          className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
        >
          Crear Evento
        </Link>
      </header>

      <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-normal">Evento</th>
                <th className="px-6 py-4 font-normal">Fecha y Hora</th>
                <th className="px-6 py-4 font-normal">Costo</th>
                <th className="px-6 py-4 font-normal">Puntos</th>
                <th className="px-6 py-4 font-normal">Estado</th>
                <th className="px-6 py-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-600 font-light text-sm">
                    No hay eventos registrados
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                    <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                    <td className="px-6 py-4 font-light text-sm text-neutral-300">
                      {event.eventDate.toISOString().split('T')[0]} <br />
                      <span className="text-xs text-neutral-500">
                        {event.eventTime.toISOString().substring(11, 16)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-accent">S/ {Number(event.entryCost).toFixed(2)}</td>
                    <td className="px-6 py-4 text-white font-medium">+{event.pointsReward}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        event.isActive ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
                      }`}>
                        {event.isActive ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <form action={async () => {
                        'use server';
                        await toggleEventStatus(event.id, event.isActive);
                      }} className="inline">
                        <button className="text-[10px] tracking-widest uppercase font-medium text-neutral-400 hover:text-white transition-colors">
                          {event.isActive ? 'Ocultar' : 'Activar'}
                        </button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await deleteEvent(event.id);
                      }} className="inline">
                        <button className="text-[10px] tracking-widest uppercase font-medium text-red-500 hover:text-red-400 transition-colors">
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
