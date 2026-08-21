'use client';

import { useEffect, useState, useActionState } from 'react';
import { submitCheckin } from '@/actions/checkin.actions';
import Link from 'next/link';

export function CheckinForm({ eventId, promoters, isLoggedIn }: { eventId: number, promoters: any[], isLoggedIn: boolean }) {
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [state, formAction, isPending] = useActionState(submitCheckin, null);

  useEffect(() => {
    // Generar un ID único básico para el dispositivo si no existe en localStorage
    let fingerprint = localStorage.getItem('device_fingerprint');
    if (!fingerprint) {
      fingerprint = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('device_fingerprint', fingerprint);
    }
    setDeviceFingerprint(fingerprint);
  }, []);

  if (state?.success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-10">
        <div className="w-16 h-16 border border-accent text-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-xl font-serif uppercase tracking-widest text-white">Asistencia Confirmada</h2>
        <p className="text-neutral-400 font-light text-sm">{state.message}</p>
        <Link href="/" className="inline-block mt-8 px-8 py-3 bg-transparent border border-neutral-600 text-white font-medium tracking-widest hover:border-white transition-all text-xs uppercase">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Aviso de Recompensas (Solo si no está logueado) */}
      {!isLoggedIn && (
        <div className="p-5 border border-neutral-800 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h3 className="text-white font-medium tracking-widest uppercase text-xs mb-3 relative z-10">Programa de Lealtad</h3>
          <p className="text-sm text-neutral-400 font-light mb-4 relative z-10">
            Inicia sesión para acumular puntos por tu asistencia y canjear bebidas en la barra.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <Link href="/login" className="px-5 py-2 bg-transparent text-white font-medium tracking-widest border border-neutral-700 hover:border-white transition-all text-[10px] uppercase">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="px-5 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] text-[10px] uppercase">
              Crear Cuenta
            </Link>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="deviceFingerprint" value={deviceFingerprint} />
        
        {state?.message && !state.success && (
          <div className="p-4 border border-accent/50 text-accent text-center text-sm font-light tracking-wide">
            {state.message}
          </div>
        )}

        {!isLoggedIn && (
          <div className="space-y-4">
            <label htmlFor="guestName" className="block font-medium tracking-widest uppercase text-white text-xs text-center">
              Tu Nombre (Como Invitado)
            </label>
            <input 
              type="text" 
              id="guestName"
              name="guestName"
              required
              placeholder="Escribe tu nombre y apellido"
              className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light"
            />
          </div>
        )}

        <div className="space-y-4">
          <label htmlFor="promoterId" className="block font-medium tracking-widest uppercase text-white text-xs text-center">
            Promotor Invitado
          </label>
          <div className="relative">
            <select 
              required 
              id="promoterId" 
              name="promoterId" 
              className="w-full bg-transparent border-b border-neutral-800 px-4 py-3 text-white focus:outline-none focus:border-accent transition-all text-center text-sm appearance-none font-light cursor-pointer"
            >
              <option value="" className="bg-black text-neutral-500">SELECCIONA UN PROMOTOR</option>
              {promoters.map(p => (
                <option key={p.id} value={p.id} className="bg-black text-white">{p.firstName.toUpperCase()} {p.lastName.toUpperCase()}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] px-4 py-4 text-sm uppercase disabled:opacity-50"
          >
            {isPending ? 'PROCESANDO...' : 'CONFIRMAR ASISTENCIA'}
          </button>

          <p className="text-[10px] text-neutral-500 text-center font-light uppercase tracking-widest">
            Al continuar como invitado, no acumularás puntos VIP.
          </p>
        </div>
      </form>
    </div>
  );
}
