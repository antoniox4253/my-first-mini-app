import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  email: string;
  walletAddress?: string;
  username: string;
  createdAt: Date;
  wld: number;
  realm: number;
  guildId?: Types.ObjectId; // o string si manejas IDs personalizados
}

const UserSchema = new Schema<IUser>({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, sparse: true }, // puede ser null
  username: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  wld: { type: Number, default: 0 },
  realm: { type: Number, default: 0 },
  guildId: { type: Schema.Types.ObjectId, ref: 'Guild', default: null }, // referencia opcional
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
