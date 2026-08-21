import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { BonusButtonClient } from './BonusButtonClient';

export default async function PromotersDashboardPage() {
  const promoters = await db.user.findMany({
    where: { role: Role.PROMOTOR },
    include: {
      _count: { select: { attendancesAsPromoter: true } },
      earnings: {
        where: { status: 'PAID' }
      }
    },
    orderBy: {
      attendancesAsPromoter: { _count: 'desc' }
    }
  });

  const bestPromoter = promoters.length > 0 && promoters[0]._count.attendancesAsPromoter > 0 ? promoters[0] : null;

  return (
    <div className="space-y-12">
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Rendimiento de Promotores</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Gestiona ventas, listas y bonos especiales</p>
        </div>
      </header>

      {/* Top Promoter Card */}
      {bestPromoter && (
        <div className="bg-transparent border border-accent shadow-[0_0_40px_rgba(220,38,38,0.15)] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="text-9xl font-serif">#1</span>
          </div>
          
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] text-accent font-light uppercase tracking-[0.3em]">Mejor Promotor</p>
            <h2 className="text-3xl font-serif uppercase tracking-widest text-white">{bestPromoter.firstName} {bestPromoter.lastName}</h2>
            <p className="text-sm text-neutral-400 font-sans mt-2">Liderando con <strong className="text-white">{bestPromoter._count.attendancesAsPromoter}</strong> invitados totales registrados.</p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <BonusButtonClient 
              promoterId={bestPromoter.id} 
              promoterName={`${bestPromoter.firstName} ${bestPromoter.lastName}`} 
              isTopPromoter={true} 
            />
          </div>
        </div>
      )}

      {/* Promoters Table */}
      <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-normal">Ranking</th>
                <th className="px-6 py-4 font-normal">Promotor</th>
                <th className="px-6 py-4 font-normal text-center">Invitados (Total)</th>
                <th className="px-6 py-4 font-normal text-right">Ganancias Pagadas</th>
                <th className="px-6 py-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {promoters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-[10px] uppercase tracking-widest">
                    No hay promotores registrados
                  </td>
                </tr>
              ) : (
                promoters.map((promoter, index) => {
                  const totalGanado = promoter.earnings.reduce((sum, e) => sum + Number(e.amount), 0);
                  
                  return (
                    <tr key={promoter.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                      <td className="px-6 py-4 font-serif text-lg text-neutral-500">
                        {index === 0 ? <span className="text-accent font-bold">#1</span> : `#${index + 1}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {promoter.firstName} {promoter.lastName}
                        {!promoter.isActive && <span className="ml-2 text-[8px] text-red-500 uppercase tracking-widest border border-red-500/30 px-2 py-0.5 rounded-full">Suspendido</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-white">{promoter._count.attendancesAsPromoter}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-mono">
                        S/ {totalGanado.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <BonusButtonClient 
                          promoterId={promoter.id} 
                          promoterName={`${promoter.firstName} ${promoter.lastName}`} 
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
