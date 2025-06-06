import { useCallback, useEffect } from "react";
import usePersistedState from "./usePersistedState";

// Definición del tipo
export type MissionSlot = {
  id: number;
  activo: boolean;
  ocupado: boolean;
  fin?: number;
  personajeId?: string;
};

const initialSlots: MissionSlot[] = [
  { id: 1, activo: true, ocupado: false },
  { id: 2, activo: true, ocupado: false },
  { id: 3, activo: true, ocupado: false },
  { id: 4, activo: true, ocupado: false },
  { id: 5, activo: false, ocupado: false },
  { id: 6, activo: false, ocupado: false },
];

// El hook
export default function useMissionSlots() {
  const [slots, setSlots] = usePersistedState<MissionSlot[]>("missionSlots", initialSlots);

  // ------------- AUTO-LIBERACIÓN -----------------
  useEffect(() => {
    // setInterval para chequear si hay slots ocupados con tiempo vencido
    const timer = setInterval(() => {
      setSlots(prev =>
        prev.map(slot =>
          slot.ocupado && slot.fin && Date.now() > slot.fin
            ? { ...slot, ocupado: false, fin: undefined, personajeId: undefined }
            : slot
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [setSlots]);

  // ---------- LÓGICA UTILITARIA --------------
  // Libera un slot manualmente
  const liberarSlot = useCallback((slotId: number) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, ocupado: false, fin: undefined, personajeId: undefined } : slot
      )
    );
  }, [setSlots]);

  // Enviar a misión (marcar como ocupado)
  const enviarAMision = useCallback((slotId: number, personajeId: string, duracionMs: number) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { ...slot, ocupado: true, fin: Date.now() + duracionMs, personajeId }
          : slot
      )
    );
  }, [setSlots]);

  // Desbloquear un slot (pago)
  const desbloquearSlot = useCallback((slotId: number) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, activo: true } : slot
      )
    );
  }, [setSlots]);

  // Tiempo restante para un slot
  const getTimeLeft = useCallback((slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.ocupado || !slot.fin) return 0;
    return Math.max(0, slot.fin - Date.now());
  }, [slots]);

  return {
    slots,
    setSlots,
    liberarSlot,
    enviarAMision,
    desbloquearSlot,
    getTimeLeft,
  };
}
