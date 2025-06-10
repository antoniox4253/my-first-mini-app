// src/models/InventoryItem.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInventoryItem extends Document {
  userId: Types.ObjectId;
  itemCode: string;
  title: string;
  tipo: 'consumible' | 'equipamiento' | 'canje';
  descripcion?: string;
  img?: string;
  valor?: number;
  cantidad: number;
  usado: boolean;
  usadoEn?: Date;
  equipado?: boolean; 
  productoRef?: Types.ObjectId; // Referencia al StoreProduct
  creadoEn: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemCode: { type: String, required: true },
  title: { type: String, required: true },
  tipo: { type: String, enum: ['consumible', 'equipamiento', 'canje'], required: true },
  descripcion: { type: String },
  img: { type: String },
  valor: { type: Number },
  cantidad: { type: Number, default: 1 },
  usado: { type: Boolean, default: false },
  usadoEn: { type: Date },
  equipado: { type: Boolean },
  productoRef: { type: Schema.Types.ObjectId, ref: 'StoreProduct' },
  creadoEn: { type: Date, default: Date.now },
});

export const InventoryItem =
  mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
