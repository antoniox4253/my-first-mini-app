// src/models/storeProduct.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStoreProduct extends Document {
  itemCode: string;
  title: string;
  tipo: 'canje' | 'consumible' | 'item';
  itemRef?: Types.ObjectId; // Solo si tipo === 'item'
  descripcion?: string;
  value?: number;
  damage?: number;
  manaCost?: number;
  type?: 'atk' | 'def';
  efecto?: string;
  res?: boolean;
  cant?: number;
  price: number;
  token: 'realm' | 'wld';
  img: string;
  activo: boolean;
  createdAt: Date;
}

const StoreProductSchema = new Schema<IStoreProduct>({
  itemCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tipo: { type: String, enum: ['canje', 'consumible', 'item'], required: true },
  itemRef: { type: Schema.Types.ObjectId, ref: 'Item' }, // Enlaza solo si es un item del catálogo
  descripcion: { type: String },
  value: { type: Number },
  damage: { type: Number },
  manaCost: { type: Number },
  type: { type: String, enum: ['atk', 'def'] },
  efecto: { type: String },
  res: { type: Boolean },
  cant: { type: Number },
  price: { type: Number, required: true },
  token: { type: String, enum: ['realm', 'wld'], required: true },
  img: { type: String, required: true },
  activo: { type: Boolean, default: true }, // Control de visibilidad
  createdAt: { type: Date, default: Date.now },
});

export const StoreProduct =
  mongoose.models.StoreProduct ||
  mongoose.model<IStoreProduct>('StoreProduct', StoreProductSchema);
