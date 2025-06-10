// src/services/inventoryService.ts

import { InventoryItem } from '@/types/inventoryItem';

export async function getUserInventory(userId: string): Promise<InventoryItem[]> {
  try {
    const res = await fetch(`/api/inventory`);
    if (!res.ok) {
      throw new Error('Error al obtener el inventario');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en inventoryService:', error);
    return [];
  }
}
