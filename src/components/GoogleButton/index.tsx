'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

export const GoogleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/home' });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex flex-col items-center justify-center w-28 h-28 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg transition-all"
    >
      <Image src="/login/google.png" alt="Google" width={24} height={24} className="mb-1" />
      {loading ? 'Cargando...' : 'Google'}
    </button>
  );
};
