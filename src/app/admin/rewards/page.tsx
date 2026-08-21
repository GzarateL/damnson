import { getRewards, deleteReward, toggleRewardStatus } from '@/actions/reward.actions';
import Link from 'next/link';

export default async function AdminRewardsPage() {
  const rewards = await getRewards();

  return (
    <div className="space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Catálogo de Premios</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Configura lo que los asistentes pueden canjear</p>
        </div>
        <Link 
          href="/admin/rewards/new" 
          className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
        >
          Nuevo Premio
        </Link>
      </header>

      <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-normal">Premio</th>
                <th className="px-6 py-4 font-normal">Descripción</th>
                <th className="px-6 py-4 font-normal">Costo (Puntos)</th>
                <th className="px-6 py-4 font-normal">Estado</th>
                <th className="px-6 py-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {rewards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-sm">
                    No hay premios configurados.
                  </td>
                </tr>
              ) : (
                rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {reward.imageUrl ? (
                        <div className="w-12 h-12 flex-shrink-0 bg-neutral-900 overflow-hidden border border-neutral-800">
                          <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex-shrink-0 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 text-[10px] uppercase">
                          No IMG
                        </div>
                      )}
                      <div className="font-medium text-white">{reward.name}</div>
                    </td>
                    <td className="px-6 py-4 font-light text-sm text-neutral-300 truncate max-w-[200px]">{reward.description}</td>
                    <td className="px-6 py-4 font-bold text-accent">{reward.pointsCost} pts</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        reward.isActive ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
                      }`}>
                        {reward.isActive ? 'Disponible' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <form action={async () => {
                        'use server';
                        await toggleRewardStatus(reward.id, reward.isActive);
                      }} className="inline">
                        <button className="text-[10px] tracking-widest uppercase font-medium text-neutral-400 hover:text-white transition-colors">
                          {reward.isActive ? 'Ocultar' : 'Activar'}
                        </button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await deleteReward(reward.id);
                      }} className="inline">
                        <button className="text-[10px] tracking-widest uppercase font-medium text-red-500 hover:text-red-400 transition-colors">
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
  );
}
