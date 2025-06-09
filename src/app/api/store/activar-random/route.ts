
// @vercel/crons: schedule="0 12 * * 1" timezone="America/Lima"

import { NextResponse } from 'next/server';
import { connectMongo } from '@/providers/mongo';
import { StoreProduct } from '@/models/StoreProduct';

export async function GET() {
  try {
    await connectMongo();

    // Poner todos inactivos
    await StoreProduct.updateMany({ tipo: 'item' }, { $set: { activo: false } });

    // Elegir 2 legendarios, 4 épicos, y 14 más aleatorios
    const legendarios = await StoreProduct.aggregate([
      { $match: { tipo: 'item', activo: false } },
      { $lookup: { from: 'items', localField: 'itemRef', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $match: { 'item.rareza': 'legendario' } },
      { $sample: { size: 2 } },
    ]);

    const epicos = await StoreProduct.aggregate([
      { $match: { tipo: 'item', activo: false } },
      { $lookup: { from: 'items', localField: 'itemRef', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $match: { 'item.rareza': 'epico' } },
      { $sample: { size: 4 } },
    ]);

    const otros = await StoreProduct.aggregate([
      { $match: { tipo: 'item', activo: false } },
      { $lookup: { from: 'items', localField: 'itemRef', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $match: { 'item.rareza': { $in: ['comun', 'poco_comun', 'raro'] } } },
      { $sample: { size: 14 } },
    ]);

    const activables = [...legendarios, ...epicos, ...otros];
    const ids = activables.map(p => p._id);

    await StoreProduct.updateMany({ _id: { $in: ids } }, { $set: { activo: true } });

    return NextResponse.json({ ok: true, seleccionados: ids.length });
  } catch (err) {
    console.error('Error en activar-random:', err);
    return NextResponse.json({ error: 'Error activando ítems aleatorios' }, { status: 500 });
  }
}
