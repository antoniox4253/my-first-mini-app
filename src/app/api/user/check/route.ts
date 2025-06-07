import { NextResponse } from 'next/server';
import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';

export async function POST(req: Request) {
  await connectMongo();
  const { email, walletAddress } = await req.json();

  if (!email && !walletAddress) {
    return NextResponse.json({ error: 'Se requiere email o walletAddress' }, { status: 400 });
  }

  let user = null;

  if (walletAddress) {
    user = await User.findOne({ walletAddress });
  }

  if (!user && email) {
    user = await User.findOne({ email });
  }

  const exists = !!user;

  return NextResponse.json({ exists, user });
}
