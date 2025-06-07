'use client';
import React, { useState } from 'react';
import { AuthButton } from '../components/AuthButton';
import { SplashScreen } from '@/components/SplashScreen';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleStuck = () => {
    router.push('/home');
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen logoPath="/splash/start.png" onFinish={handleSplashFinish} />
      ) : (
        <div
          className="w-full h-full bg-center bg-cover relative"
          style={{ backgroundImage: "url('/login/backgroundlogin.png')" }}
        >
          {/* Overlay (opcional) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,20,34,0.7)] to-[rgba(23,38,58,0.88)] z-0" />

          {/* Contenido centrado */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <AuthButton onStuck={handleStuck} />
          </div>
        </div>
      )}
    </>
  );
}
