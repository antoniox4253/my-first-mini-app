'use client';

import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';

export default function Page() {
  const miniKit = useMiniKit(); // evitar desestructurar directamente
  const [evaluated, setEvaluated] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    if (typeof miniKit.isInstalled === 'boolean') {
      setShowWallet(miniKit.isInstalled);
      setEvaluated(true);
    }
  }, [miniKit.isInstalled]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0e16] p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Inicia sesión</h1>

        {!evaluated && (
          <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
        )}

        {evaluated && showWallet && <AuthButton />}
        {evaluated && !showWallet && <GoogleButton />}
      </div>
    </main>
  );
}
