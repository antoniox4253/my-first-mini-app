import { NextResponse } from 'next/server';
import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';

export async function POST(req: Request) {
  await connectMongo();
  const { email, username, walletAddress } = await req.json();

  if (!username) {
    return NextResponse.json({ error: 'Falta nombre de usuario' }, { status: 400 });
  }

  // Buscar usuario existente
  let user = null;

  if (walletAddress) {
    user = await User.findOne({ walletAddress });
  }

  if (!user && email) {
    user = await User.findOne({ email });
  }

  // Si se encontró un usuario
  if (user) {
    // Si es un usuario con email registrado y sin wallet
    if (email && user.email === email && !user.walletAddress && walletAddress) {
      user.walletAddress = walletAddress;
      user.username = username;
      await user.save();
      return NextResponse.json({ success: true, message: 'Usuario actualizado con wallet' });
    }

    // Si es un usuario con wallet registrado y sin email
    if (walletAddress && user.walletAddress === walletAddress && !user.email && email) {
      user.email = email;
      user.username = username;
      await user.save();
      return NextResponse.json({ success: true, message: 'Usuario actualizado con email' });
    }

    // Si ya existe un usuario con email y wallet → duplicado
    return NextResponse.json(
      { error: 'Ya existe un usuario registrado con este correo o wallet' },
      { status: 400 }
    );
  }

  // Crear nuevo usuario
  const newUser = new User({ email, username, walletAddress });
  await newUser.save();

  return NextResponse.json({ success: true, message: 'Usuario creado' });
}