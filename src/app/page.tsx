'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from '@/components/AuthButton';
import { GoogleButton } from '@/components/GoogleButton';
import { SplashScreen } from '@/components/SplashScreen'; // Asegúrate de tener este componente

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'google' | 'detecting'>('detecting');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!showSplash) {
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

      setTimeout(checkMiniKitPresence, 300); // breve espera para permitir carga
    }
  }, [showSplash]);

  return showSplash ? (
    <SplashScreen logoPath="/splash/start.png" onFinish={handleSplashFinish} />
  ) : (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center px-4 py-6"
      style={{ backgroundImage: "url('/login/backgroundlogin.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {authMethod === 'google' && (
        <h1 className="text-white text-2xl font-bold mb-6">Inicia sesión</h1>
      )}

      {authMethod === 'detecting' && (
        <p className="text-white animate-pulse">Detectando método de inicio de sesión...</p>
      )}

      {authMethod === 'wallet' && <AuthButton />}
      {authMethod === 'google' && <GoogleButton />}
    </div>
  );
}
