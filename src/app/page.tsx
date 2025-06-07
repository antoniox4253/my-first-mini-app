'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        // Espera breve para que MiniKit se exponga (World App puede demorar)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const isWorldApp =
          typeof window !== 'undefined' &&
          navigator.userAgent.toLowerCase().includes('worldcoin');

        const miniKitInstalled =
          typeof window !== 'undefined' &&
          typeof window.MiniKit !== 'undefined' &&
          (await window.MiniKit.isInstalled?.());

        // Mostrar AuthButton solo si ambas condiciones se cumplen
        if (isWorldApp && miniKitInstalled) {
          setIsWalletAvailable(true);
        } else {
          setIsWalletAvailable(false);
        }
      } catch (error) {
        console.warn('Error verificando MiniKit:', error);
        setIsWalletAvailable(false);
      }
    };

    checkMiniKit();
  }, []);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#0e0e16] px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center min-h-full px-4 py-6">
        {/* Solo muestra el título si NO estás en World App */}
        {isWalletAvailable === false && (
          <h1 className="text-white text-2xl font-bold mb-6">Inicia sesión</h1>
        )}

        {/* Estado intermedio de carga */}
        {isWalletAvailable === null && (
          <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
        )}

        {/* Mostrar componente correspondiente */}
        {isWalletAvailable === true && <AuthButton />}
        {isWalletAvailable === false && (
          <>
            {/* Mensaje debug opcional */}
            {/* <p className="text-white mb-3">Navegador detectado</p> */}
            <GoogleButton />
          </>
        )}
      </div>
    </main>
  );
}
