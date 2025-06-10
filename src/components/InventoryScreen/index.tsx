// src/components/InventoryScreen/index.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getUserInventory } from '@/services/inventoryService'; // Función para obtener el inventario
import { InventoryItem } from '@/types/inventoryItem'; // Tipo de datos para el inventario
import InventoryCard from '@/components/InventoryCard'; // Componente para mostrar cada ítem

interface InventoryScreenProps {
  username: string;
  userId: string;
}

export default function InventoryScreen({ username, userId }: InventoryScreenProps) {
  const [tab, setTab] = useState<'personajes' | 'consumibles' | 'canjes'>('personajes');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    async function fetchInventory() {
      const data = await getUserInventory(userId); // Trae los productos del inventario
      setInventory(data);
    }
    fetchInventory();
  }, [userId]);

  const personajes = inventory.filter(item => item.tipo === 'personaje');
  const consumibles = inventory.filter(item => item.tipo === 'consumible');
  const canjes = inventory.filter(item => item.tipo === 'canje');

  return (
    <div className="relative min-h-screen flex flex-col bg-[#181d2a] pt-[72px]">
      <h2 className="text-white font-bold text-lg text-center mb-4">Tu Inventario</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setTab('personajes')}
          className={tab === 'personajes' ? 'text-white font-bold' : 'text-[#39aaff]'}
        >
          Personajes
        </button>
        <button
          onClick={() => setTab('consumibles')}
          className={tab === 'consumibles' ? 'text-white font-bold' : 'text-[#39aaff]'}
        >
          Consumibles & Equipamientos
        </button>
        <button
          onClick={() => setTab('canjes')}
          className={tab === 'canjes' ? 'text-white font-bold' : 'text-[#39aaff]'}
        >
          Canjes
        </button>
      </div>

      <div className="flex-1 px-4 overflow-y-auto pb-[96px]">
        {/* TAB: Personajes */}
        {tab === 'personajes' && (
          <div className="grid grid-cols-2 gap-4">
            {personajes.length > 0 ? (
              personajes.map(item => (
                <InventoryCard key={item.itemCode} item={item} />
              ))
            ) : (
              <div className="text-white">No tienes personajes en tu inventario.</div>
            )}
          </div>
        )}

        {/* TAB: Consumibles & Equipamientos */}
        {tab === 'consumibles' && (
          <div className="grid grid-cols-2 gap-4">
            {consumibles.length > 0 ? (
              consumibles.map(item => (
                <InventoryCard key={item.itemCode} item={item} />
              ))
            ) : (
              <div className="text-white">No tienes consumibles ni equipamientos en tu inventario.</div>
            )}
          </div>
        )}

        {/* TAB: Canjes */}
        {tab === 'canjes' && (
          <div className="grid grid-cols-2 gap-4">
            {canjes.length > 0 ? (
              canjes.map(item => (
                <InventoryCard key={item.itemCode} item={item} />
              ))
            ) : (
              <div className="text-white">No tienes canjes en tu inventario.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
