import { auth } from '@/auth';
import ClientProviders from '@/providers';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Realm Of Valor',
  description: 'Play and fun',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#13161c]`}>
        <ClientProviders session={session}>
          {/* Contenedor centrado tipo app móvil */}
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#13161c',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100vw',
                height: '100vh',
                maxWidth: '430px',
                minWidth: '320px',
                aspectRatio: '9/19.5',
                background: 'var(--bg-main)',
                boxShadow: '0 0 32px 0 #0c1337cc',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {children}
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
