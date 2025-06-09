'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const menuItems = [
  { key: 'home', icon: '/menu/home.png', label: 'Inicio' },
  { key: 'battle', icon: '/menu/battle.png', label: 'Batalla' },
  { key: 'inventory', icon: '/menu/inventory.png', label: 'Inventario' },
  { key: 'store', icon: '/menu/store.png', label: 'Tienda' },
  { key: 'train', icon: '/menu/train.png', label: 'Entrenar' },
];

interface MenuBarProps {
  selected: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ selected }) => {
  const router = useRouter();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '76px',
        background:
          "linear-gradient(rgba(19,22,28,0.8), rgba(19,22,28,0.8)), url('/menu/backgroundmenu.png') center/cover no-repeat",
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
        boxShadow: '0 -2px 10px #0c133766',
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => router.push(`/${item.key}`)}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: selected === item.key ? 1 : 0.6,
            filter:
              selected === item.key ? 'drop-shadow(0 0 14px #39aaffcc)' : 'none',
            cursor: 'pointer',
          }}
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={32}
            height={32}
            style={{
              marginBottom: 2,
              objectFit: 'contain',
              transition: 'filter 0.18s, opacity 0.18s',
            }}
          />
          {/* <span style={{ color: '#cbe3ff', fontSize: 11, marginTop: 2 }}>{item.label}</span> */}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
