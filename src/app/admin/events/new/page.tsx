import { createEvent } from '@/actions/event.actions';
import Link from 'next/link';

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/admin/events" className="text-neutral-400 hover:text-white transition-colors">
          ← Volver
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nuevo Evento</h1>
          <p className="text-neutral-400 mt-1">Configura los detalles de la fiesta</p>
        </div>
      </header>

      <form action={createEvent} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
        
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-neutral-300">Título del Evento</label>
          <input required type="text" id="title" name="title" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Ej: Neón Party Viernes" />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Descripción (Opcional)</label>
          <textarea id="description" name="description" rows={3} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="Detalles, DJs invitados, dress code..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="eventDate" className="block text-sm font-medium text-neutral-300">Fecha</label>
            <input required type="date" id="eventDate" name="eventDate" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [color-scheme:dark]" />
          </div>
          <div className="space-y-2">
            <label htmlFor="eventTime" className="block text-sm font-medium text-neutral-300">Hora de Inicio</label>
            <input required type="time" id="eventTime" name="eventTime" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [color-scheme:dark]" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-neutral-300">Ubicación</label>
          <input required type="text" id="location" name="location" defaultValue="Local Principal" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="entryCost" className="block text-sm font-medium text-neutral-300">Costo de Entrada (S/)</label>
            <input required type="number" step="0.01" min="0" id="entryCost" name="entryCost" defaultValue="0" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="pointsReward" className="block text-sm font-medium text-neutral-300">Puntos por Asistir</label>
            <input required type="number" min="0" id="pointsReward" name="pointsReward" defaultValue="50" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="flyerImage" className="block text-sm font-medium text-neutral-300">Imagen / Flyer (Opcional)</label>
          <input type="file" id="flyerImage" name="flyerImage" accept="image/*" className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-bold file:bg-accent file:text-white hover:file:bg-accent/80" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="isActive" name="isActive" defaultChecked className="w-5 h-5 accent-accent bg-neutral-900 border-neutral-800 rounded-none" />
          <label htmlFor="isActive" className="text-sm font-medium text-neutral-300">Evento Activo (Visible al público)</label>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-accent text-white font-medium rounded-none px-4 py-3 hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20">
            Guardar Evento
          </button>
        </div>
      </form>
    </div>
  );
}
