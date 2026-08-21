import { createReward } from '@/actions/reward.actions';
import Link from 'next/link';

export default function NewRewardPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="border-b border-neutral-800 pb-6">
        <Link href="/admin/rewards" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.2em] mb-2 inline-block transition-colors">
          ← Volver al Catálogo
        </Link>
        <h1 className="text-3xl font-serif uppercase tracking-widest text-white mt-2">Nuevo Premio</h1>
        <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Añade recompensas para tus asistentes</p>
      </header>

      <form action={createReward} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 md:p-10 space-y-8">
        
        <div className="space-y-3">
          <label htmlFor="name" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Nombre del Premio</label>
          <input required type="text" id="name" name="name" placeholder="Ej: Botella de Tequila, Entrada VIP..." className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-800" />
        </div>

        <div className="space-y-3">
          <label htmlFor="description" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Descripción (Opcional)</label>
          <textarea id="description" name="description" rows={3} className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-800" placeholder="Detalles de lo que incluye..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="pointsCost" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Costo en Puntos</label>
            <input required type="number" min="1" id="pointsCost" name="pointsCost" defaultValue="100" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-accent font-mono text-2xl focus:outline-none focus:border-accent transition-colors rounded-none" />
          </div>

          <div className="space-y-3">
            <label htmlFor="image" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Imagen del Premio</label>
            <input type="file" id="image" name="image" accept="image/*" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans text-sm focus:outline-none focus:border-accent transition-colors rounded-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 file:cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
          <input type="checkbox" id="isActive" name="isActive" defaultChecked className="w-5 h-5 accent-accent bg-transparent border-neutral-800 rounded-none cursor-pointer" />
          <label htmlFor="isActive" className="text-xs font-medium text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Disponible en el catálogo público</label>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full py-4 bg-accent text-white font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] text-sm uppercase">
            Añadir Premio
          </button>
        </div>
      </form>
    </div>
  );
}
