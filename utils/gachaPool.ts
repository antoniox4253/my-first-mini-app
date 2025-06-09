// src/utils/gachaPool.ts
export type RarezaType = "comun" | "pocoComun" | "raro" | "epico" | "legendario";

const poolInit: Record<RarezaType, {
  total: number;
  left: number;
  personajes: string[];
}> = {
  comun: {
    total: 5000,  left: 5000,
    personajes: [
      "Recluta del Gremio",
      "Explorador Novato",
      "Aprendiz de Cazador",
      "Viajero Solitario",
      "Aspirante a Héroe"
    ]
  },
  pocoComun: {
    total: 3000,  left: 3000,
    personajes: [
      "Rastreador de Bestias",
      "Guardián de Ruinas",
      "Guerrero de la Niebla",
      "Cazador Urbano",
      "Acechador Nocturno"
    ]
  },
  raro: {
    total: 1000,  left: 1000,
    personajes: [
      "Cazador de Rango B",
      "Cazador de Rango A",
      "Portador de Maldición"
    ]
  },
  epico: {
    total: 800,   left: 800,
    personajes: [
      "Señor del Acero",
      "Maestro de Invocaciones",
      "Fénix Carmesí"
    ]
  },
  legendario: {
    total: 200,   left: 200,
    personajes: [
      "Monarca de la Destrucción",
      "Monarca de las Sombras"
    ]
  }
};

const LS_KEY = "gachaPoolStock";
function loadPool(): typeof poolInit {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return structuredClone(poolInit); // fallback al inicial
}
function savePool(pool: typeof poolInit) {
  localStorage.setItem(LS_KEY, JSON.stringify(pool));
}

export function getPool() {
  return loadPool();
}
export function updatePool(fn: (pool: typeof poolInit) => void) {
  const pool = loadPool();
  fn(pool);
  savePool(pool);
}

export function resetPool() {
  savePool(structuredClone(poolInit));
}
