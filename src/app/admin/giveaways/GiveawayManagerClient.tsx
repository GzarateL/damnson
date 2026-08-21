'use client';

import { useState, useRef } from 'react';
import { setGiveawayWinnerAction } from '@/actions/giveaway.actions';

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
}

interface Props {
  giveawayId: number;
  title: string;
  mode: string;
  riggedWinnerId: number | null;
  participants: Participant[];
}

export function GiveawayManagerClient({ giveawayId, title, mode, riggedWinnerId, participants }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('...');
  const [winner, setWinner] = useState<Participant | null>(null);

  const spinInterval = useRef<NodeJS.Timeout | null>(null);

  const handleStart = async () => {
    if (participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Determinar ganador
    let chosenWinner: Participant;
    if (mode === 'SUCIO' && riggedWinnerId) {
      chosenWinner = participants.find(p => p.id === riggedWinnerId) || participants[0];
    } else {
      const randomIndex = Math.floor(Math.random() * participants.length);
      chosenWinner = participants[randomIndex];
    }

    // Efecto de ruleta rápida
    let ticks = 0;
    const maxTicks = 30; // ~3 segundos a 100ms
    
    spinInterval.current = setInterval(async () => {
      ticks++;
      const randomDisplay = participants[Math.floor(Math.random() * participants.length)];
      setCurrentDisplay(`${randomDisplay.firstName} ${randomDisplay.lastName}`);

      if (ticks >= maxTicks) {
        if (spinInterval.current) clearInterval(spinInterval.current);
        setCurrentDisplay(`${chosenWinner.firstName} ${chosenWinner.lastName}`);
        setWinner(chosenWinner);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleClose = async () => {
    if (winner) {
      await setGiveawayWinnerAction(giveawayId, winner.id);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => {
          setIsOpen(true);
          setWinner(null);
          setCurrentDisplay('¿Quién ganará?');
        }}
        className="px-4 py-2 bg-accent text-white font-medium tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] uppercase"
      >
        Iniciar Sorteo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          
          <button 
            onClick={() => {
              if (winner) {
                handleClose();
              } else {
                setIsOpen(false);
                if (spinInterval.current) clearInterval(spinInterval.current);
              }
            }}
            className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>

          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-accent mb-12 animate-text-breathe text-center">
            {title}
          </h2>

          <div className="text-center space-y-12 w-full max-w-4xl mx-auto px-4">
            {!isSpinning && !winner ? (
              <button 
                onClick={handleStart}
                className="px-12 py-6 bg-transparent border-2 border-accent text-accent font-bold tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] text-xl uppercase"
              >
                ¡Comenzar!
              </button>
            ) : null}

            {(isSpinning || winner) && (
              <div className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 blur-[100px] pointer-events-none" />
                <p className={`text-6xl md:text-8xl font-black font-sans uppercase tracking-tighter ${isSpinning ? 'text-neutral-500 blur-[2px]' : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] scale-110'} transition-all duration-500`}>
                  {currentDisplay}
                </p>
              </div>
            )}

            {!isSpinning && winner && (
              <div className="animate-fade-in space-y-8 mt-12">
                <p className="text-sm text-neutral-400 uppercase tracking-widest">
                  Ganador Confirmado
                </p>
                <button 
                  onClick={handleClose}
                  className="px-12 py-4 bg-accent text-white font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] text-sm uppercase"
                >
                  Aceptar y Terminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
