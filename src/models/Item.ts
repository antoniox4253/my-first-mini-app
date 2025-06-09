import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  itemId: string; // ID único interno para lógica del juego
  nombre: string;
  descripcion: string;
  rareza: 'comun' | 'poco_comun' | 'raro' | 'epico' | 'legendario';
  tipo: 'arma' | 'armadura' | 'accesorio';
  slot: 'cabeza' | 'pecho' | 'piernas' | 'armaDerecha' | 'armaIzquierda' | 'colgante';
  bonus: {
    stat: 'vida' | 'poder' | 'mana' | 'energia' | 'suerte' | 'velocidad' | 'defensa';
    valor: number;
  }[];
  efecto?: {
    tipo: 'daño' | 'cura' | 'aura' | 'vida' | 'veneno' | 'defensaExtra' | 'stun' | 'sangrado';
    valor: number;
    duracion?: number; // turnos (opcional)
    descripcion?: string;
  };
  setInfo?: {
    id: string;
    nombre: string;
    descripcion?: string;
    efecto?: {
      tipo: 'daño' | 'cura' | 'aura' | 'pasiva' | 'veneno' | 'defensaExtra' | 'stun' | 'sangrado';
      valor: number;
      duracion?: number;
      descripcion?: string;
    };
  };
  precio: number;
  imagenUrl?: string;
  creadoEn: Date;
}

const ItemSchema = new Schema<IItem>({
  itemId: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  rareza: {
    type: String,
    enum: ['comun', 'poco_comun', 'raro', 'epico', 'legendario'],
    required: true,
  },
  tipo: {
    type: String,
    enum: ['arma', 'armadura', 'accesorio'],
    required: true,
  },
  slot: {
    type: String,
    enum: ['cabeza', 'pecho', 'piernas', 'armaDerecha', 'armaIzquierda', 'colgante'],
    required: true,
  },
  bonus: [
    {
      stat: {
        type: String,
        enum: ['vida', 'poder', 'mana', 'energia', 'suerte', 'velocidad', 'defensa'],
        required: true,
      },
      valor: { type: Number, required: true },
    },
  ],
  efecto: {
    tipo: {
      type: String,
      enum: ['daño', 'cura', 'aura', 'vida', 'veneno', 'defensaExtra', 'stun' , 'sangrado'],
    },
    valor: { type: Number },
    duracion: { type: Number },
    descripcion: { type: String },
  },
  setInfo: {
    id: { type: String },
    nombre: { type: String },
    descripcion: { type: String },
    efecto: {
      tipo: {
        type: String,
        enum: ['daño', 'cura', 'aura', 'pasiva', 'veneno', 'defensaExtra', 'stun' , 'sangrado'],
      },
      valor: { type: Number },
      duracion: { type: Number },
      descripcion: { type: String },
    },
  },
  precio: { type: Number, default: 0 },
  imagenUrl: { type: String },
  creadoEn: { type: Date, default: Date.now },
});

export const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
