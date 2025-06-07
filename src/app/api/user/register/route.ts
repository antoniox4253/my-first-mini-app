import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectMongo();
  const { uuid, email, walletAddress, username } = await req.json();

  if (!uuid || !email || !username) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return NextResponse.json({ error: 'Correo ya registrado' }, { status: 409 });
  }

  const existingWallet = walletAddress ? await User.findOne({ walletAddress }) : null;
  if (existingWallet) {
    return NextResponse.json({ error: 'Wallet ya registrada' }, { status: 409 });
  }

  const user = new User({ uuid, email, walletAddress, username });
  await user.save();

  return NextResponse.json({ success: true, user });
}
