// src/app/store/page.tsx

import StoreScreen from '@/components/StoreScreen';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';

export default async function StorePage() {
  const session = await auth();

  const email = session?.user?.email;
  const walletAddress = session?.user?.walletAddress;

  if (!walletAddress) {
    if (!email) {
      redirect('/'); // Redirige si no hay email o dirección de billetera
    }
  }

  await connectMongo();

  // Buscar usuario por walletAddress o email
  const user =
    (walletAddress && (await User.findOne({ walletAddress }))) ||
    (email && (await User.findOne({ email })));

  if (!user) {
    redirect('/register'); // Redirige si el usuario no está registrado
  }

  // Pasa los datos del usuario a StoreScreen
  return <StoreScreen username={user.username} userId={user._id} wldBalance={user.wld}
  realmBalance={user.realm} />;
}
