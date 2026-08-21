import { AuthCard } from '@/components/auth/AuthCard';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden px-4">
      {/* Background neon glow effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-700/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="fixed top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-accent/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <AuthCard initialMode="register" />
    </main>
  );
}
