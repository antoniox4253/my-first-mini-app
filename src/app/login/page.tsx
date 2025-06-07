'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';


export default function SignInPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/home' });
  };


  return (
    <div
      className="w-full h-full bg-center bg-cover relative"
      style={{ backgroundImage: "url('/login/backgroundlogin.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,20,34,0.7)] to-[rgba(23,38,58,0.88)] z-0" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <button
          onClick={handleGoogleSignIn}
          className="flex flex-col items-center justify-center w-28 h-28 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg transition-all"
        >
          <Image src="/login/google.png" alt="Google" className="w-6 h-6 mb-1" />
          Google
        </button>
      </div>
    </div>
  );

}
