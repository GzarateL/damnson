'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EditProfileForm } from './EditProfileForm';

interface Props {
  user: any;
  futureEvents: any[];
}

export function UserDashboardClient({ user, futureEvents }: Props) {
  const [activeTab, setActiveTab] = useState<'PREMIOS' | 'SORTEOS' | 'EVENTOS' | 'PERFIL'>('PREMIOS');

  const tabs = [
    { id: 'PREMIOS', label: 'Premios Canjeados' },
    { id: 'SORTEOS', label: 'Sorteos Ganados' },
    { id: 'EVENTOS', label: 'Próximos Eventos' },
    { id: 'PERFIL', label: 'Editar Perfil' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8">
      
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-neutral-800 pb-8">
        <div>
          <Link href="/" className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-[0.2em] mb-6 inline-block transition-colors">
            ← Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest text-white">Mi Panel</h1>
          <p className="text-neutral-500 font-light text-sm tracking-[0.2em] uppercase mt-3">
            Bienvenido, {user.firstName}
          </p>
        </div>

        <div className="text-left md:text-right flex flex-col items-start md:items-end">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Mis Puntos Acumulados</span>
          <div className="text-6xl md:text-7xl font-black font-sans tracking-tighter text-accent drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            {user.points}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/rewards" className="px-5 py-2 bg-transparent border border-neutral-700 text-neutral-300 font-medium tracking-widest hover:border-white hover:text-white transition-colors text-[10px] uppercase">
              Ver Catálogo
            </Link>
            <form action={async () => {
              const { logoutAction } = await import('@/actions/auth.actions');
              await logoutAction();
            }}>
              <button 
                type="submit"
                title="Cerrar Sesión" 
                className="p-2 border border-neutral-800 text-neutral-500 hover:text-accent hover:border-accent hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
              activeTab === tab.id
                ? 'bg-accent/10 border-accent/50 text-accent shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 md:p-10 min-h-[400px]">
        
        {activeTab === 'PREMIOS' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4 mb-8">
              Historial de Premios
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user.rewardRedemptions.length === 0 ? (
                <div className="col-span-full text-center py-20 border border-dashed border-neutral-800 bg-neutral-900/10">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-light">
                    Aún no has canjeado ningún premio.
                  </p>
                  <Link href="/rewards" className="inline-block mt-4 text-[10px] text-accent uppercase tracking-widest hover:text-white transition-colors border border-accent/30 px-4 py-2">
                    Ir al Catálogo
                  </Link>
                </div>
              ) : (
                user.rewardRedemptions.map((r: any) => (
                  <div key={r.id} className="flex gap-6 border border-neutral-800 bg-neutral-900/30 p-5 hover:border-neutral-700 transition-colors">
                    {r.reward.imageUrl ? (
                      <div className="w-24 h-24 shrink-0 border border-neutral-700">
                        <img src={r.reward.imageUrl} alt={r.reward.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 shrink-0 border border-neutral-700 flex items-center justify-center text-4xl bg-black">
                        🎁
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-white font-bold text-lg truncate mb-1">{r.reward.name}</p>
                      <p className={`text-xs uppercase tracking-widest font-bold ${r.status === 'PENDING' ? 'text-accent' : 'text-green-500'}`}>
                        {r.status === 'PENDING' ? 'Pendiente' : 'Entregado'}
                      </p>
                      <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-3 border-t border-neutral-800/50 pt-2">
                        {new Date(r.redeemedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'SORTEOS' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4 mb-8">
              Sorteos Ganados
            </h2>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              {user.giveawaysWon.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-neutral-800 bg-neutral-900/10">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-light">
                    Aún no has ganado ningún sorteo. ¡Suerte en la próxima fiesta!
                  </p>
                </div>
              ) : (
                user.giveawaysWon.map((g: any) => (
                  <div key={g.id} className="flex items-center justify-between border border-neutral-800 bg-neutral-900/20 p-6 hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-6">
                      <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">🏆</span>
                      <div>
                        <p className="text-white font-bold text-lg tracking-wide">{g.title}</p>
                        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">
                          {new Date(g.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest border border-green-500/30 px-4 py-2 bg-green-500/10">
                      Entregado
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'EVENTOS' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4 mb-8">
              Tus Próximas Fiestas
            </h2>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              {futureEvents.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-neutral-800 bg-neutral-900/10">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-light">
                    No estás en lista para ningún evento próximo. <br/> Revisa la cartelera para anotarte.
                  </p>
                  <Link href="/events" className="inline-block mt-4 text-[10px] text-accent uppercase tracking-widest hover:text-white transition-colors border border-accent/30 px-4 py-2">
                    Ver Cartelera
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {futureEvents.map(a => {
                    const event = a.event;
                    return (
                      <div key={a.id} className="bg-[#0a0a0a] rounded-none border border-neutral-800 overflow-hidden flex flex-col group relative">
                        <div className="h-48 bg-neutral-900 relative flex items-center justify-center text-center overflow-hidden">
                          {event.flyerImageUrl ? (
                            <img src={event.flyerImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
                          )}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                          <h3 className="absolute inset-0 flex items-center justify-center z-10 text-xl font-black text-white uppercase italic tracking-widest drop-shadow-lg px-4">
                            {!event.flyerImageUrl && event.title}
                          </h3>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className="font-serif text-lg text-white uppercase tracking-widest leading-tight">{event.title}</h4>
                            <div className="shrink-0 px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] uppercase tracking-widest font-bold">
                              EN LISTA
                            </div>
                          </div>
                          
                          <div className="space-y-1 mt-4">
                            <p className="text-xs text-neutral-400 font-light tracking-widest uppercase">
                              {new Date(event.eventDate).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })} • {typeof event.eventTime === 'string' ? event.eventTime.substring(11, 16) : new Date(event.eventTime).toISOString().substring(11, 16)}
                            </p>
                            <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-widest font-light">
                              <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'PERFIL' && (
          <div className="animate-fade-in space-y-8 max-w-xl">
            <h2 className="text-2xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4 mb-8">
              Tus Datos
            </h2>
            <EditProfileForm user={{ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }} />
          </div>
        )}

      </div>
    </div>
  );
}
