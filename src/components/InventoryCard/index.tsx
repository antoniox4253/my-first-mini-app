// src/components/InventoryCard.tsx

import React from 'react';
import { InventoryItem } from '@/types/inventoryItem'; // Tipo de datos para el item

interface InventoryCardProps {
  item: InventoryItem;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  return (
    <div className="bg-[#2b3b4e] p-4 rounded-lg shadow-lg flex flex-col items-center">
      <img
        src={item.img || '/default-item.png'} // Suponiendo que cada item tenga una propiedad img
        alt={item.title}
        className="w-32 h-32 object-cover mb-2 rounded-lg"
      />
      <h3 className="text-white font-semibold text-lg">{item.title}</h3>
      <p className="text-[#aeefff]">{item.tipo}</p>
      <p className="text-[#ffe94d] font-bold">Cantidad: {item.cantidad}</p>
      {/* Aquí puedes agregar botones de acción para usar, vender o equipar */}
    </div>
  );
};

export default InventoryCard;
