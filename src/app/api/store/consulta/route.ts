// src/app/api/store/route.ts
import { NextResponse } from 'next/server';
import { connectMongo } from '@/providers/mongo';
import { StoreProduct } from '@/models/StoreProduct';

export async function GET() {
  try {
    await connectMongo();

    const productos = await StoreProduct.find({ activo: true }).sort({ createdAt: -1 });

    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener productos de tienda:', error);
    return NextResponse.json({ error: 'Error al cargar productos.' }, { status: 500 });
  }
}
