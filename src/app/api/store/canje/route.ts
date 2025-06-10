    // src/app/api/inventory/canje/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Tu archivo de autenticación
import { connectMongo } from '@/providers/mongo';
import { InventoryItem } from '@/models/InventoryItem';

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

    // Verificar si el producto existe en el inventario del usuario
    const existingItem = await InventoryItem.findOne({ userId, itemCode });
    if (!existingItem) {
      return new NextResponse(
        JSON.stringify({ error: 'Producto no encontrado en el inventario' }),
        { status: 404 }
      );
    }

    // Lógica de canje: eliminar o modificar el producto
    existingItem.cantidad -= 1; // Reducir la cantidad o cambiar el estado
    if (existingItem.cantidad <= 0) {
      await existingItem.remove(); // Si la cantidad llega a 0, eliminar el item
    } else {
      await existingItem.save(); // Guardar los cambios en el inventario
    }

    return new NextResponse(JSON.stringify({ message: 'Producto canjeado exitosamente' }), { status: 200 });
  } catch (error) {
    console.error('Error al procesar el canje:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno al procesar el canje' }),
      { status: 500 }
    );
  }
}
