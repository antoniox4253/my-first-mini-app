import { StoreProduct } from '@/types/storeProduct';

export async function getStoreProducts(): Promise<StoreProduct[]> {
  try {
    const res = await fetch('/api/store/consulta', { cache: 'no-store' });

    if (!res.ok) throw new Error('Error al obtener productos');

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error en storeService:', error);
    return [];
  }
}
