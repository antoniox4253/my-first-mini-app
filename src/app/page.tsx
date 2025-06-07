'use client';

import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton'; // reemplázalo con el nombre correcto si es diferente

export default function Page() {
  const { isInstalled } = useMiniKit();
  const [showWallet, setShowWallet] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof isInstalled === 'boolean') {
      setShowWallet(isInstalled);
    }
  }, [isInstalled]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0e16] p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Inicia sesión</h1>

        {showWallet === null && (
          <p className="text-white animate-pulse">inicio de sesión...</p>
        )}

        {showWallet === true && <AuthButton />}

        {showWallet === false && <GoogleButton />}
      </div>
    </main>
  );
}
