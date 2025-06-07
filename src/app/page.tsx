'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        // Esperar para asegurar que MiniKit esté disponible (en World App puede tardar en cargarse)
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (typeof window !== 'undefined' && typeof window.MiniKit !== 'undefined') {
          const result = await window.MiniKit?.isInstalled?.();
          setIsWalletAvailable(result === true);
        } else {
          setIsWalletAvailable(false);
        }
      } catch (error) {
        console.warn('MiniKit no disponible o falló:', error);
        setIsWalletAvailable(false);
      }
    };

    checkMiniKit();
  }, []);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#0e0e16] px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-bold mb-6">Inicia sesión</h1>

        {isWalletAvailable === null && (
          <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
        )}

        {isWalletAvailable === true && <AuthButton />}

        {isWalletAvailable === false && <GoogleButton />}
      </div>
    </main>
  );
}
