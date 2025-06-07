'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const [authMethod, setAuthMethod] = useState<'wallet' | 'google' | 'detecting'>('detecting');

  useEffect(() => {
    const checkMiniKitPresence = () => {
      try {
        const isMiniKitAvailable =
          typeof window !== 'undefined' && typeof window.MiniKit !== 'undefined';

        if (isMiniKitAvailable) {
          setAuthMethod('wallet'); // Estás en World App
        } else {
          setAuthMethod('google'); // Estás en navegador
        }
      } catch (error) {
        console.warn('Error al verificar MiniKit:', error);
        setAuthMethod('google');
      }
    };

    // Espera breve para asegurar que MiniKit cargue
    setTimeout(checkMiniKitPresence, 300);
  }, []);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#0e0e16] px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center min-h-full px-4 py-6">
        {authMethod === 'google' && (
          <h1 className="text-white text-2xl font-bold mb-6">Inicia sesión</h1>
        )}

        {authMethod === 'detecting' && (
          <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
        )}

        {authMethod === 'wallet' && <AuthButton />}
        {authMethod === 'google' && <GoogleButton />}
      </div>
    </main>
  );
}
