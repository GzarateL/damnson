import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';

export default async function PromoterDashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const promoterUser = await db.user.findUnique({
    where: { id: parseInt(session.user.id), isActive: true },
    include: {
      earnings: {
        orderBy: { createdAt: 'desc' },
        include: { event: { select: { title: true } } }
      },
      attendancesAsPromoter: {
        include: { event: { select: { title: true, eventDate: true } } }
      }
    }
  });

  if (!promoterUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-white">No hay promotores disponibles</h1>
        <p className="text-neutral-500">Por favor, pide al administrador que cree tu cuenta primero.</p>
      </div>
    );
  }

  const promoterId = promoterUser.id;

  // Cálculos de métricas
  const [earnings, attendances] = await Promise.all([
    db.promoterEarning.findMany({
      where: { promoterId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.attendance.findMany({
      where: { promoterId }
    })
  ]);

  const totalEarned = earnings.filter(e => e.status === 'PAID').reduce((sum, e) => sum + Number(e.amount), 0);
  const pendingPayment = earnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Separar asistentes de lista vs los que fueron a barra
  const listAttendees = attendances.filter(a => a.deviceFingerprint?.startsWith('MANUAL_')).length;
  const barAttendees = attendances.length - listAttendees;

  return (
    <div className="max-w-6xl space-y-12">
      <header className="border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Hola, {promoterUser?.firstName}</h1>
        <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Resumen de Rendimiento</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Ganancias Cobradas</h3>
          <p className="text-3xl font-serif text-white mt-3">S/ {totalEarned.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] relative z-10">Anotados en Lista</h3>
          <p className="text-3xl font-serif text-white mt-3 relative z-10">{listAttendees}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] relative z-10">Check-ins en Barra</h3>
          <p className="text-3xl font-serif text-accent mt-3 relative z-10">{barAttendees}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Historial de Ganancias */}
        <div className="p-8 bg-transparent border border-neutral-800 min-h-[300px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] max-h-[400px]">
          <h3 className="text-sm font-serif uppercase tracking-widest text-white mb-6">Historial de Ganancias</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {promoterUser.earnings.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-neutral-900 bg-black/50">
                <span className="text-neutral-600 text-sm">Sin bonos ni comisiones</span>
              </div>
            ) : (
              <ul className="space-y-4 font-sans">
                {promoterUser.earnings.map(earning => (
                  <li key={earning.id} className="flex items-center justify-between pb-4 border-b border-neutral-900 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {earning.type === 'BONUS_MOST_VOTED' ? 'Bono Promotor Estrella' : 'Comisión por Lista'}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">{earning.event?.title || 'General'}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-bold text-white">S/ {Number(earning.amount).toFixed(2)}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        earning.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {earning.status === 'PAID' ? 'Cobrado' : 'Por cobrar'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Últimos asistentes detectados */}
        <div className="p-8 bg-transparent border border-neutral-800 min-h-[300px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] max-h-[400px]">
          <h3 className="text-sm font-serif uppercase tracking-widest text-white mb-6">Asistentes Recientes (En Barra)</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {promoterUser.attendancesAsPromoter.length === 0 ? (
              <div className="h-full flex items-center justify-center border border-neutral-900 bg-black/50">
                <span className="text-neutral-600 text-sm">Nadie ha votado por ti aún</span>
              </div>
            ) : (
              <ul className="space-y-4 font-sans">
                {/* Mostramos solo los últimos 10 para no saturar */}
                {promoterUser.attendancesAsPromoter.slice(-10).reverse().map(att => (
                  <li key={att.id} className="flex items-center gap-4 pb-4 border-b border-neutral-900 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 bg-neutral-900/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{att.guestName || 'Invitado'}</p>
                      <p className="text-xs text-accent mt-1">{att.event.title}</p>
                    </div>
                    <div className="ml-auto text-[10px] text-neutral-600 tracking-widest">
                      {att.createdAt.toISOString().substring(11, 16)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
