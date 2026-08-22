import { createEvent } from '@/actions/event.actions';
import Link from 'next/link';

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Nuevo Evento</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Configura los detalles de la fiesta</p>
        </div>
        <Link href="/admin/events" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.2em] transition-colors border border-neutral-800 px-4 py-2 hover:border-neutral-600">
          Volver
        </Link>
      </header>

      <form action={createEvent} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 md:p-8 space-y-8">
        
        <div className="space-y-2">
          <label htmlFor="title" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Título del Evento</label>
          <input required type="text" id="title" name="title" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light" placeholder="Ej: Neón Party Viernes" />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Descripción (Opcional)</label>
          <textarea id="description" name="description" rows={3} className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light resize-none custom-scrollbar" placeholder="Detalles, DJs invitados, dress code..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="eventDate" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Fecha</label>
            <input required type="date" id="eventDate" name="eventDate" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light [color-scheme:dark]" />
          </div>
          <div className="space-y-2">
            <label htmlFor="eventTime" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Hora de Inicio</label>
            <input required type="time" id="eventTime" name="eventTime" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light [color-scheme:dark]" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Ubicación</label>
          <input required type="text" id="location" name="location" defaultValue="Local Principal" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800/50">
          <div className="space-y-2">
            <label htmlFor="entryCost" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Costo de Entrada (S/)</label>
            <input required type="number" step="0.01" min="0" id="entryCost" name="entryCost" defaultValue="0" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light font-mono text-xl" />
          </div>
          <div className="space-y-2">
            <label htmlFor="pointsReward" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Puntos por Asistir</label>
            <input required type="number" min="0" id="pointsReward" name="pointsReward" defaultValue="50" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-light font-mono text-xl text-accent" />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800/50">
          <label htmlFor="flyerImage" className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Imagen / Flyer (Opcional)</label>
          <input type="file" id="flyerImage" name="flyerImage" accept="image/*" className="w-full bg-black/50 border border-neutral-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer text-xs" />
        </div>

        <div className="flex items-center gap-4 pt-4 pb-4">
          <label className="relative flex cursor-pointer items-center rounded-full p-3" htmlFor="isActive" data-ripple-dark="true">
            <input type="checkbox" className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-sm border border-neutral-700 bg-black/50 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-accent checked:bg-accent checked:before:bg-accent hover:before:opacity-10" id="isActive" name="isActive" defaultChecked />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
          </label>
          <label htmlFor="isActive" className="text-xs uppercase tracking-widest text-neutral-400 cursor-pointer">Evento Activo (Visible al público)</label>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-accent/10 border border-accent/50 text-accent font-bold uppercase tracking-[0.2em] rounded-none px-4 py-4 hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-xs">
            Guardar Evento
          </button>
        </div>
      </form>
    </div>
  );
}
