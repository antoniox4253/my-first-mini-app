// src/components/PortalAnimado/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PortalAnimadoProps {
  frames: string[];
  width: number;
  height: number;
  frameDuration?: number;
}

const PortalAnimado: React.FC<PortalAnimadoProps> = ({
  frames,
  width,
  height,
  frameDuration = 200,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frames.length, frameDuration]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 120 }}>
    <Image
      src={frames[frameIndex]}
      alt="portal"
      fill
      sizes="(max-width: 768px) 100vw, 120px"
      style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
    />
  </div>
  );
};

export default PortalAnimado;
