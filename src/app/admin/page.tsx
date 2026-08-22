import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const [totalEvents, totalAttendees, totalUsers, finances] = await Promise.all([
    db.event.count({ where: { isActive: true } }),
    db.attendance.count(),
    db.user.count({ where: { role: 'ASISTENTE' } }),
    db.finance.findMany()
  ]);

  const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + Number(curr.amount), 0);

  const pendingExpenses = finances.filter(f => f.type === 'EXPENSE' && f.status === 'PENDING').slice(0, 5);

  return (
    <div className="space-y-12">
      <header className="border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-serif uppercase tracking-widest text-white">Dashboard General</h1>
        <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Resumen Financiero y Operativo</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Ingresos Totales</h3>
          <p className="text-3xl font-serif text-white mt-3">S/ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Egresos Totales</h3>
          <p className="text-3xl font-serif text-white mt-3">S/ {totalExpense.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] relative z-10">Eventos Activos</h3>
          <p className="text-3xl font-serif text-accent mt-3 relative z-10">{totalEvents}</p>
        </div>
        <div className="p-6 bg-transparent border border-neutral-800 hover:border-neutral-600 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-neutral-500 text-[10px] uppercase tracking-[0.2em]">Usuarios Registrados</h3>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-3xl font-serif text-white">{totalUsers}</p>
            <span className="text-neutral-500 text-xs mb-1">({totalAttendees} asistencias)</span>
          </div>
        </div>
      </div>

      {/* Charts / Tables sections placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-8 bg-transparent border border-neutral-800 min-h-[300px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-sm font-serif uppercase tracking-widest text-white mb-6">Mejores Promotores</h3>
          <div className="flex-1 flex items-center justify-center border border-neutral-900 bg-black/50">
            <span className="text-neutral-600 text-sm">No hay datos suficientes</span>
          </div>
        </div>
        
        <div className="p-8 bg-transparent border border-neutral-800 min-h-[300px] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-sm font-serif uppercase tracking-widest text-white mb-6">Cuentas por Pagar (Pendientes)</h3>
          {pendingExpenses.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border border-neutral-900 bg-black/50">
              <span className="text-neutral-600 text-sm">Todo al día</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-4 font-sans">
                {pendingExpenses.map(expense => (
                  <li key={expense.id} className="flex justify-between items-center pb-4 border-b border-neutral-900 last:border-0 last:pb-0">
                    <div>
                      <p className="text-white text-sm font-medium">{expense.category}</p>
                      <p className="text-xs text-neutral-500 mt-1">{expense.transactionDate.toISOString().split('T')[0]}</p>
                    </div>
                    <span className="text-accent font-bold">S/ {Number(expense.amount).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
