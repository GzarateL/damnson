'use client';

import { useState } from 'react';
import { createGiveawayAction } from '@/actions/giveaway.actions';

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
}

interface Props {
  attendees: Participant[];
  promoters: Participant[];
}

export function GiveawayFormClient({ attendees, promoters }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<'ATTENDEES' | 'PROMOTERS'>('ATTENDEES');
  const [mode, setMode] = useState<'LIMPIO' | 'SUCIO'>('LIMPIO');
  const [loading, setLoading] = useState(false);

  const currentList = target === 'ATTENDEES' ? attendees : promoters;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createGiveawayAction(formData);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
      >
        Crear Nuevo Sorteo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-neutral-800 shadow-[0_0_50px_rgba(220,38,38,0.2)] p-8 max-w-lg w-full relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors text-sm"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif uppercase tracking-widest text-white mb-6 text-left border-b border-neutral-800 pb-2">Configurar Nuevo Sorteo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-3">
                <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500 text-left">
                  Título o Premio
                </label>
                <input 
                  required 
                  type="text" 
                  name="title"
                  placeholder="Ej: Botella de Red Label" 
                  className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans text-lg focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 text-left">Audiencia</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                    <input type="radio" name="targetAudience" value="ATTENDEES" className="sr-only" checked={target === 'ATTENDEES'} onChange={() => setTarget('ATTENDEES')} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Asistentes</span>
                  </label>
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                    <input type="radio" name="targetAudience" value="PROMOTERS" className="sr-only" checked={target === 'PROMOTERS'} onChange={() => setTarget('PROMOTERS')} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Promotores</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 text-left">Modo de Sorteo</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-green-500 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10">
                    <input type="radio" name="mode" value="LIMPIO" className="sr-only" checked={mode === 'LIMPIO'} onChange={() => setMode('LIMPIO')} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Limpio (Azar)</span>
                  </label>
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-red-500 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-500/10">
                    <input type="radio" name="mode" value="SUCIO" className="sr-only" checked={mode === 'SUCIO'} onChange={() => setMode('SUCIO')} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Armado (Sucio)</span>
                  </label>
                </div>
              </div>

              {mode === 'SUCIO' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-red-500 text-left">
                    Seleccionar Ganador Asegurado
                  </label>
                  <select 
                    required 
                    name="riggedWinnerId"
                    className="w-full bg-transparent border-b border-red-500/50 px-0 py-3 text-white font-sans focus:outline-none focus:border-red-500 transition-colors rounded-none"
                  >
                    <option value="" className="bg-black text-neutral-500">Selecciona quién ganará...</option>
                    {currentList.map(p => (
                      <option key={p.id} value={p.id} className="bg-black">{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-[10px] uppercase mt-4 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Sorteo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
