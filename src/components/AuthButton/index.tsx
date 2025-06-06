'use client';
import { walletAuth } from '@/auth/wallet';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useEffect, useState } from 'react';

interface AuthButtonProps {
  onStuck?: () => void;
}

export const AuthButton = ({ onStuck }: AuthButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isInstalled } = useMiniKit();

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) return;

    setIsPending(true);
    try {
      await walletAuth();
      setIsAuthenticated(true); // ✅ Autenticación exitosa
    } catch (error) {
      console.error('Wallet authentication button error', error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending) {
        setIsPending(true);
        try {
          await walletAuth();
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auto wallet authentication error', error);
        } finally {
          setIsPending(false);
        }
      }
    };
    authenticate();
  }, [isInstalled, isPending]);

  // 🛑 Aquí va la corrección: timeout solo si sigue pendiente y no autenticado
  useEffect(() => {
    if (!isPending || isAuthenticated) return;

    const timeout = setTimeout(() => {
      console.warn('⏳ Tiempo de espera agotado. Ejecutando onStuck...');
      if (!isAuthenticated) onStuck?.();
    }, 15000);

    return () => clearTimeout(timeout);
  }, [isPending, isAuthenticated, onStuck]);

  return (
    <LiveFeedback
      label={{
        failed: 'Failed to login',
        pending: 'Logging in',
        success: 'Logged in',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isPending}
        size="lg"
        variant="primary"
      >
        Login with Wallet
      </Button>
    </LiveFeedback>
  );
};
