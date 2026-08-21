'use client';

import { useState } from 'react';
import { addFinanceRecord } from '@/actions/finance.actions';
import { FinanceCategory } from '@prisma/client';

interface Props {
  eventId: number;
  eventDate: string;
  categories: FinanceCategory[];
}

export function EventFinanceFormClient({ eventId, eventDate, categories }: Props) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  
  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <form action={addFinanceRecord} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 space-y-6">
      <h2 className="text-lg font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Añadir Registro</h2>
      
      <input type="hidden" name="eventId" value={eventId} />
      
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Tipo de Movimiento</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-green-500 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10">
            <input type="radio" name="type" value="INCOME" className="sr-only" checked={type === 'INCOME'} onChange={() => setType('INCOME')} required />
            <span className="text-xs font-medium text-white uppercase tracking-widest">Ingreso</span>
          </label>
          <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-red-500 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-500/10">
            <input type="radio" name="type" value="EXPENSE" className="sr-only" checked={type === 'EXPENSE'} onChange={() => setType('EXPENSE')} required />
            <span className="text-xs font-medium text-white uppercase tracking-widest">Gasto</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Categoría</label>
        {filteredCategories.length > 0 ? (
          <select required name="category" className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none">
            <option value="" className="bg-black">Selecciona una categoría...</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.name} className="bg-black">{c.name}</option>
            ))}
          </select>
        ) : (
          <div className="text-xs text-yellow-500 border border-yellow-500/30 p-2">
            No hay categorías de {type === 'INCOME' ? 'ingreso' : 'gasto'} creadas. Ve a Finanzas para crearlas.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Descripción (Opcional)</label>
        <input type="text" name="description" placeholder="Ej: Pago de segunda mitad..." className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Monto (S/)</label>
        <input required type="number" step="0.01" min="0.01" name="amount" placeholder="0.00" className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Estado de Pago</label>
        <select required name="status" className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none">
          <option value="PAID" className="bg-black">Pagado</option>
          <option value="PENDING" className="bg-black">Pendiente</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Fecha del Movimiento</label>
        <input required type="date" name="transactionDate" defaultValue={eventDate} className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none" />
      </div>

      <button type="submit" disabled={filteredCategories.length === 0} className="w-full py-4 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-[10px] uppercase mt-4 disabled:opacity-50">
        Registrar Movimiento
      </button>
    </form>
  );
}
