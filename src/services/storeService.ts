import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';
import { InventoryItem } from '@/models/InventoryItem';
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
export const buyProduct = async (itemCode: string, price: number, token: 'realm' | 'wld', userId: string) => {
  try {
    await connectMongo();

    // Obtener el usuario desde la base de datos
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificación de saldo según el tipo de moneda (WLD o Realm)
    if (token === 'wld' && user.wldBalance < price) {
      return false; // Saldo insuficiente en WLD
    }

    if (token === 'realm' && user.realmBalance < price) {
      return false; // Saldo insuficiente en Realm
    }

    // Restamos el saldo correspondiente (WLD o Realm)
    if (token === 'wld') {
      user.wldBalance -= price;
    } else if (token === 'realm') {
      user.realmBalance -= price;
    }
    await user.save(); // Guardamos los cambios en el saldo

    // Verificamos si el producto ya existe en el inventario
    const existingItem = await InventoryItem.findOne({ userId, itemCode });
    
    if (existingItem) {
      // Si el item ya está en el inventario, aumentamos la cantidad
      existingItem.cantidad += 1;
      await existingItem.save();
    } else {
      // Si no existe, creamos un nuevo ítem en el inventario
      const newItem = new InventoryItem({
        userId,
        itemCode,
        title: 'Esfera de Maná', // Asume que tienes un título aquí
        tipo: 'consumible',
        cantidad: 1,
        usado: false,
        productoRef: itemCode,
      });
      await newItem.save();
    }

    return true; // La compra fue exitosa
  } catch (error) {
    console.error('Error en la compra:', error);
    return false;
  }
};

// Función para canjear productos del inventario
export async function canjearProducto(productId: string, userId: string): Promise<boolean> {
  try {
    await connectMongo();

    // Obtener el usuario desde la base de datos
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Buscar el producto en el inventario del usuario
    const product = await InventoryItem.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado en el inventario');
    }

    // Verificamos si el producto tiene un "token" asociado (puede ser 'wld' o 'realm')
    const token = product.tipo === 'consumible' ? 'realm' : 'wld'; // Ejemplo de lógica para elegir el token

    // Verificación de saldo según el tipo de moneda (WLD o Realm)
    if (token === 'wld' && user.wldBalance < product.price) {
      throw new Error('Saldo WLD insuficiente para realizar el canje.');
    }

    if (token === 'realm' && user.realmBalance < product.price) {
      throw new Error('Saldo Realm insuficiente para realizar el canje.');
    }

    // Descontamos el saldo correspondiente (WLD o Realm)
    if (token === 'wld') {
      user.wldBalance -= product.price;
    } else if (token === 'realm') {
      user.realmBalance -= product.price;
    }
    await user.save(); // Guardamos los cambios en el saldo

    // Actualizamos el inventario (eliminamos el producto del inventario del usuario)
    await InventoryItem.findByIdAndDelete(productId); // Eliminamos el producto canjeado del inventario

    return true; // El canje fue exitoso
  } catch (error) {
    console.error('Error al canjear el producto:', error);
    return false;
  }
}
