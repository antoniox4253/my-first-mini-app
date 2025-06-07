'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const [authMethod, setAuthMethod] = useState<'wallet' | 'google' | 'detecting'>('detecting');

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // Esperar para permitir que MiniKit se exponga en World App
        await new Promise((resolve) => setTimeout(resolve, 300));

        const miniKitAvailable =
          typeof window !== 'undefined' &&
          typeof window.MiniKit !== 'undefined' &&
          typeof window.MiniKit.isInstalled === 'function';

        const isInstalled = miniKitAvailable && (await window.MiniKit!.isInstalled!());

        if (isInstalled) {
          setAuthMethod('wallet');
        } else {
          setAuthMethod('google');
        }
      } catch (error) {
        console.warn('Fallo al verificar entorno:', error);
        setAuthMethod('google');
      }
    };

    checkEnvironment();
  }, []);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#0e0e16] px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center min-h-full px-4 py-6">
        {/* Título solo si se usará Google */}
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
