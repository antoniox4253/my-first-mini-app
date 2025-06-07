import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  email: string;
  walletAddress?: string;
  username: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, sparse: true }, // puede ser null
  username: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
