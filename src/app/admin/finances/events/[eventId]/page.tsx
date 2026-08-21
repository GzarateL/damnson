import { db } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PaymentStatus } from '@prisma/client';
import { deleteFinanceRecord, toggleFinanceStatus, addFinanceRecord, getFinanceCategories } from '@/actions/finance.actions';

import { EventFinanceFormClient } from './EventFinanceFormClient';

export default async function EventFinancePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId);
  
  if (isNaN(eventId)) notFound();

  const categories = await getFinanceCategories();

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      finances: {
        orderBy: { transactionDate: 'desc' }
      }
    }
  });

  if (!event) notFound();

  const paidFinances = event.finances.filter(f => f.status === PaymentStatus.PAID);
  const totalIncome = paidFinances.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = paidFinances.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const net = totalIncome - totalExpense;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/finances" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.2em] mb-2 inline-block transition-colors">
            ← Volver a Finanzas
          </Link>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">{event.title}</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Detalle Financiero del Evento</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Ingresos (Pagados)</h3>
          <p className="text-2xl font-serif text-green-400 mt-3">S/ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Gastos (Pagados)</h3>
          <p className="text-2xl font-serif text-red-500 mt-3">S/ {totalExpense.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${net >= 0 ? 'bg-accent/5' : 'bg-red-500/5'}`} />
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] relative z-10">Ganancia Neta del Evento</h3>
          <p className={`text-2xl font-serif mt-3 relative z-10 ${net >= 0 ? 'text-accent' : 'text-red-500'}`}>
            S/ {net.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
        {/* Formulario rápido */}
        <EventFinanceFormClient 
          eventId={event.id}
          eventDate={event.eventDate.toISOString().split('T')[0]}
          categories={categories}
        />

        {/* Tabla de movimientos del evento */}
        <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-normal">Fecha</th>
                  <th className="px-6 py-4 font-normal">Categoría</th>
                  <th className="px-6 py-4 font-normal text-right">Monto</th>
                  <th className="px-6 py-4 font-normal text-center">Estado</th>
                  <th className="px-6 py-4 font-normal text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {event.finances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-[10px] uppercase tracking-widest">
                      Sin movimientos registrados
                    </td>
                  </tr>
                ) : (
                  event.finances.map(record => (
                    <tr key={record.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                      <td className="px-6 py-4 font-light text-sm text-neutral-300">{record.transactionDate.toISOString().split('T')[0]}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{record.category}</div>
                        {record.description && <div className="text-xs text-neutral-500 mt-1">{record.description}</div>}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold font-mono ${record.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                        {record.type === 'INCOME' ? '+' : '-'}S/ {Number(record.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          record.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {record.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <form action={async () => {
                          'use server';
                          await toggleFinanceStatus(record.id, record.status);
                        }} className="inline">
                          <button className="text-[10px] tracking-widest uppercase font-medium text-neutral-400 hover:text-white transition-colors border border-neutral-700 px-3 py-1 hover:border-white">
                            {record.status === 'PAID' ? 'Pdte' : 'Pagado'}
                          </button>
                        </form>
                        <form action={async () => {
                          'use server';
                          await deleteFinanceRecord(record.id);
                        }} className="inline">
                          <button className="text-[10px] tracking-widest uppercase font-medium text-red-500 hover:text-red-400 transition-colors border border-red-500/30 px-3 py-1 hover:border-red-500 hover:bg-red-500/10">
                            X
                          </button>
                        </form>
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
  );
}
