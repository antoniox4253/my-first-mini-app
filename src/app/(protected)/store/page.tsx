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
      redirect('/');
    }
  }

  await connectMongo();

  const user =
    (walletAddress && (await User.findOne({ walletAddress }))) ||
    (email && (await User.findOne({ email })));

  if (!user) {
    redirect('/register');
  }
  return (
    <StoreScreen
      username={user.username}
    />
  );
}
