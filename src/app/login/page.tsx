'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="fixed inset-0 bg-solo-dark flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-solo-purple border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-white text-xl font-semibold">🔄 Loading New Login...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment...</p>
        </div>
      </div>
    );
  }

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
          <img src="/login/google.png" alt="Google" className="w-6 h-6 mb-1" />
          Google
        </button>
      </div>
    </div>
  );

}
