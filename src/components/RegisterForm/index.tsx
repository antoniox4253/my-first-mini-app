'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const DownloadButtons = () => (
  <div className="grid grid-cols-2 gap-x-3 pt-4">
    <a
      href="https://apps.apple.com/no/app/worldcoin-claim-send/id1560859847"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative aspect-[3/1] cursor-pointer hover:opacity-70">
        <Image
          src="https://world.org/images/apple.svg"
          alt="Descargar en App Store"
          fill
          className="object-contain"
        />
      </div>
    </a>
    <a
      href="https://play.google.com/store/apps/details?id=com.worldcoin"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative aspect-[3/1] cursor-pointer hover:opacity-70">
        <Image
          src="https://world.org/images/googledownload.svg"
          alt="Descargar en Google Play"
          fill
          className="object-contain"
        />
      </div>
    </a>
  </div>
);

export default function RegisterForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const [isUsernameDisabled, setIsUsernameDisabled] = useState(false);
  const [isWalletDisabled, setIsWalletDisabled] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!session) return;

    const user = session.user;
    if (user?.walletAddress) {
      // Se autenticó con World App
      setEmail(user.email || '');
      setUsername(user.username);
      setWalletAddress(user.walletAddress);

      setIsWalletDisabled(true);
      setIsUsernameDisabled(true);
      setIsEmailDisabled(false); // puedes editar tu correo
    } else if (user?.email) {
      // Se autenticó con Google
      setEmail(user.email);
      setWalletAddress('');

      setIsWalletDisabled(true);
      setIsUsernameDisabled(false);
      setIsEmailDisabled(true);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPopupMessage('');
    setPopupType(null);

    const uuid = uuidv4();

    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid,
        email,
        username,
        walletAddress: walletAddress || null,
      }),
    });

    if (res.ok) {
      setPopupMessage('✅ ¡Registro exitoso! Redirigiendo...');
      setPopupType('success');
      setTimeout(() => router.push('/home'), 2000);
    } else {
      setPopupMessage('❌ Error al registrar. Intenta de nuevo.');
      setPopupType('error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e16] p-4">
      <div className="w-full max-w-md">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-xl p-5 mb-6 shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-2">🎉 Bienvenido a Realm of Valor</h1>
          <p className="text-sm">Mini app en World App con muchos beneficios.</p>
          <p className="mt-2 text-yellow-300 font-semibold">
            📲 Descarga la World App y obtén 100 tokens Realm extra
          </p>
        </div>
        <DownloadButtons />

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a2e] p-8 rounded-xl shadow-lg mt-4">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              className={`w-full p-2 rounded-lg bg-[#2a2a40] text-white border border-[#3a3a55] ${
                isEmailDisabled ? 'cursor-not-allowed opacity-70' : ''
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailDisabled}
            />
          </div>

          {/* Nombre de Usuario */}
          <div className="mb-4">
            <label className="block text-white mb-1">Nombre de Usuario</label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg bg-[#2a2a40] text-white border border-[#3a3a55] ${
                isUsernameDisabled
                  ? 'cursor-not-allowed opacity-70'
                  : 'focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isUsernameDisabled}
              required
            />
          </div>

          {/* Wallet */}
          <div className="mb-6">
            <label className="block text-white mb-1">Wallet (opcional)</label>
            <input
              type="text"
              className={`w-full p-2 rounded-lg bg-[#2a2a40] text-white border ${
                isWalletDisabled
                  ? 'cursor-not-allowed opacity-70 border-[#3a3a55]'
                  : 'border-[#3a3a55] focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={isWalletDisabled}
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

      {/* Popup */}
      {popupMessage && popupType && (
        <div
          className={`absolute top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg animate-fadeIn z-50 ${
            popupType === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
