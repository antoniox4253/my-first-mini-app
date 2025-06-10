import { StoreProduct } from '@/types/storeProduct';

// Función para obtener productos de la tienda
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

// Función para comprar un producto
export async function buyProduct(productId: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/store/comprar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, userId }),
    });

    if (!res.ok) throw new Error('Error al realizar la compra');

    const data = await res.json();
    if (data.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al comprar el producto:', error);
    return false;
  }
}

// Función para canjear productos del inventario
export async function canjearProducto(productId: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/store/canje', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, userId }),
    });

    if (!res.ok) throw new Error('Error al realizar el canje');

    const data = await res.json();
    if (data.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al canjear el producto:', error);
    return false;
  }
}
