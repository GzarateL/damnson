import { createUser } from '@/actions/user.actions';
import Link from 'next/link';

export default function NewUserPage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Nuevo Usuario</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Crea cuentas de equipo o asistentes</p>
        </div>
        <Link href="/admin/users" className="px-6 py-3 bg-transparent border border-neutral-600 text-neutral-400 font-medium tracking-widest hover:border-white hover:text-white transition-all text-[10px] uppercase inline-flex items-center justify-center">
          Volver a Usuarios
        </Link>
      </header>

      <form action={createUser} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 space-y-6">
        
        <div className="space-y-3">
          <label htmlFor="role" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Rol del Usuario</label>
          <select required id="role" name="role" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700">
            <option value="PROMOTOR" className="bg-black text-white">Promotor (Ventas y Lista)</option>
            <option value="ADMIN" className="bg-black text-white">Administrador (Acceso Total)</option>
            <option value="ASISTENTE" className="bg-black text-white">Asistente (Cliente)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label htmlFor="firstName" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Nombre</label>
          <input required type="text" id="firstName" name="firstName" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
        </div>

        <div className="space-y-3">
          <label htmlFor="lastName" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Apellido</label>
          <input required type="text" id="lastName" name="lastName" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
        </div>

        <div className="space-y-3">
          <label htmlFor="email" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Correo Electrónico</label>
          <input required type="email" id="email" name="email" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
        </div>

        <div className="space-y-3">
          <label htmlFor="password" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Contraseña Provisional</label>
          <input required type="text" id="password" name="password" defaultValue="Temporal123!" className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
        </div>

        <div className="pt-8">
          <button type="submit" className="w-full py-4 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase">
            Crear Cuenta
          </button>
        </div>
      </form>
    </div>
  );
}
