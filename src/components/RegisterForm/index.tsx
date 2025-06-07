'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletDisabled, setIsWalletDisabled] = useState(false);
  const [isAutoCompleteMode, setIsAutoCompleteMode] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }

    if (session?.user?.walletAddress) {
      setWalletAddress(session.user.walletAddress);
      setIsWalletDisabled(false);
      setIsAutoCompleteMode(true);
    } else {
      setIsWalletDisabled(true);
    }

    if (session?.user?.name) {
      setUsername(session.user.name);
    }

    console.log('🔐 Sesión activa:', session);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const uuid = uuidv4();

    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid,
        email,
        username,
        walletAddress: isWalletDisabled ? null : walletAddress,
      }),
    });

    if (res.ok) {
      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push('/(protected)/home');
      }, 2000);
    } else {
      console.error('❌ Error registrando usuario');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e16] p-4 relative">
      <div className="w-full max-w-md">
        {/* Banner Promocional */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-xl p-5 mb-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-2">🎉 Bienvenido a Realm of Valor</h1>
          <p className="text-sm">
            Es una mini app en el ecosistema de la World App con muchos beneficios.
          </p>
          <p className="mt-2 text-yellow-300 font-semibold">
            📲 Descarga la World App y obtén 100 tokens Realm extra
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a2e] p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Registro de Usuario
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded-lg bg-[#2a2a40] text-white border border-[#3a3a55] cursor-not-allowed opacity-70"
              value={email}
              disabled
            />
          </div>

          {/* Nombre de Usuario */}
          <div className="mb-4">
            <label className="block text-white mb-1">Nombre de Usuario</label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg bg-[#2a2a40] text-white border ${
                isAutoCompleteMode
                  ? 'cursor-not-allowed opacity-70 border-[#3a3a55]'
                  : 'border-[#3a3a55] focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isAutoCompleteMode}
              required
            />
          </div>

          {/* Wallet */}
          <div className="mb-6">
            <label className="block text-white mb-1">Wallet (opcional)</label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg bg-[#2a2a40] text-white border ${
                isWalletDisabled || isAutoCompleteMode
                  ? 'cursor-not-allowed opacity-70 border-[#3a3a55]'
                  : 'border-[#3a3a55] focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
              value={walletAddress || ''}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={isWalletDisabled || isAutoCompleteMode}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-500'
            } text-white py-2 rounded-lg font-semibold transition-colors`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>

      {/* Popup Éxito */}
      {showSuccessPopup && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse z-50">
          ✅ ¡Registro exitoso! Redirigiendo...
        </div>
      )}
    </div>
  );
}
