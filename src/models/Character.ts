import mongoose, { Schema, Document, Types } from 'mongoose';

interface StatBlock {
  vida: number;
  poder: number;
  mana: number;
  energia: number;
  suerte: number;
  velocidad: number;
  defensa: number;
}

interface Ataque {
  nombre: string;
  tipo: 'atk' | 'def' | 'hattack' | 'hdef';
  descripcion: string;
  mana: number;
  prioridad: number;
  item?: Types.ObjectId; // item que lo otorga (opcional)
  set?: string;          // set que lo activa (opcional, usar id de setInfo)
  efecto?: {
    tipo: 'daño' | 'cura' | 'buff' | 'debuff' | 'stun' | 'sangrado';
    valor: number;
    duracion?: number;
    descripcion?: string;
  };
  counter?: string;
  dobleEfecto?: string;
  condicion?: string;
}

export interface ICharacter extends Document {
  user: Types.ObjectId;
  name: string;
  rareza: 'comun' | 'poco_comun' | 'raro' | 'epico' | 'legendario';
  level: number;
  experiencia: number;
  experienciaNecesaria: number;
  statsBase: StatBlock;
  statsExtra: StatBlock;
  vidaActual: number;
  manaActual: number;
  energiaActual: number;
  equipamiento: {
    cabeza?: Types.ObjectId;
    pecho?: Types.ObjectId;
    piernas?: Types.ObjectId;
    armaDerecha?: Types.ObjectId;
    armaIzquierda?: Types.ObjectId;
    colgante?: Types.ObjectId;
  };
  ataques: Ataque[];
  habilidadEspecial?: Ataque;
  isActive: boolean;
  isForSale: boolean;
  creadoEn: Date;
}

const StatBlockSchema = {
  vida: { type: Number, default: 0 },
  poder: { type: Number, default: 0 },
  mana: { type: Number, default: 0 },
  energia: { type: Number, default: 0 },
  suerte: { type: Number, default: 0 },
  velocidad: { type: Number, default: 0 },
  defensa: { type: Number, default: 0 },
};

const EfectoSchema = {
  tipo: {
    type: String,
    enum: ['daño', 'cura', 'buff', 'debuff', 'stun', 'sangrado'],
  },
  valor: Number,
  duracion: Number,
  descripcion: String,
};

const AtaqueSchema = new Schema<Ataque>({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['atk', 'def', 'hattack', 'hdef'], required: true },
  descripcion: { type: String },
  mana: { type: Number, required: true },
  prioridad: { type: Number, default: 1 },
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  set: { type: String },
  efecto: EfectoSchema,
  counter: { type: String },
  dobleEfecto: { type: String },
  condicion: { type: String },
});

const CharacterSchema = new Schema<ICharacter>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rareza: {
    type: String,
    enum: ['comun', 'poco_comun', 'raro', 'epico', 'legendario'],
    default: 'comun',
  },
  level: { type: Number, default: 1 },
  experiencia: { type: Number, default: 0 },
  experienciaNecesaria: { type: Number, default: 100 },

  statsBase: { type: StatBlockSchema },
  statsExtra: { type: StatBlockSchema },
  vidaActual: { type: Number, default: 0 },
  manaActual: { type: Number, default: 0 },
  energiaActual: { type: Number, default: 0 },

  equipamiento: {
    cabeza: { type: Schema.Types.ObjectId, ref: 'Item' },
    pecho: { type: Schema.Types.ObjectId, ref: 'Item' },
    piernas: { type: Schema.Types.ObjectId, ref: 'Item' },
    armaDerecha: { type: Schema.Types.ObjectId, ref: 'Item' },
    armaIzquierda: { type: Schema.Types.ObjectId, ref: 'Item' },
    colgante: { type: Schema.Types.ObjectId, ref: 'Item' },
  },

  ataques: [AtaqueSchema],
  habilidadEspecial: AtaqueSchema,

  isActive: { type: Boolean, default: false },
  isForSale: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now },
});

export const Character =
  mongoose.models.Character || mongoose.model<ICharacter>('Character', CharacterSchema);
