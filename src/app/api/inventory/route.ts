// src/app/api/inventory/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Tu archivo de autenticación
import { connectMongo } from '@/providers/mongo';
import { InventoryItem } from '@/models/InventoryItem';

export async function GET(req: Request) {
  // Obtener la sesión del usuario
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse(
      JSON.stringify({ error: 'No autenticado o sesión no encontrada' }),
      { status: 401 }
    );
  }

  const userId = session.user.id; // Usamos el userId de la sesión

  try {
    await connectMongo();
    const inventory = await InventoryItem.find({ userId }).sort({ creadoEn: -1 });
    return new NextResponse(JSON.stringify(inventory));
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return new NextResponse(JSON.stringify({ error: 'Error al cargar inventario' }), { status: 500 });
  }
}
