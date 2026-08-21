'use client';

import { useState } from 'react';
import { awardBonusAction } from '@/actions/promoter.actions';

interface Promoter {
  id: number;
  firstName: string;
  lastName: string;
}

export function BonusQuickFormClient({ promoters }: { promoters: Promoter[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [promoterId, setPromoterId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('PAGO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('promoterId', promoterId);
    formData.append('amount', amount);
    formData.append('paymentType', paymentType);

    try {
      const res = await awardBonusAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsOpen(false);
        setPromoterId('');
        setAmount('');
        setPaymentType('PAGO');
      }
    } catch (err) {
      setError('Ocurrió un error al registrar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
      >
        Registrar Pago Rápido
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-neutral-800 shadow-[0_0_50px_rgba(220,38,38,0.2)] p-8 max-w-sm w-full relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors text-sm"
              disabled={loading}
            >
              ✕
            </button>
            <h2 className="text-xl font-serif uppercase tracking-widest text-white mb-6 text-left border-b border-neutral-800 pb-2">Registrar Movimiento</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/5 border border-red-500 text-red-500 text-[10px] uppercase tracking-widest">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 text-left">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                    <input type="radio" name="paymentType" value="PAGO" className="sr-only" checked={paymentType === 'PAGO'} onChange={() => setPaymentType('PAGO')} disabled={loading} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Sueldo / Pago</span>
                  </label>
                  <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                    <input type="radio" name="paymentType" value="BONO" className="sr-only" checked={paymentType === 'BONO'} onChange={() => setPaymentType('BONO')} disabled={loading} required />
                    <span className="text-xs font-medium text-white uppercase tracking-widest">Bono</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500 text-left">
                  ¿Para quién es?
                </label>
                <select 
                  required 
                  value={promoterId}
                  onChange={(e) => setPromoterId(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none"
                  disabled={loading}
                >
                  <option value="" className="bg-black">Selecciona un promotor...</option>
                  {promoters.map(p => (
                    <option key={p.id} value={p.id} className="bg-black">{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500 text-left">
                  Monto a Pagar (S/)
                </label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 100.00" 
                  className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" 
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !amount || !promoterId}
                className="w-full py-4 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-[10px] uppercase mt-4 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Registrar Pago'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
