'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/actions/user.actions';

interface Props {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function EditProfileForm({ user }: Props) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={user.id} />
      
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-widest text-neutral-500">Correo Electrónico (Solo Lectura)</label>
        <input 
          type="email" 
          value={user.email} 
          disabled 
          className="w-full bg-neutral-900/50 border border-neutral-800 p-3 text-neutral-500 font-sans text-sm focus:outline-none rounded-none cursor-not-allowed" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="firstName" className="block text-[10px] uppercase tracking-widest text-neutral-500">Nombres</label>
        <input 
          required 
          type="text" 
          id="firstName" 
          name="firstName" 
          defaultValue={user.firstName}
          className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans text-sm focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-800" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="block text-[10px] uppercase tracking-widest text-neutral-500">Apellidos</label>
        <input 
          required 
          type="text" 
          id="lastName" 
          name="lastName" 
          defaultValue={user.lastName}
          className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans text-sm focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-800" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-neutral-500">Nueva Contraseña (Opcional)</label>
        <input 
          type="password" 
          id="password" 
          name="password"
          placeholder="Mínimo 8 caracteres..."
          className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans text-sm focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-800" 
        />
      </div>

      {state?.error && <p className="text-red-500 text-[10px] uppercase tracking-widest mt-2">{state.error}</p>}
      {state?.success && <p className="text-green-500 text-[10px] uppercase tracking-widest mt-2">{state.success}</p>}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3 bg-accent/10 border border-accent/30 text-accent font-bold tracking-[0.2em] hover:bg-accent hover:text-white transition-all text-[10px] uppercase mt-4 disabled:opacity-50"
      >
        {isPending ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
}
