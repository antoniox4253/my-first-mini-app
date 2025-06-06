// app/(protected)/home/page.tsx
import { auth } from '@/auth';
import HomeWrapper from '@/components/HomeWrapper';

export default async function Home() {
  const session = await auth();

  return (
    <HomeWrapper
      username={session?.user.username}
      profilePictureUrl={session?.user.profilePictureUrl}
    />
  );
}
