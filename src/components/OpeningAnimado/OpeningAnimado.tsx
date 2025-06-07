import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface OpeningAnimadoProps {
  onFinish: () => void;
}

const frames = Array.from({ length: 10 }, (_, i) => `/opening/${i + 1}.png`);

const OpeningAnimado: React.FC<OpeningAnimadoProps> = ({ onFinish }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (frame < frames.length - 1) {
      const id = setTimeout(() => setFrame(frame + 1), 350); // 110 ms por frame
      return () => clearTimeout(id);
    } else {
      // Espera un segundo al terminar la animación y luego llama a onFinish
      const id = setTimeout(onFinish, 1000);
      return () => clearTimeout(id);
    }
  }, [frame, onFinish]);

  return (
    <div style={{
      background: 'rgba(18,23,40,0.96)',
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <Image
        src={frames[frame]}
        alt={`Opening frame ${frame + 1}`}
        style={{
          width: 260,
          height: 260,
          objectFit: 'contain',
          borderRadius: 24,
          boxShadow: '0 2px 28px #39aaff55',
          background: '#111b'
        }}
      />
      <div style={{
        marginTop: 18,
        color: '#fff',
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: 1,
        textShadow: '0 2px 8px #000a'
      }}>
        ¡Abriendo Esfera de Maná!
      </div>
    </div>
  );
};

export default OpeningAnimado;
