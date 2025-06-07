'use client';
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import Image from 'next/image'


interface SplashScreenProps {
  logoPath: string;
  onFinish: () => void;
}

export const SplashScreen: FC<SplashScreenProps> = ({ logoPath, onFinish }) => {
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setOpacity(0), 0);
    const fadeInTimer = setTimeout(() => setOpacity(1), 5000);
    const finishTimer = setTimeout(onFinish, 10000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(fadeInTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 5s ease-in-out',
    opacity,
    zIndex: 10,
  };

  const imgStyle: React.CSSProperties = {
    width: '80vw',
    maxWidth: '90%',
    height: 'auto',
    maxHeight: '80vh',
    objectFit: 'contain',
    display: 'block',
    margin: 'auto',
  };

  return (
    <div style={containerStyle}>
      <Image  src={logoPath} alt="Logo" style={imgStyle} />
    </div>
  );
};
