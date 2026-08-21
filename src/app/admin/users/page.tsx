import { getUsersByRole, deleteUser, toggleUserStatus, toggleQrStatus } from '@/actions/user.actions';
import Link from 'next/link';
import { Role } from '@prisma/client';

export default async function UsersPage() {
  const promoters = await getUsersByRole(Role.PROMOTOR);
  const admins = await getUsersByRole(Role.ADMIN);
  const asistentes = await getUsersByRole(Role.ASISTENTE);
  
  const allUsers = [...admins, ...promoters, ...asistentes];

  return (
    <div className="space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Usuarios</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Gestiona administradores, promotores y asistentes.</p>
        </div>
        <Link 
          href="/admin/users/new" 
          className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
        >
          Nuevo Usuario
        </Link>
      </header>

      <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-black/50 text-neutral-500 uppercase tracking-[0.2em] text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-normal">Nombre Completo</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Rol</th>
                <th className="px-6 py-4 font-normal">Estado</th>
                <th className="px-6 py-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-600 font-light text-sm">
                    No hay usuarios
                  </td>
                </tr>
              ) : (
                allUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-neutral-900/30 transition-colors font-sans">
                    <td className="px-6 py-4 font-medium text-white">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 font-light text-sm text-neutral-300">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-accent uppercase text-[10px] tracking-wider">{user.role}</td>
                    <td className="px-6 py-4 space-y-2">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          user.isActive ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
                        }`}>
                          {user.isActive ? 'Cuenta Activa' : 'Suspendida'}
                        </span>
                      </div>
                      {user.role === Role.PROMOTOR && (
                        <div>
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            user.isQrActive ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' : 'bg-neutral-500/10 border border-neutral-500/30 text-neutral-400'
                          }`}>
                            {user.isQrActive ? 'QR Activo' : 'QR Bloqueado'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {user.role === Role.PROMOTOR && (
                        <form action={async () => {
                          'use server';
                          await toggleQrStatus(user.id, user.isQrActive);
                        }} className="inline">
                          <button className="text-[10px] tracking-widest uppercase font-medium text-neutral-400 hover:text-blue-400 transition-colors">
                            {user.isQrActive ? 'Bloquear QR' : 'Activar QR'}
                          </button>
                        </form>
                      )}
                      <form action={async () => {
                        'use server';
                        await toggleUserStatus(user.id, user.isActive);
                      }} className="inline">
                        <button className="text-[10px] tracking-widest uppercase font-medium text-neutral-400 hover:text-white transition-colors">
                          {user.isActive ? 'Suspender' : 'Activar'}
                        </button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await deleteUser(user.id);
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
