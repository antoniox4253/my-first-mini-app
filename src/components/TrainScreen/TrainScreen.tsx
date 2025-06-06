import React, { useState, useEffect, useRef } from 'react';
import TopBar from './TopBar';
import MenuBar from './MenuBar';
import { useNavigate } from 'react-router-dom';

// ---- TYPES ----
export type Stats = {
  vida: number;
  energia: number;
  mana: number;
  poder: number;
  suerte: number;
  velocidad: number;
  defensa: number;
};
export type StatKey = keyof Stats;

interface Personaje {
  id: string;
  tipo: string;
  nombre: string;
  activo: boolean;
  nivel: number;
  experiencia: number;
  experienciaNecesaria: number;
  statsBase: Stats;
  statsExtra: Stats;
  vidaActual: number;
  manaActual: number;
  energiaActual: number;
  img: string;
  rareza?: string;
  equipamiento?: Record<string, any>;
  misionActiva: false, //
}

interface DropItem {
  title: string;
  itemCode: string;
  tipo: string;
  img?: string;
  value?: number;
  res?: boolean;
}

interface TrainScreenProps {
  username: string;
  inventario: Personaje[];
  setInventario: React.Dispatch<React.SetStateAction<any[]>>;
  realmTokens: number;
  setRealmTokens: React.Dispatch<React.SetStateAction<number>>;
  wldTokens: number;
  setWldTokens: React.Dispatch<React.SetStateAction<number>>;
  vida: number;
  mana: number;
  energia: number;
}

// ------------ MISIONS ------------

const POWER_MISSIONS = [
  { key: 'vida', label: 'Entrenar Vida', category: 'Poder', stat: 'vida', mejora: 10, tiempo: 2, energiaCost: 8, exito: 1, dificultad: 'Leve' },
  { key: 'poder', label: 'Entrenar Poder', category: 'Poder', stat: 'poder', mejora: 6, tiempo: 4, energiaCost: 12, exito: 1, dificultad: 'Leve' },
  { key: 'energia', label: 'Entrenar Energía', category: 'Poder', stat: 'energia', mejora: 15, tiempo: 2, energiaCost: 10, exito: 0.5, dificultad: 'Leve' },
];
const PSIQUE_MISSIONS = [
  { key: 'mana', label: 'Entrenar Mana', category: 'Psique', stat: 'mana', mejora: 10, tiempo: 2, energiaCost: 10, exito: 1, dificultad: 'Leve' },
  { key: 'suerte', label: 'Entrenar Suerte', category: 'Psique', stat: 'suerte', mejora: 4, tiempo: 4, energiaCost: 14, exito: 1, dificultad: 'Leve' },
];
const COMBINADAS_MISSIONS = [
  {
    key: 'combo-6',
    label: 'Misión Combinada (6h)',
    category: 'Combinada',
    stats: ['velocidad', 'poder'] as StatKey[],
    mejora: [3, 4],
    tiempo: 6,
    energiaCost: 22,
    exito: 0.85,
    dificultad: 'Moderada',
    poderMin: 20,
    drop: {
      prob: 1,
      items: [
        { title: "Mana x50", itemCode: "codmana50", tipo: "consumible", img: "/store/mana.png", value: 50 },
        { title: "Mana x100", itemCode: "codmana100", tipo: "consumible", img: "/store/mana.png", value: 100 },
        { title: "Vida x50", itemCode: "codvida50", tipo: "consumible", img: "/store/vida.png", value: 50 },
        { title: "Vida x100", itemCode: "codvida100", tipo: "consumible", img: "/store/vida.png", value: 100 },
        { title: "Energía x20", itemCode: "codenergia20", tipo: "consumible", img: "/store/energia.png", value: 20 },
        { title: "Realm", itemCode: "realm_reward", tipo: "token", value: 30 }
      ]
    }
  },
  {
    key: 'combo-12',
    label: 'Misión Legendaria (12h)',
    category: 'Combinada',
    stats: ['velocidad', 'mana', 'suerte'] as StatKey[],
    mejora: [6, 8, 7],
    tiempo: 12,
    energiaCost: 32,
    exito: 0.7,
    dificultad: 'Difícil',
    poderMin: 20,
    drop: {
      prob: 1,
      items: [
        { title: "Espada Épica", itemCode: "codespada", tipo: "equipamiento", img: "/store/espada.png" },
        { title: "Armadura Oscura", itemCode: "codarmadura", tipo: "equipamiento", img: "/store/armadura.png" }
      ]
    }
  }
];
const statLabel: Record<StatKey, string> = {
  vida: "Vida", energia: "Energía", mana: "Mana", poder: "Poder", suerte: "Suerte", velocidad: "Velocidad", defensa: "Defensa"
};
const dificultadColor: Record<string, string> = { Leve: "#c7fd8e", Moderada: "#2cc0fa", Difícil: "#ffe94d" };

// ------------ STORAGE UTILS ------------
function saveTrainState(obj: any) { localStorage.setItem("trainStatus", JSON.stringify(obj)); }
function loadTrainState() { try { return JSON.parse(localStorage.getItem("trainStatus") || "null"); } catch { return null; } }
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function getTrainStatCount(stat: StatKey, personajeId: string) {
  const data = JSON.parse(localStorage.getItem("trainStatCount") || '{}');
  const today = getTodayKey();
  return (data[personajeId]?.[stat]?.[today]) ?? 0;
}
function increaseTrainStatCount(stat: StatKey, personajeId: string) {
  const data = JSON.parse(localStorage.getItem("trainStatCount") || '{}');
  const today = getTodayKey();
  if (!data[personajeId]) data[personajeId] = {};
  if (!data[personajeId][stat]) data[personajeId][stat] = {};
  data[personajeId][stat][today] = (data[personajeId][stat][today] ?? 0) + 1;
  localStorage.setItem("trainStatCount", JSON.stringify(data));
}

// --------- COMPONENTE DE POPUP DE STATS ---------
const StatsPopup = ({ personaje, statTotals, onClose }: {
  personaje: Personaje,
  statTotals: Stats,
  onClose: () => void
}) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 20000,
    background: 'rgba(10,16,40,0.88)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{
      background: 'linear-gradient(120deg, #181d2a 75%, #232940 120%)',
      borderRadius: 16,
      boxShadow: '0 8px 32px #151d2fbb',
      padding: '1.4em 1em 1.2em 1em',
      color: '#fff',
      maxWidth: 310,
      minWidth: 190,
      border: '4px solid #39aaff',
      position: 'relative'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 12,
          background: 'linear-gradient(90deg,#ffe94d 50%,#39aaff 100%)',
          color: '#232940',
          border: 'none',
          borderRadius: 8,
          fontWeight: 900,
          fontSize: 15,
          padding: '0.15em 0.7em',
          boxShadow: '0 1px 7px #39aaff60',
          cursor: 'pointer'
        }}
      >Cerrar</button>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <img src={personaje.img} alt={personaje.nombre}
          style={{
            width: 38, height: 38, borderRadius: 10, marginRight: 10, objectFit: 'contain',
            border: '2px solid #ffe94d', background: '#191f33', boxShadow: '0 1px 6px #23294066'
          }} />
        <div>
          <div style={{ fontWeight: 900, color: '#39aaff', fontSize: 16, letterSpacing: 1 }}>{personaje.nombre}</div>
          <div style={{ color: '#ffe94d', fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>{personaje.rareza}</div>
        </div>
      </div>
      {/* Totales y actuales en bloques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 7 }}>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Vida</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#ffe94d',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.vida} <span style={{
            color: '#aaa', fontSize: 11, fontWeight: 600
          }}>/ {personaje.vidaActual}</span>
          </div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Mana</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#39aaff',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.mana} <span style={{
            color: '#aaa', fontSize: 11, fontWeight: 600
          }}>/ {personaje.manaActual}</span>
          </div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Energía</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#7fdaff',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.energia} <span style={{
            color: '#aaa', fontSize: 11, fontWeight: 600
          }}>/ {personaje.energiaActual}</span>
          </div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Poder</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#ffe94d',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.poder}</div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Suerte</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#c7fd8e',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.suerte}</div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Velocidad</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#e67cff',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.velocidad}</div>
        </div>
        <div>
          <div style={{ color: '#aeefff', fontWeight: 800, fontSize: 12, marginBottom: 1 }}>Defensa</div>
          <div style={{
            fontWeight: 900, fontSize: 14, color: '#fff',
            textShadow: '0 2px 6px #0009'
          }}>{statTotals.defensa}</div>
        </div>
      </div>
      <div style={{
        fontWeight: 600,
        color: "#39aaff",
        fontSize: 12,
        marginTop: 8,
        letterSpacing: 0.6,
        textAlign: "center"
      }}>
        <span style={{ color: "#ffe94d" }}>Stats Totales:</span> base + mejoras extra.<br />
        <span style={{ color: "#aeefff" }}>Actual</span> = valor restante tras batallas o uso.
      </div>
    </div>
  </div>
);

// ------------ MAIN COMPONENT ------------
const TrainScreen: React.FC<TrainScreenProps> = ({
  username, inventario, setInventario,
  realmTokens, setRealmTokens,
  wldTokens, setWldTokens
}) => {
  const navigate = useNavigate();
  const personaje = Array.isArray(inventario) ? inventario.find(p => p.tipo === "personaje" && p.activo) as Personaje : undefined;

  const [tab, setTab] = useState<number>(0);
  const [status, setStatus] = useState<'inicio' | 'entrenando' | 'finalizado'>(loadTrainState()?.status || 'inicio');
  const [train, setTrain] = useState<any>(loadTrainState()?.train || null);
  const [endTime, setEndTime] = useState<number | null>(loadTrainState()?.endTime || null);
  const [leftMs, setLeftMs] = useState<number>(0);
  const [lastMsg, setLastMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  // POPUP: Drop visual
  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const [dropPopup, setDropPopup] = useState<DropItem | null>(null);

  // --- Nuevo: Popup de stats
  const [showStatsPopup, setShowStatsPopup] = useState(false);

  const trainingDone = useRef(false);

  useEffect(() => { trainingDone.current = false; }, [train, status]);

  useEffect(() => {
    let finished = false;
    if (status === 'entrenando' && endTime) {
      const timer = setInterval(() => {
        const ms = endTime - Date.now();
        setLeftMs(ms > 0 ? ms : 0);
        if (ms <= 0 && !finished && !trainingDone.current) {
          finished = true;
          setStatus('finalizado');
          setTimeout(() => handleFinish(), 80);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
    if (status === 'finalizado' && train && !trainingDone.current) {
      setTimeout(() => handleFinish(), 80);
    }
  }, [status, endTime]);

  useEffect(() => {
    saveTrainState({ status, train, endTime });
  }, [status, train, endTime]);

  // Iniciar entrenamiento
  const handleStart = (cfg: any) => {
    if (!personaje) return;
    if (cfg.poderMin && calcularStatsTotales(personaje).poder < cfg.poderMin) {
      setLastMsg(`Necesitas al menos ${cfg.poderMin} de poder para esta misión.`);
      return;
    }
    if (cfg.key === "vida" || cfg.key === "energia") {
      if (getTrainStatCount(cfg.key as StatKey, personaje.id) >= 3) {
        setLastMsg(`Alcanzaste el límite máximo de entrenamientos de ${statLabel[cfg.key as StatKey]} por día (3/3)`);
        return;
      }
      increaseTrainStatCount(cfg.key as StatKey, personaje.id);
    }
    if (personaje.energiaActual < cfg.energiaCost) return;
    setInventario((prev: any[]) =>
      prev.map((item: Personaje) =>
        item.id === personaje.id
          ? { ...item, energiaActual: Math.max(0, item.energiaActual - cfg.energiaCost) }
          : item
      )
    );
    setTrain(cfg);
    setStatus('entrenando');
    setEndTime(Date.now() + cfg.tiempo * 60 * 60 * 1000);
    setLastMsg(null);
    trainingDone.current = false;
  };
  let isExito = true;
  // Acelerar
  const handleAcelerar = () => setShowConfirm(true);
  const confirmarAcelerar = () => {
    if (realmTokens < 50 || status !== 'entrenando' || !endTime) return;
    setRealmTokens(t => t - 50);
    const newEndTime = Math.max(Date.now(), endTime - 30 * 60 * 1000);
    setEndTime(newEndTime);
    setShowConfirm(false);
    if (newEndTime <= Date.now() && !trainingDone.current) {
      setLeftMs(0);
      setStatus('finalizado');
    }
  };
  
  // FINALIZAR (solo 1 recompensa)
  const handleFinish = () => {
    if (trainingDone.current || !train || !personaje) return;
    trainingDone.current = true;
    let msg = '';
    let dropMsg = '';
    let dropItem: DropItem | null = null;

    // --- ÉXITO O FALLO (solo para energía, random) ---
    let isExito = true;
    if (train.stat === "energia" && train.exito < 1) {
      isExito = Math.random() < train.exito;
      console.log(isExito ? "Éxito" : "Fallo");
    }

    setInventario((prev: Personaje[]) =>
      prev.map((item) => {
        if (item.id !== personaje.id) return item;
        let newStatsExtra = { ...item.statsExtra };
        let newVidaActual = item.vidaActual;
        let newManaActual = item.manaActual;
        let newEnergiaActual = item.energiaActual;

        if (train.stat) {
          if (isExito) {
            newStatsExtra[train.stat as StatKey] = (item.statsExtra[train.stat as StatKey] ?? 0) + (train.mejora || 0);

            const tot = calcularStatsTotales({ ...item, statsExtra: newStatsExtra });
            if (train.stat === "vida") newVidaActual = Math.min(tot.vida, item.vidaActual + train.mejora);
            if (train.stat === "mana") newManaActual = Math.min(tot.mana, item.manaActual + train.mejora);
            if (train.stat === "energia") newEnergiaActual = Math.min(tot.energia, item.energiaActual + train.mejora);
          }
        }
        if (train.stats) {
          train.stats.forEach((s: string, i: number) => {
            newStatsExtra[s as StatKey] = (item.statsExtra[s as StatKey] ?? 0) + (train.mejora[i] || 0);
          });
        }
        // 20% chance de perder vida (daño 3% del total ganado, mínimo 1)
        let vidaPerdida = 0;
        const pierdeVida = Math.random() < 0.20 && (train.stat === "vida" || train.stats);
        if (pierdeVida) {
          let totalGanado = 0;
          if (train.stat) totalGanado = train.mejora;
          else if (train.stats) totalGanado = train.mejora.reduce((a: number, b: number) => a + b, 0);
          vidaPerdida = Math.max(1, Math.round(totalGanado * 0.03));
          const tot = calcularStatsTotales({ ...item, statsExtra: newStatsExtra });
          newVidaActual = Math.max(1, Math.min(tot.vida, newVidaActual - vidaPerdida));
        }
        return {
          ...item,
          statsExtra: newStatsExtra,
          vidaActual: newVidaActual,
          manaActual: newManaActual,
          energiaActual: newEnergiaActual
        };
      })
    );

    // --- DROP LOGIC (igual que antes) ---
    if (train.drop && Array.isArray(train.drop.items)) {
      if (Math.random() < train.drop.prob) {
        const randomIdx = Math.floor(Math.random() * train.drop.items.length);
        const drop = train.drop.items[randomIdx] as DropItem | null;

        if (drop) {
          const itemToAdd: DropItem = { ...drop };
          if (itemToAdd.tipo === "token") {
            const tokenValue = itemToAdd.value || 0;
            if (itemToAdd.itemCode === "realm_reward") {
              setRealmTokens((prev: number) => prev + tokenValue);
            } else if (itemToAdd.itemCode === "wld_reward") {
              setWldTokens((prev: number) => prev + tokenValue);
            }
          } else if (itemToAdd.tipo === "consumible") {
                // Siempre agrega un nuevo item, sin buscar si existe antes.
                setInventario(inv => [
                  ...inv,
                  { ...itemToAdd, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) }
                ]);
              } else {
            setInventario((inv: any[]) => [
              ...inv,
              { ...itemToAdd, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) }
            ]);
          }
          dropMsg = ` | Drop: ${itemToAdd.title} `;
          dropItem = itemToAdd;
          setDropPopup(itemToAdd);
        }
      }
    }

    // ---- MENSAJE FINAL ----
    if (isExito) {
      msg = `✔️ Entrenamiento exitoso. `;
      if (train.stat) msg += `+${train.mejora} ${statLabel[train.stat as StatKey]}`;
      if (train.stats) msg += train.stats.map((s: string, i: number) => `+${train.mejora[i]} ${statLabel[s as StatKey]}`).join(', ');
      if (dropMsg) msg += dropMsg;
    } else {
      msg = `❌ Entrenamiento fallido. No lograste mejorar tu ${statLabel[train.stat as StatKey] || 'estadística'}.`;
    }

    setPopupMsg(msg);
    if (dropItem) setDropPopup(dropItem);
    setLastMsg(null);
    setStatus('inicio');
    setTrain(null);
    setEndTime(null);
    setLeftMs(0);
    saveTrainState({ status: 'inicio', train: null, endTime: null });
  };

  if (!personaje) {
    return (
      <>
        <TopBar username={username} />
        <div style={{
          width: '100%', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          background: '#191f33', color: '#fff'
        }}>
          <h2>No tienes personaje activo</h2>
          <button onClick={() => navigate('/inventory')}
            style={{ marginTop: 18, background: '#39aaff', color: '#191f33', fontWeight: 700, padding: '0.6em 1.3em', borderRadius: 8, border: 'none' }}>
            Ir a Inventario
          </button>
        </div>
        <MenuBar selected="train" onSelect={menuKey => navigate(menuKey === 'home' ? '/' : `/${menuKey}`)} />
      </>
    );
  }

  // -- Calcula stats totales sumando base + extra
  function calcularStatsTotales(pj: Personaje): Stats {
    return {
      vida: (pj.statsBase.vida ?? 0) + (pj.statsExtra.vida ?? 0),
      energia: (pj.statsBase.energia ?? 0) + (pj.statsExtra.energia ?? 0),
      mana: (pj.statsBase.mana ?? 0) + (pj.statsExtra.mana ?? 0),
      poder: (pj.statsBase.poder ?? 0) + (pj.statsExtra.poder ?? 0),
      suerte: (pj.statsBase.suerte ?? 0) + (pj.statsExtra.suerte ?? 0),
      velocidad: (pj.statsBase.velocidad ?? 0) + (pj.statsExtra.velocidad ?? 0),
      defensa: (pj.statsBase.defensa ?? 0) + (pj.statsExtra.defensa ?? 0),
    };
  }

  const statValues = calcularStatsTotales(personaje);
  const TABS = [
    { label: "Poder", color: "#39aaff", data: POWER_MISSIONS },
    { label: "Psique", color: "#aeefff", data: PSIQUE_MISSIONS },
    { label: "Combinadas", color: "#ffe94d", data: COMBINADAS_MISSIONS }
  ];

  return (
    <>
      <TopBar username={username} />
      <div style={{
        width: '100%', minHeight: '100vh',
        background: '#181d2a', color: '#fff',
        paddingTop: 65, paddingBottom: 60, maxWidth: 430, margin: '0 auto'
      }}>
        {/* --- Personaje activo --- */}
        <div style={{
          background: '#20222b', borderRadius: 14, boxShadow: '0 4px 12px #0c1337aa',
          padding: '0.8em 0.8em', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', minHeight: 52, maxHeight: 70
        }}>
          <img src={personaje.img} alt={personaje.nombre} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 9, objectFit: 'contain', background: '#181d2a' }} />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            minHeight: 40,
          }}>
            {/* Columna izquierda */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1, minWidth: 65 }}>
              <div style={{ color: '#39aaff', fontWeight: 700, fontSize: 15, letterSpacing: 0.4 }}>{personaje.nombre}</div>
              <div style={{ color: '#ffe94d', fontWeight: 700, fontSize: 12, marginBottom: 2, textShadow: '0 1px 6px #181d2a' }}>{personaje.rareza}</div>
              <button
                onClick={() => setShowStatsPopup(true)}
                style={{
                  background: 'linear-gradient(90deg,#39aaff 60%,#ffe94d 120%)',
                  color: '#232940',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 12,
                  padding: '0.27em 0.7em',
                  cursor: 'pointer',
                  marginBottom: 2,
                  marginTop: 1,
                  boxShadow: '0 1px 6px #39aaff44'
                }}
              >
                Stats
              </button>
            </div>
            {/* Divisor vertical */}
            <div style={{
              width: 1,
              minHeight: 36,
              borderRadius: 3,
              background: 'linear-gradient(180deg, #39aaff 0%, #ffe94d 100%)',
              boxShadow: '0 0 7px #39aaff55',
              margin: '0 2px'
            }} />
            {/* Columna derecha: Mini resumen con bordes luminosos */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              justifyContent: 'flex-start',
              minWidth: 80,
              flex: 1
            }}>
              {/* VIDA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '2px 7px 2px 6px',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 11,
                color: '#ffe94d',
                background: '#20222b',
                boxShadow: '0 1px 6px #ffe94d33, 0 0 0 2px #ffe94d22',
                border: '1.2px solid #ffe94d44',
                letterSpacing: 0.2,
                textShadow: '0 2px 6px #191f3390'
              }}>
                <span>Vida</span>
                <span>{statValues.vida} / <span style={{ color: '#fff' }}>{personaje.vidaActual}</span></span>
              </div>
              {/* MANA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '2px 7px 2px 6px',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 11,
                color: '#39aaff',
                background: '#20222b',
                boxShadow: '0 1px 6px #39aaff44, 0 0 0 2px #39aaff18',
                border: '1.2px solid #39aaff44',
                letterSpacing: 0.2,
                textShadow: '0 2px 6px #191f3390'
              }}>
                <span>Mana</span>
                <span>{statValues.mana} / <span style={{ color: '#fff' }}>{personaje.manaActual}</span></span>
              </div>
              {/* ENERGÍA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '2px 7px 2px 6px',
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 11,
                color: '#7fdaff',
                background: '#20222b',
                boxShadow: '0 1px 6px #7fdaff66, 0 0 0 2px #7fdaff18',
                border: '1.2px solid #7fdaff44',
                letterSpacing: 0.2,
                textShadow: '0 2px 6px #191f3390'
              }}>
                <span>Energía</span>
                <span>{statValues.energia} / <span style={{ color: '#fff' }}>{personaje.energiaActual}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          background: 'linear-gradient(90deg,#232940 60%,#283b65 110%)',
          borderRadius: 13, boxShadow: '0 2px 8px #39aaff15', marginBottom: 7, padding: '0.35em 0.2em 0.35em 0.2em'
        }}>
          <StatLabel title="Realm" value={realmTokens} color="#47e7ff" />
          <div style={{
            width: '1px',
            height: '2em',
            backgroundColor: '#666',
            margin: '0 0.7em'
          }} />
          <StatLabel title="WLD" value={typeof wldTokens === 'number' ? wldTokens : 0} color="#ffe94d" />
        </div>

        {/* POPUP MENSAJE DE EXITO */}
        {popupMsg && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(10,16,40,0.81)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: '#181d2a',
              borderRadius: 14,
              boxShadow: '0 1px 13px #13161c88',
              color: '#ffe94d',
              fontWeight: 800,
              fontSize: 14,
              padding: '1.4em 1.1em 1.0em 1.1em',
              maxWidth: 300,
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: dropPopup ? 5 : 12 }}>{popupMsg}</div>
              {dropPopup && (
                <div style={{
                  marginBottom: 11, marginTop: 3,
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                  {dropPopup.img &&
                    <img src={dropPopup.img} alt={dropPopup.title}
                      style={{
                        width: 38, height: 38, borderRadius: 8, boxShadow: '0 1px 5px #39aaff44',
                        marginBottom: 4, objectFit: 'contain', background: '#222'
                      }} />}
                  <div style={{ color: "#aeefff", fontWeight: 900, fontSize: 15 }}>
                    {dropPopup.title || ""}
                  </div>
                  <div style={{
                    color: dropPopup.tipo === "token" ? "#ffe94d" : "#c7fd8e",
                    fontWeight: 700,
                    fontSize: 12,
                  }}>
                    {dropPopup.tipo === "token"
                      ? "¡Agregado al balance!"
                      : "¡Agregado al inventario!"}
                  </div>
                </div>
              )}
              <button
                style={{
                  background: 'linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)',
                  color: '#232940',
                  fontWeight: 900,
                  fontSize: 13,
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.4em 0.9em',
                  cursor: 'pointer',
                  boxShadow: '0 1px 7px #39aaff44',
                  marginTop: 2
                }}
                onClick={() => {
                  setPopupMsg(null);
                  setDropPopup(null);
                }}
              >Cerrar</button>
            </div>
          </div>
        )}

        {/* POPUP DE STATS DETALLADO */}
        {showStatsPopup && (
          <StatsPopup
            personaje={personaje}
            statTotals={statValues}
            onClose={() => setShowStatsPopup(false)}
          />
        )}

        {/* --- Tabs secciones --- */}
        <div style={{ display: 'flex', marginBottom: 12, gap: 3 }}>
          {TABS.map((t, idx) => (
            <button
              key={t.label}
              style={{
                background: tab === idx ? `linear-gradient(90deg,${t.color} 60%,#232940 110%)` : '#232940',
                color: tab === idx ? '#191f33' : t.color,
                fontWeight: 800,
                fontSize: 13,
                padding: '0.47em 0.75em',
                border: 'none',
                borderRadius: 8,
                marginRight: 3,
                boxShadow: tab === idx ? '0 1px 7px #39aaff22' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setTab(idx)}
            >{t.label}</button>
          ))}
        </div>

        {/* --- Lista de entrenamientos (vertical scroll) --- */}
        <div style={{ maxHeight: 310, overflowY: 'auto', paddingRight: 2 }}>
          {status === 'entrenando' && leftMs > 0 && (
            <div style={{
              background: '#13161c',
              borderRadius: 10,
              boxShadow: '0 2px 7px #39aaff44',
              padding: 13,
              textAlign: 'center',
              marginBottom: 10
            }}>
              <h3 style={{ color: '#39aaff', marginBottom: 5, fontSize: 15 }}>{train.label}</h3>
              <div style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                margin: "7px 0"
              }}>
                Tiempo restante: {new Date(leftMs).toISOString().substr(11, 8)}
              </div>
              <div>
                <button
                  onClick={handleAcelerar}
                  disabled={realmTokens < 50 || leftMs <= 0}
                  style={{
                    marginRight: 11,
                    background: 'linear-gradient(90deg,#ffe94d 70%,#ffec8b 100%)',
                    color: '#191f33',
                    fontWeight: 800,
                    borderRadius: 7,
                    fontSize: 12,
                    padding: '0.4em 1em',
                    border: 'none',
                    margin: 8,
                    cursor: realmTokens < 50 || leftMs <= 0 ? 'not-allowed' : 'pointer',
                    opacity: realmTokens < 50 || leftMs <= 0 ? 0.6 : 1
                  }}>
                  Acelerar (-50 Realm, -30 min)
                </button>
                {showConfirm && (
                  <div style={{
                    background: '#13161c',
                    border: '1px solid #4d9aff',
                    color: '#ffe94d',
                    padding: 10,
                    borderRadius: 7,
                    marginTop: 7
                  }}>
                    <div>¿Seguro que quieres gastar 50 Realm para acelerar 30 minutos?</div>
                    <button
                      style={{
                        margin: 5,
                        fontWeight: 700,
                        background: '#ffe94d',
                        color: '#232940',
                        borderRadius: 6,
                        padding: '0.3em 0.7em',
                        border: 'none',
                        fontSize: 12
                      }}
                      onClick={confirmarAcelerar}
                    >Sí</button>
                    <button
                      style={{
                        margin: 5,
                        fontWeight: 700,
                        background: '#232940',
                        color: '#ffe94d',
                        borderRadius: 6,
                        padding: '0.3em 0.7em',
                        border: 'none',
                        fontSize: 12
                      }}
                      onClick={() => setShowConfirm(false)}
                    >No</button>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setShowConfirmFinish(true)}
                  disabled={wldTokens < 2}
                  style={{
                    background: 'linear-gradient(90deg,#ffe94d 60%,#ffe94d 100%)',
                    color: '#191f33',
                    fontWeight: 800,
                    borderRadius: 7,
                    fontSize: 12,
                    padding: '0.4em 1em',
                    border: 'none',
                    margin: 8,
                    cursor: wldTokens < 2 ? 'not-allowed' : 'pointer',
                    opacity: wldTokens < 2 ? 0.6 : 1
                  }}>
                  Finalizar Entrenamiento (2 WLD)
                </button>
                {showConfirmFinish && (
                  <div style={{
                    background: '#13161c',
                    border: '1px solid #ffe94d',
                    color: '#ffe94d',
                    padding: 10,
                    borderRadius: 7,
                    marginTop: 7
                  }}>
                    <div>¿Seguro que quieres terminar el entrenamiento antes de tiempo por 2 WLD?</div>
                    <button
                      style={{
                        margin: 5,
                        fontWeight: 700,
                        background: '#ffe94d',
                        color: '#232940',
                        borderRadius: 6,
                        padding: '0.3em 0.7em',
                        border: 'none',
                        fontSize: 12
                      }}
                      onClick={() => {
                        if (wldTokens >= 2) {
                          setWldTokens(w => w - 2);
                          setLeftMs(0);
                          handleFinish();
                        }
                        setShowConfirmFinish(false);
                      }}
                    >Sí</button>
                    <button
                      style={{
                        margin: 5,
                        fontWeight: 700,
                        background: '#232940',
                        color: '#ffe94d',
                        borderRadius: 6,
                        padding: '0.3em 0.7em',
                        border: 'none',
                        fontSize: 12
                      }}
                      onClick={() => setShowConfirmFinish(false)}
                    >No</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {status !== 'entrenando' && (
            TABS[tab].data.map((t: any, i: number) => {
              const disabled = personaje.energiaActual < t.energiaCost;
              const isVida = t.key === "vida";
              const isEnergia = t.key === "energia";
              const statLimit = (isVida && getTrainStatCount("vida" as StatKey, personaje.id) >= 3)
                || (isEnergia && getTrainStatCount("energia" as StatKey, personaje.id) >= 3);
              const poderRequerido = t.poderMin && statValues.poder < t.poderMin;
              return (
                <div key={t.key} style={{
                  background: '#232940', borderRadius: 9, boxShadow: '0 2px 7px #13161c44',
                  padding: '9px 8px', marginBottom: 9, opacity: disabled || statLimit || poderRequerido ? 0.5 : 1
                }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: TABS[tab].color, marginBottom: 2 }}>{t.label}</div>
                  <div style={{ color: dificultadColor[t.dificultad], fontWeight: 700, marginBottom: 3, fontSize: 12 }}>{t.dificultad}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
                    {t.stat
                      ? `+${t.mejora} ${statLabel[t.stat as StatKey]}`
                      : t.stats.map((s: string, idx: number) => `+${t.mejora[idx]} ${statLabel[s as StatKey]}`).join(', ')}
                  </div>
                  <div style={{ fontSize: 12, color: '#aeefff', marginBottom: 4 }}>
                    Tiempo: {t.tiempo}h · <b>Energía -{t.energiaCost}</b>
                    {t.exito < 1 && <> · Éxito {Math.round(t.exito * 100)}%</>}
                    {t.drop && <> · Drop: 100% </>}
                    {t.poderMin && <> · Poder mínimo: {t.poderMin}</>}
                    {isVida && <> · <span style={{ color: "#ffe94d" }}>Hoy: {getTrainStatCount("vida" as StatKey, personaje.id)}/3</span></>}
                    {isEnergia && <> · <span style={{ color: "#ffe94d" }}>Hoy: {getTrainStatCount("energia" as StatKey, personaje.id)}/3</span></>}
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(90deg,#39aaff 60%,#31bc47 100%)',
                      color: '#fff', border: 'none', borderRadius: 8, padding: '0.5em 1em',
                      fontWeight: 800, fontSize: 13, cursor: disabled || statLimit || poderRequerido ? 'not-allowed' : 'pointer', opacity: disabled || statLimit || poderRequerido ? 0.7 : 1
                    }}
                    disabled={disabled || statLimit || poderRequerido}
                    onClick={() => handleStart(t)}
                  >Iniciar Entrenamiento</button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <MenuBar selected="train" onSelect={menuKey => navigate(menuKey === 'home' ? '/' : `/${menuKey}`)} />
    </>
  );
};

const StatLabel = ({ title, value, color }: { title: string, value: number, color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 36 }}>
    <div style={{ color, fontWeight: 700, fontSize: 11, textShadow: '0 1px 4px #0009' }}>{title}</div>
    <div style={{ color: '#fff', fontWeight: 900, fontSize: 12, textShadow: '0 2px 8px #0009' }}>{value ?? '-'}</div>
  </div>
);

export default TrainScreen;
