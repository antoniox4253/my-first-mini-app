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
    <Image
      src={frames[frameIndex]}
      alt="portal"
      style={{
        width,
        height,
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 12px #39aaff)',
      }}
    />
  );
};

export default PortalAnimado;
