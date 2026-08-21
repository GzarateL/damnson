'use client';

import { useState } from 'react';
import { awardBonusAction } from '@/actions/promoter.actions';

interface Props {
  promoterId: number;
  promoterName: string;
  isTopPromoter?: boolean;
}

export function BonusButtonClient({ promoterId, promoterName, isTopPromoter = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('promoterId', promoterId.toString());
    formData.append('amount', amount);

    try {
      const res = await awardBonusAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsOpen(false);
        setAmount('');
      }
    } catch (err) {
      setError('Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          isTopPromoter 
            ? "px-8 py-4 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] text-xs uppercase"
            : "text-[10px] tracking-widest uppercase font-medium text-accent hover:text-white transition-colors border border-accent px-4 py-2 hover:bg-accent"
        }
      >
        {isTopPromoter ? 'Otorgar Bono Especial' : 'Dar Bono'}
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
            <h2 className="text-xl font-serif uppercase tracking-widest text-white mb-2 text-left">Bono Especial</h2>
            <p className="text-[10px] text-neutral-500 font-light tracking-[0.1em] uppercase mb-8 text-left">
              Para: <strong className="text-white">{promoterName}</strong>
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/5 border border-red-500 text-red-500 text-[10px] uppercase tracking-widest">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <label htmlFor="amount" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500 text-left">
                  Monto a Otorgar (S/)
                </label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  id="amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 50.00" 
                  className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans text-xl focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" 
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !amount}
                className="w-full py-4 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent disabled:hover:shadow-none"
              >
                {loading ? 'Procesando...' : 'Confirmar Bono'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
