import { getFinanceCategories, addFinanceCategory } from '@/actions/finance.actions';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await getFinanceCategories();

  const incomes = categories.filter(c => c.type === 'INCOME');
  const expenses = categories.filter(c => c.type === 'EXPENSE');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/finances" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.2em] mb-2 inline-block transition-colors">
            ← Volver a Finanzas
          </Link>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Categorías de Finanzas</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Define los gastos e ingresos frecuentes</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
        <div className="space-y-8">
          {/* Egresos */}
          <div className="space-y-4">
            <h2 className="text-sm font-serif uppercase tracking-widest text-red-500 border-b border-neutral-800 pb-2">Categorías de Gasto (-)</h2>
            <div className="flex flex-wrap gap-3">
              {expenses.length === 0 ? <p className="text-xs text-neutral-600">No hay categorías de gasto.</p> : null}
              {expenses.map(c => (
                <div key={c.id} className="px-4 py-2 bg-red-500/5 border border-red-500/20 text-neutral-300 text-xs tracking-widest uppercase rounded-full">
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Ingresos */}
          <div className="space-y-4">
            <h2 className="text-sm font-serif uppercase tracking-widest text-green-400 border-b border-neutral-800 pb-2">Categorías de Ingreso (+)</h2>
            <div className="flex flex-wrap gap-3">
              {incomes.length === 0 ? <p className="text-xs text-neutral-600">No hay categorías de ingreso.</p> : null}
              {incomes.map(c => (
                <div key={c.id} className="px-4 py-2 bg-green-500/5 border border-green-500/20 text-neutral-300 text-xs tracking-widest uppercase rounded-full">
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Añadir */}
        <form action={addFinanceCategory} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 space-y-6">
          <h2 className="text-lg font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Nueva Categoría</h2>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-green-500 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10">
                <input type="radio" name="type" value="INCOME" className="sr-only" required />
                <span className="text-xs font-medium text-white uppercase tracking-widest">Ingreso</span>
              </label>
              <label className="border border-neutral-800 p-3 text-center cursor-pointer hover:border-red-500 transition-colors has-[:checked]:border-red-500 has-[:checked]:bg-red-500/10">
                <input type="radio" name="type" value="EXPENSE" className="sr-only" defaultChecked required />
                <span className="text-xs font-medium text-white uppercase tracking-widest">Gasto</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Nombre de la Categoría</label>
            <input required type="text" name="name" placeholder="Ej: DJ, Alquiler, Luces..." className="w-full bg-transparent border-b border-neutral-800 px-0 py-2 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" />
          </div>

          <button type="submit" className="w-full py-4 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-[10px] uppercase mt-4">
            Añadir Categoría
          </button>
        </form>
      </div>
    </div>
  );
}
