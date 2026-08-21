'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { addGuestAction } from '@/actions/promoter.actions';

export function EventManagerClient({ event, promoterUser, initialGuests, errorMsg }: any) {
  const router = useRouter();
  const [guestName, setGuestName] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const displayGuest = selectedGuest || guestName || 'TU NOMBRE AQUÍ';

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    
    try {
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true,
        pixelRatio: 2,
        style: { transform: 'none' } 
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Entrada_${displayGuest}_${event.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error', err);
      alert('Error al generar la imagen.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <header className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">{event.title}</h1>
          <p className="text-neutral-500 font-light text-xs tracking-[0.2em] uppercase mt-2">Gestiona tu lista y genera entradas</p>
        </div>
        <div className="flex gap-4">
          <Link href="/promoter/events" className="px-6 py-3 bg-transparent border border-neutral-600 text-neutral-400 font-medium tracking-widest hover:border-white hover:text-white transition-all text-[10px] uppercase inline-flex items-center justify-center">
            Volver a Eventos
          </Link>
          {promoterUser.isQrActive && (
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="px-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase inline-flex items-center justify-center"
            >
              Mostrar Mi QR
            </button>
          )}
        </div>
      </header>

      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-neutral-800 shadow-[0_0_50px_rgba(220,38,38,0.2)] p-8 max-w-sm w-full relative">
            <button 
              onClick={() => setIsQRModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif uppercase tracking-widest text-white mb-2 text-center">QR de Promotor</h2>
            <p className="text-[10px] text-neutral-500 font-light tracking-[0.1em] uppercase mb-8 text-center">Escaneo directo en puerta</p>
            <div className="flex justify-center">
              <div className="bg-white p-4 inline-block shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=http://localhost:3000/checkin/${event.id}?ref=${promoterUser.id}`} 
                  alt="QR Promotor" 
                  className="w-48 h-48"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        
        {/* Columna Izquierda: Gestión de Lista */}
        <div className="space-y-8">
          {errorMsg && (
            <div className="p-4 bg-red-500/5 border border-red-500 text-red-500 text-xs uppercase tracking-widest">
              {errorMsg}
            </div>
          )}

          <form action={addGuestAction} className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 space-y-6">
            <h2 className="text-xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4">Añadir a Lista</h2>
            
            <input type="hidden" name="eventId" value={event.id} />
            
            <div className="space-y-3">
              <label htmlFor="guestName" className="block text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">Nombre del Invitado</label>
              <input 
                required 
                type="text" 
                id="guestName" 
                name="guestName" 
                placeholder="Ej: Juan Pérez" 
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setSelectedGuest('');
                }}
                className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white font-sans focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-700" 
              />
            </div>

            <button type="submit" className="w-full bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase py-4">
              Anotar y Generar
            </button>
          </form>

          <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 flex flex-col max-h-[500px]">
            <h2 className="text-xl font-serif uppercase tracking-widest text-white border-b border-neutral-800 pb-4 mb-6">Mi Lista</h2>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {initialGuests.length === 0 ? (
                <p className="text-neutral-600 text-xs font-light uppercase tracking-widest text-center py-8">Lista Vacía</p>
              ) : (
                initialGuests.map((guest: any) => (
                  <div key={guest.id} className="pb-3 border-b border-neutral-900 last:border-0 last:pb-0 flex justify-between items-center group">
                    <span className="text-white font-sans text-sm font-medium">{guest.name}</span>
                    <button 
                      type="button"
                      onClick={() => {
                         setSelectedGuest(guest.name);
                         setGuestName('');
                      }}
                      className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
                    >
                      Ver Entrada
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa Entrada */}
        <div className="space-y-8">
          
          {/* Ticket Container */}
          <div className="bg-transparent border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center">
            <h2 className="text-sm font-serif uppercase tracking-widest text-white mb-6 text-center w-full">Entrada Digital</h2>
            
            <div 
              ref={ticketRef}
              className="bg-black border border-neutral-800 relative overflow-hidden w-full max-w-[240px]"
            >
              <div className="w-full aspect-[4/5] bg-black relative flex items-center justify-center text-center overflow-hidden border-b border-neutral-900">
                {event.flyerImageUrl ? (
                  <img src={event.flyerImageUrl} alt={event.title} crossOrigin="anonymous" className="w-full h-full object-contain" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-neutral-900 flex items-center justify-center">
                     <h3 className="text-xl font-serif text-white uppercase tracking-widest px-2">{event.title}</h3>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-80" />
              </div>
              
              <div className="p-4 bg-black relative z-10">
                <p className="text-[8px] text-accent font-light uppercase tracking-[0.2em] mb-1 text-center">Entrada Para</p>
                <h2 className="text-xl font-serif text-white text-center uppercase tracking-widest mb-3 break-words leading-tight">
                  {displayGuest}
                </h2>
                
                <div className="text-center mt-3">
                  <span className="text-[6px] text-neutral-600 uppercase tracking-widest block">Invitado por</span>
                  <p className="text-[8px] text-white uppercase tracking-widest mt-1">
                    {promoterUser.firstName} {promoterUser.lastName}
                  </p>
                </div>
                
                <div className="flex justify-center items-center pt-3 mt-3 border-t border-neutral-900">
                  <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-light">{event.eventDate.split('T')[0]}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full max-w-[240px] mt-6 py-3 bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent disabled:hover:shadow-none"
            >
              {isDownloading ? 'Generando...' : 'Descargar Imagen'}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
