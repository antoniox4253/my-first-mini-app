import { useEffect, useState } from 'react';

interface CheckResponse {
  exists: boolean;
  user: {
    uuid: string;
    email: string;
    walletAddress?: string;
    username: string;
    createdAt: string;
  };
}

export function useUserCheck(email?: string, walletAddress?: string) {
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<CheckResponse['user'] | null>(null);

  useEffect(() => {
    if (!email && !walletAddress) return;

    const checkUser = async () => {
      try {
        const res = await fetch('/api/user/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, walletAddress }),
        });

        const data: CheckResponse = await res.json();
        setUserExists(data.exists);
        setUserData(data.user);
      } catch (error) {
        console.error('Error verificando usuario:', error);
      }
    };

    checkUser();
  }, [email, walletAddress]);

  return { userExists, userData };
}
