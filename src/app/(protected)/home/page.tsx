// ✅ Server Component
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectMongo } from '@/providers/mongo';
import { User } from '@/models/User';
import HomeWrapper from '@/components/HomeWrapper';


export default async function HomePage() {
  const session = await auth();
  console.log('Sesión:', session); // 👈 imprime en consola del servidor


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
    <HomeWrapper
      username={user.username}
      uuid={user.uuid}
      email={user.email}
      profilePictureUrl={session?.user?.profilePictureUrl}
    />
  );
}
