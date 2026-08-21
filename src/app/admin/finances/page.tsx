import { db } from '@/lib/db';
import Link from 'next/link';
import { PaymentStatus, Role } from '@prisma/client';
import { getFinances } from '@/actions/finance.actions';
import { BonusQuickFormClient } from './BonusQuickFormClient';

export default async function FinancesPage() {
  const finances = await getFinances();
  const events = await db.event.findMany({
    include: { finances: { where: { status: PaymentStatus.PAID } } },
    orderBy: { eventDate: 'desc' }
  });

  const promoters = await db.user.findMany({
    where: { role: Role.PROMOTOR, isActive: true },
    select: { id: true, firstName: true, lastName: true }
  });

  const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const bonuses = finances.filter(f => f.type === 'EXPENSE' && f.category === 'Bonos a Promotores');

  return (
    <div className="space-y-12">
      <header className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Finanzas</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Control de ingresos y egresos</p>
        </div>
        <Link 
          href="/admin/finances/categories" 
          className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
        >
          Configurar Categorías
        </Link>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Ingresos Registrados</h3>
          <p className="text-2xl font-serif text-green-400 mt-3">S/ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Egresos Registrados</h3>
          <p className="text-2xl font-serif text-red-500 mt-3">S/ {totalExpense.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${balance >= 0 ? 'bg-accent/5' : 'bg-red-500/5'}`} />
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] relative z-10">Ganancia Neta</h3>
          <p className={`text-2xl font-serif mt-3 relative z-10 ${balance >= 0 ? 'text-accent' : 'text-red-500'}`}>
            S/ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-12">
        
        {/* Table 1: Events */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif uppercase tracking-widest text-white">Balance por Eventos</h2>
          <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-neutral-400">
                <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 font-normal">Evento</th>
                    <th className="px-6 py-4 font-normal">Estado</th>
                    <th className="px-6 py-4 font-normal text-right">Ingresos</th>
                    <th className="px-6 py-4 font-normal text-right">Gastos</th>
                    <th className="px-6 py-4 font-normal text-right">Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-sm">No hay eventos registrados</td>
                    </tr>
                  ) : (
                    events.map(event => {
                      const inc = event.finances.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + Number(f.amount), 0);
                      const exp = event.finances.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + Number(f.amount), 0);
                      const net = inc - exp;
                      return (
                        <tr key={event.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                          <td className="px-6 py-4 font-medium text-white">
                            <Link href={`/admin/finances/events/${event.id}`} className="hover:text-accent hover:underline transition-colors flex items-center gap-2">
                              {event.title}
                              <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${event.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/30'}`}>
                              {event.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-green-400 font-mono">S/ {inc.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-red-500 font-mono">S/ {exp.toFixed(2)}</td>
                          <td className={`px-6 py-4 text-right font-bold font-mono ${net >= 0 ? 'text-accent' : 'text-red-500'}`}>S/ {net.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Table 2: Bonuses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif uppercase tracking-widest text-white">Sueldos y Bonos Pagados</h2>
              <BonusQuickFormClient promoters={promoters} />
            </div>
            <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="px-4 py-4 font-normal">Fecha</th>
                      <th className="px-4 py-4 font-normal">Promotor</th>
                      <th className="px-4 py-4 font-normal text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {bonuses.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-600 font-light text-sm">No hay bonos pagados</td></tr>
                    ) : (
                      bonuses.map(bonus => (
                        <tr key={bonus.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                          <td className="px-4 py-4 font-light text-sm text-neutral-300 whitespace-nowrap">{bonus.transactionDate.toISOString().split('T')[0]}</td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-white">
                              {bonus.description?.replace('Bono especial otorgado a ', '').replace('Pago de comisión a ', '') || 'Bono'}
                            </div>
                            <div className="text-xs text-accent uppercase tracking-widest mt-1">
                              {bonus.description?.includes('Pago de comisión') ? 'Sueldo / Comisión' : 'Bono Promotor'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right text-red-500 font-mono font-bold whitespace-nowrap">
                            -S/ {Number(bonus.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
