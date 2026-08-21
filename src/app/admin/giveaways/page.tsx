import { db } from '@/lib/db';
import { Role } from '@prisma/client';
import { GiveawayManagerClient } from './GiveawayManagerClient';
import { GiveawayFormClient } from './GiveawayFormClient';
import { toggleGiveawayStatusAction, deleteGiveawayAction, resetGiveawayAction } from '@/actions/giveaway.actions';

export default async function GiveawaysPage() {
  const users = await db.user.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true, role: true }
  });

  const attendees = users.filter(u => u.role === Role.ASISTENTE);
  const promoters = users.filter(u => u.role === Role.PROMOTOR);

  const giveaways = await db.giveaway.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      actualWinner: { select: { firstName: true, lastName: true } }
    }
  });

  return (
    <div className="space-y-12">
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Sorteos</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Crea y gestiona sorteos en vivo</p>
        </div>
        <GiveawayFormClient attendees={attendees} promoters={promoters} />
      </header>

      {/* Sorteos Creados */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif uppercase tracking-widest text-white">Sorteos Creados</h2>
        <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-normal">Sorteo</th>
                  <th className="px-6 py-4 font-normal text-center">Audiencia</th>
                  <th className="px-6 py-4 font-normal text-center">Modo (Oculto)</th>
                  <th className="px-6 py-4 font-normal text-center">Estado</th>
                  <th className="px-6 py-4 font-normal text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {giveaways.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-xs uppercase tracking-widest">
                      No hay sorteos creados
                    </td>
                  </tr>
                ) : (
                  giveaways.map(g => (
                    <tr key={g.id} className={`transition-colors font-sans ${g.isCompleted ? 'opacity-50' : 'hover:bg-neutral-900/30'}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{g.title}</div>
                        {g.isCompleted && g.actualWinner && (
                          <div className="text-xs text-accent mt-1 uppercase tracking-widest">
                            Ganador: {g.actualWinner.firstName} {g.actualWinner.lastName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-xs tracking-widest uppercase">
                        {g.targetAudience === 'ATTENDEES' ? 'Asistentes' : 'Promotores'}
                      </td>
                      <td className="px-6 py-4 text-center text-xs tracking-widest uppercase">
                        {g.mode === 'LIMPIO' ? (
                          <span className="text-green-500">Limpio</span>
                        ) : (
                          <span className="text-red-500 font-bold">Sucio</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <form action={toggleGiveawayStatusAction.bind(null, g.id, g.isActive)}>
                          <button type="submit" disabled={g.isCompleted} className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border transition-colors ${g.isActive ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:border-green-500' : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/30 hover:border-neutral-500'} disabled:opacity-50`}>
                            {g.isActive ? 'Activo' : 'Inactivo'}
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end items-center gap-4">
                        {!g.isCompleted && g.isActive && (
                          <GiveawayManagerClient 
                            giveawayId={g.id}
                            title={g.title}
                            mode={g.mode}
                            riggedWinnerId={g.riggedWinnerId}
                            participants={g.targetAudience === 'ATTENDEES' ? attendees : promoters}
                          />
                        )}
                        {g.isCompleted && (
                          <form action={resetGiveawayAction.bind(null, g.id)}>
                            <button type="submit" className="text-yellow-500 hover:text-yellow-400 transition-colors text-[10px] uppercase tracking-widest font-bold bg-yellow-500/10 px-3 py-2 rounded">
                              Repetir Sorteo
                            </button>
                          </form>
                        )}
                        <form action={deleteGiveawayAction.bind(null, g.id)}>
                          <button type="submit" className="text-neutral-600 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest px-2">
                            Eliminar
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

      {/* Tables removed by user request */}
    </div>
  );
}
