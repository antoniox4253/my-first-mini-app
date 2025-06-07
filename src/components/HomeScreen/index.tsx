'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useMissionSlots from '@/hooks/useMissionSlots';
import PortalAnimado from '@/components/PortalAnimado';

interface MissionSlot {
  id: number;
  activo: boolean;
  ocupado: boolean;
}

interface HomeScreenProps {
  username: string;
  uuid: string;
  email: string;
}

const imgEnMision = '/home/icon-mision-activa.png';
const portalFrames = ['/home/1.png', '/home/2.png', '/home/3.png'];
const portalWidth = 70;
const portalHeight = 100;

const neonStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontWeight: 900,
  color: '#39aaff',
  textShadow: '0 0 8px #39aaff, 0 0 24px #39aaffaa',
  fontSize: 18,
  letterSpacing: 1.1,
};

export default function HomeScreen({ username, uuid, email }: HomeScreenProps) {
  const router = useRouter();
  const { slots, desbloquearSlot, getTimeLeft } = useMissionSlots();
  const [popup, setPopup] = useState<{ visible: boolean; portalIdx: number | null }>({
    visible: false,
    portalIdx: null,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  function pagarYDesbloquearSlot(slotId: number) {
    desbloquearSlot(slotId);
    setPopup({ visible: false, portalIdx: null });
    window.location.reload();
  }

  const handleEnviarMision = (slot: MissionSlot) => {
    if (!slot.activo) {
      setPopup({ visible: true, portalIdx: slot.id });
      return;
    }
    if (slot.ocupado) return;
    router.push(`/missions/${slot.id}`);
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: "url('/home/backgroundHome.png') center/cover no-repeat",
          overflow: 'hidden',
        }}
      >
        {popup.visible && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(12, 19, 39, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: '#191f33',
                borderRadius: 14,
                padding: '2.2em 1.5em 1.5em',
                boxShadow: '0 8px 32px #000b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90vw',
                maxWidth: 320,
              }}
            >
              <h3 style={{ color: '#ffe94d', fontWeight: 900, fontSize: 19, textAlign: 'center' }}>
                Slot Premium Bloqueado
              </h3>
              <p style={{ color: '#ccd7fa', fontSize: 15, textAlign: 'center' }}>
                Debes pagar <span style={{ color: '#ffe94d' }}>1500 WLD</span> para desbloquear este slot.
              </p>
              <button
                onClick={() => pagarYDesbloquearSlot(popup.portalIdx!)}
                style={{
                  background: 'linear-gradient(90deg,#ffe94d 60%,#39aaff 120%)',
                  color: '#232940',
                  fontWeight: 700,
                  padding: '0.6em 1.2em',
                  borderRadius: 7,
                }}
              >
                Pagar y desbloquear
              </button>
              <button
                onClick={() => setPopup({ visible: false, portalIdx: null })}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #39aaff',
                  padding: '0.6em 1.2em',
                  borderRadius: 7,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 20,
            width: '100%',
            height: 'calc(100% - 156px)',
            display: 'grid',
            gridTemplateColumns: `repeat(2, minmax(${portalWidth * 2}px, 1fr))`,
            gridTemplateRows: 'repeat(3, 1fr)',
            justifyItems: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {slots.map((slot) => (
            <div
              key={slot.id}
              style={{
                position: 'relative',
                width: portalWidth + 100,
                left: -150,
                height: portalHeight,
                display: 'flex',
                alignItems: 'flex-start',
                opacity: slot.activo ? 1 : 0.5,
              }}
            >
              {slot.ocupado && (
                <img
                  src={imgEnMision}
                  alt="En misión"
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: portalWidth / 2,
                    width: 44,
                    height: 44,
                    zIndex: 6,
                    filter: 'drop-shadow(0 0 12px #39aaff)',
                  }}
                />
              )}
              <PortalAnimado
                frames={portalFrames}
                width={portalWidth}
                height={portalHeight}
                frameDuration={400}
              />
              <button
                onClick={() => handleEnviarMision(slot)}
                disabled={slot.ocupado}
                style={{
                  position: 'absolute',
                  left: portalWidth,
                  top: 0,
                  padding: '0.40em 1.0em',
                  background: slot.activo
                    ? slot.ocupado
                      ? 'linear-gradient(90deg, #888 60%, #bbb 100%)'
                      : 'linear-gradient(90deg, #222f46 70%, #39aaff 100%)'
                    : 'linear-gradient(90deg, #232940 70%, #ffe94d 100%)',
                  color: slot.activo ? '#fff' : '#ffe94d',
                  border: 'none',
                  borderRadius: 9,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                {slot.activo ? (slot.ocupado ? 'En misión...' : 'Enviar a misión') : 'Desbloquear'}
              </button>
              {slot.ocupado && (
                <div style={{ position: 'absolute', left: portalWidth, top: 42, width: 122 }}>
                  <span style={neonStyle}>
                    {getTimeLeft(slot.id) > 0
                      ? new Date(getTimeLeft(slot.id)).toISOString().substr(11, 8)
                      : '¡Completado!'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
