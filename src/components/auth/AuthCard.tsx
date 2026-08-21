'use client';

import { useState, useActionState, useEffect } from 'react';
import { loginAction } from '@/actions/auth.actions';
import { registerPublicAttendee } from '@/actions/user.actions';
import Link from 'next/link';

export function AuthCard({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
  const [isFlipped, setIsFlipped] = useState(initialMode === 'register');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, null);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerPublicAttendee, null);

  // Sync mode si cambian los props (por si el usuario navega a /register manualmente)
  useEffect(() => {
    setIsFlipped(initialMode === 'register');
  }, [initialMode]);

  const toggleMode = () => {
    const newMode = !isFlipped;
    setIsFlipped(newMode);
    window.history.replaceState(null, '', newMode ? '/register' : '/login');
  };

  return (
    <div className="relative w-full max-w-md perspective-1000 mx-auto mt-12 z-10">
      <div 
        className="w-full relative transition-transform duration-700 preserve-3d"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '560px' }}
      >
        {/* CARA FRONTAL: LOGIN */}
        <div className="w-full absolute top-0 left-0 backface-hidden h-full">
          <div className="bg-black/50 backdrop-blur-md border border-neutral-800 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
            <div>
              <div className="text-center mb-10">
                 <h1 className="text-2xl font-serif uppercase tracking-widest text-white mb-2">Iniciar Sesión</h1>
                 <p className="text-neutral-400 font-light text-[10px] tracking-widest uppercase">Ingresa a tu cuenta para acumular puntos.</p>
              </div>

              <form action={loginFormAction} className="space-y-6">
                {loginState?.error && (
                  <div className="p-3 border border-accent/50 text-accent text-center text-sm font-light tracking-wide">
                    {loginState.error}
                  </div>
                )}

                <div className="space-y-4">
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="tucorreo@ejemplo.com" 
                  />
                </div>

                <div className="space-y-4 relative">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="Tu contraseña" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isLoginPending}
                    className="w-full bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] px-4 py-4 text-sm uppercase disabled:opacity-50"
                  >
                    {isLoginPending ? 'PROCESANDO...' : 'ENTRAR'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10 text-center">
              <button onClick={toggleMode} className="text-neutral-500 font-light text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
                ¿No tienes cuenta? <span className="text-accent underline underline-offset-4">Regístrate</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-neutral-600 font-medium text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                &larr; Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* CARA TRASERA: REGISTER */}
        <div className="w-full absolute top-0 left-0 backface-hidden h-full" style={{ transform: 'rotateY(180deg)' }}>
          <div className="bg-black/50 backdrop-blur-md border border-neutral-800 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
            <div>
              <div className="text-center mb-8">
                 <h1 className="text-2xl font-serif uppercase tracking-widest text-white mb-2">Crear Cuenta</h1>
                 <p className="text-neutral-400 font-light text-[10px] tracking-widest uppercase">Únete al club y obtén recompensas.</p>
              </div>

              <form action={registerFormAction} className="space-y-6">
                {registerState?.error && (
                  <div className="p-3 border border-accent/50 text-accent text-center text-sm font-light tracking-wide">
                    {registerState.error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    required 
                    type="text" 
                    name="firstName" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="Nombre" 
                  />
                  <input 
                    required 
                    type="text" 
                    name="lastName" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="Apellido" 
                  />
                </div>

                <div className="space-y-4">
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="tucorreo@ejemplo.com" 
                  />
                </div>

                <div className="space-y-2 relative">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    className="w-full bg-transparent border-b border-neutral-800 px-0 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-accent transition-all text-center text-sm font-light" 
                    placeholder="Crea una contraseña" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                </div>
                <p className="text-[9px] text-neutral-500 text-center uppercase tracking-[0.2em] mt-2 pb-2">
                  Mínimo 8 caracteres
                </p>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isRegisterPending}
                    className="w-full bg-transparent border border-accent text-accent font-medium tracking-widest hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] px-4 py-4 text-sm uppercase disabled:opacity-50"
                  >
                    {isRegisterPending ? 'PROCESANDO...' : 'CREAR CUENTA'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center">
              <button onClick={toggleMode} className="text-neutral-500 font-light text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
                ¿Ya tienes cuenta? <span className="text-accent underline underline-offset-4">Iniciar Sesión</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-neutral-600 font-medium text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                &larr; Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
