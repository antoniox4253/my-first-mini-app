// src/app/api/inventory/buy/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Tu archivo de autenticación
import { connectMongo } from '@/providers/mongo';
import { InventoryItem } from '@/models/InventoryItem';
import { StoreProduct } from '@/models/StoreProduct';

export async function POST(req: Request) {
  const { itemCode } = await req.json();

  // Obtener la sesión del usuario
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse(
      JSON.stringify({ error: 'No autenticado o sesión no encontrada' }),
      { status: 401 }
    );
  }

  const userId = session.user.id; // Obtenemos el userId de la sesión

  try {
    await connectMongo();

    // Verificar si el producto existe en el catálogo
    const product = await StoreProduct.findOne({ itemCode });
    if (!product) {
      return new NextResponse(
        JSON.stringify({ error: 'Producto no encontrado' }),
        { status: 404 }
      );
    }

    // Si el producto ya está en el inventario, aumentar la cantidad
    const existingItem = await InventoryItem.findOne({ userId, itemCode });

    if (existingItem) {
      existingItem.cantidad += 1;
      await existingItem.save();
    } else {
      // Si no existe en el inventario, agregar un nuevo ítem
      const newInventoryItem = new InventoryItem({
        userId,
        itemCode,
        title: product.title,
        tipo: product.tipo,
        cantidad: 1,
        usado: false,
        productoRef: product._id,
      });
      await newInventoryItem.save();
    }

    return new NextResponse(JSON.stringify({ message: 'Producto comprado exitosamente' }), { status: 200 });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno al procesar la compra' }),
      { status: 500 }
    );
  }
}
