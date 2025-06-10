'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';
import Image from 'next/image';

interface TopBarProps {
  username?: string;
  profilePictureUrl?: string;
  wldBalance: number;  // Pasamos el saldo de WLD
  realmBalance: number; // Pasamos el saldo de Realm
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ username, profilePictureUrl, wldBalance, realmBalance, onMenuClick }) => {
  const router = useRouter();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.4em 1em 0.2em 0.6em',
        zIndex: 20,
        background: 'rgba(25, 31, 51, 0.98)',
      }}
    >
      {/* 🔵 Lado izquierdo: username + Marble */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {username && (
          <p className="text-sm font-semibold capitalize text-white">{username}</p>
        )}
        {profilePictureUrl && (
          <Marble src={profilePictureUrl} className="w-12" />
        )}
      </div>

      {/* 🟢 Centro: Saldo WLD y Realm */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image
            src="/top/wld-icon.png" // Imagen del ícono de WLD
            alt="WLD Icon"
            width={24}
            height={24}
          />
          <p className="text-sm text-white">{wldBalance} WLD</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image
            src="/top/realm-icon.png" // Imagen del ícono de Realm
            alt="Realm Icon"
            width={24}
            height={24}
          />
          <p className="text-sm text-white">{realmBalance} Realm</p>
        </div>
      </div>

      {/* 🟢 Lado derecho: íconos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image
          src="/top/tuerca.png"
          alt="settings"
          style={{
            width: 42,
            height: 42,
            cursor: 'pointer',
            filter: 'drop-shadow(0 0 8px #39aaff66)',
          }}
          onClick={() => router.push('/settings')}
        />
        <Image
          src="/top/wallet.png"
          alt="wallet"
          style={{
            width: 42,
            height: 42,
            cursor: 'pointer',
            filter: 'drop-shadow(0 0 8px #fff6)',
          }}
        />
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'linear-gradient(90deg,#39aaff 50%,#ffe94d 100%)',
              border: 'none',
              borderRadius: 7,
              color: '#191f33',
              fontWeight: 900,
              fontSize: 24,
              padding: '5px 18px 5px 13px',
              marginLeft: 5,
              cursor: 'pointer',
              boxShadow: '0 1px 7px #ffe94d40',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Menú"
          >
            ≡
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
