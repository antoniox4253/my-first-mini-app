'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300)); // espera para cargar MiniKit

        const isWorldApp =
          typeof window !== 'undefined' &&
          navigator.userAgent.toLowerCase().includes('worldcoin');

        const miniKitInstalled =
          typeof window !== 'undefined' &&
          typeof window.MiniKit !== 'undefined' &&
          (await window.MiniKit.isInstalled?.());

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
      <div className="w-full max-w-md text-center flex flex-col items-center justify-center">
        {/* Solo muestra el título si NO estás en World App */}
        {isWalletAvailable === false && (
          <h1 className="text-white text-2xl font-bold mb-6">Inicia sesión</h1>
        )}

        {/* Estado intermedio */}
        {isWalletAvailable === null && (
          <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
        )}

        {/* Dentro de World App y MiniKit listo */}
        {isWalletAvailable === true && <AuthButton />}

        {/* En navegador u otra app */}
        {isWalletAvailable === false && <GoogleButton />}
      </div>
    </main>
  );
}
