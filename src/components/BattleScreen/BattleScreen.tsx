import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import MenuBar from './MenuBar';
import { useNavigate } from 'react-router-dom';
import { getEnemyByLevel, enemyAction } from './EnemyLevelManager';
import usePersistedState from "../hooks/usePersistedState";
import { statsBasePorPersonaje, statsPorNivel, xpPorNivel, xpNecesaria } from "../utils/progresionPersonaje";


// ----------- COMPONENTES VISUALES -----------

const CardHero = ({ player }: any) => (
  <div style={{
    background: "linear-gradient(110deg,#222b42 80%,#131b24 120%)",
    border: "3px solid #39aaff", borderRadius: 14,
    boxShadow: "0 1px 20px #39aaff2b",
    minWidth: 120, padding: "13px 11px 8px 11px", display: "flex", flexDirection: "column", alignItems: "center"
  }}>
    <img src={player.img || "/store/noimg.png"} alt={player.nombre}
      style={{ width: 46, height: 46, borderRadius: 11, marginBottom: 5, border: "2.5px solid #39aaff", objectFit: "contain", background: "#0b0f13" }} />
    <div style={{ fontWeight: 900, color: "#39aaff", fontSize: 16, marginBottom: 2 }}>{player.nombre}</div>
    <div style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>
      <span style={{
        background: "#ffe94d", color: "#191f33", borderRadius: 5, fontWeight: 800, padding: "2px 9px"
      }}>Vida: {player.vida} / {player.maxVida}</span>
    </div>
    <div style={{ fontWeight: 800, color: "#fff", fontSize: 13, marginTop: 2 }}>
      <span style={{
        background: "#39aaff", color: "#fff", borderRadius: 5, fontWeight: 800, padding: "2px 9px", marginRight: 3
      }}>Mana: {player.mana} / {player.maxMana}</span>
    </div>
  </div>
);

const CardMonster = ({ enemy }: any) => (
  <div style={{
    background: "linear-gradient(100deg,#232040 80%,#2d1930 120%)",
    border: "3px solid #e67cff", borderRadius: 14,
    boxShadow: "0 1px 18px #e67cff2b",
    minWidth: 120, padding: "12px 10px 8px 10px", display: "flex", flexDirection: "column", alignItems: "center"
  }}>
    <img src={enemy.img || "/store/noimg.png"} alt={enemy.nombre}
      style={{ width: 46, height: 46, borderRadius: 12, marginBottom: 5, border: "2.5px solid #e67cff", objectFit: "contain", background: "#0b0f13" }} />
    <div style={{ fontWeight: 900, color: "#e67cff", fontSize: 16, marginBottom: 2 }}>{enemy.nombre}</div>
    <div style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>
      <span style={{
        background: "#ffb3e8", color: "#232940", borderRadius: 5, fontWeight: 800, padding: "2px 9px"
      }}>Vida: {enemy.vida} / {enemy.maxVida}</span>
    </div>
  </div>
);

const BattleLog = ({ log }: any) => (
  <div style={{
    background: "#1b2240", margin: "13px 0", borderRadius: 12, color: "#aeefff",
    fontWeight: 800, fontSize: 16, minHeight: 44, maxHeight: 68, padding: "10px 10px", overflowY: "auto"
  }}>
    {log.slice(-4).map((line: string, idx: number) => <div key={idx}>{line}</div>)}
  </div>
);

const menuBtnStyle = {
  background: "linear-gradient(90deg,#39aaff 60%,#31bc47 100%)",
  color: "#fff", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 15, padding: "0.5em 1.1em", cursor: "pointer", margin: 0
};

const StatsPopup = ({ personaje, onClose }: any) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 999999,
    background: "rgba(18,21,28,0.93)", display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    <div style={{
      background: "#181d2a", borderRadius: 15, padding: "2em 2em 1.5em 2em", minWidth: 320,
      boxShadow: "0 8px 32px #39aaff55", position: "relative", color: "#fff"
    }}>
      <button onClick={onClose}
        style={{
          position: "absolute", top: 15, right: 17, background: "#ffe94d", color: "#161d29",
          border: "none", borderRadius: "100%", fontWeight: 900, width: 33, height: 33,
          fontSize: 19, cursor: "pointer", boxShadow: "0 1px 7px #ffe94d50"
        }}>×</button>
      <h3 style={{ color: "#39aaff", fontWeight: 900, marginBottom: 13 }}>Stats del Personaje</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 28px", fontWeight: 700, fontSize: 16 }}>
        <div><span style={{ color: "#ffe94d" }}>Vida:</span> {personaje.maxVida} / <span style={{ color: "#aeefff" }}>{personaje.vida}</span></div>
        <div><span style={{ color: "#39aaff" }}>Mana:</span> {personaje.maxMana} / <span style={{ color: "#aeefff" }}>{personaje.mana}</span></div>
        <div><span style={{ color: "#7fdaff" }}>Energía:</span> {personaje.maxEnergia} / <span style={{ color: "#aeefff" }}>{personaje.energia}</span></div>
        <div><span style={{ color: "#ffe94d" }}>Poder:</span> {personaje.poder}</div>
        <div><span style={{ color: "#c7fd8e" }}>Suerte:</span> {personaje.suerte}</div>
        <div><span style={{ color: "#e67cff" }}>Velocidad:</span> {personaje.velocidad}</div>
        <div><span style={{ color: "#7fdaff" }}>Defensa:</span> {personaje.defensa}</div>
      </div>
    </div>
  </div>
);

const InventoryModal = ({ open, consumibles, onUse, onClose }: any) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999999, background: "rgba(14,18,28,0.93)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#161d29", padding: "2em 1.1em 1.2em 1.1em", borderRadius: 14, minWidth: 285,
        maxWidth: 350, boxShadow: "0 8px 32px #39aaff44", position: "relative"
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", top: 13, right: 14, background: "#ffe94d", color: "#161d29",
            border: "none", borderRadius: "100%", fontWeight: 900, width: 31, height: 31,
            fontSize: 18, cursor: "pointer", boxShadow: "0 1px 7px #ffe94d60"
          }}>×</button>
        <h3 style={{ color: "#39aaff", fontWeight: 900, marginBottom: 9 }}>Inventario</h3>
        {consumibles.length === 0 && <div style={{ color: "#fff", fontWeight: 700 }}>No tienes consumibles.</div>}
        {consumibles.map((item: any, idx: number) => (
          <div key={item.id || idx} style={{
            display: "flex", alignItems: "center", background: "#212940", borderRadius: 10,
            marginBottom: 11, padding: "8px 12px", boxShadow: "0 2px 8px #13161c22"
          }}>
            <img src={item.img || "/store/noimg.png"} alt={item.title}
              style={{ width: 38, height: 38, borderRadius: 8, marginRight: 12, objectFit: "contain", background: "#151d2a" }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "#ffe94d", fontWeight: 800, fontSize: 15 }}>{item.title}</div>
               <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                  x{item.value ?? 1}
                </div>
            </div>
            <button onClick={() => onUse(item)}
              style={{
                background: "linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)",
                color: "#232940", fontWeight: 800, border: "none", borderRadius: 7, fontSize: 14, padding: "0.43em 1em", cursor: "pointer"
              }}
            >Usar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------- POPUP PARA RESTRICCIÓN DE ENTRADA -----------

const RestrictionPopup = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000000, background: "rgba(18,21,28,0.92)",
    display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    <div style={{
      background: "#232940", borderRadius: 17, color: "#ffe94d", fontWeight: 900, fontSize: 18,
      padding: "2.1em 2em 1.5em 2em", minWidth: 240, textAlign: "center", boxShadow: "0 1px 18px #39aaff44", position: "relative"
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 11, right: 14, background: "#ffe94d", color: "#232940",
        border: "none", borderRadius: "100%", fontWeight: 900, width: 30, height: 30,
        fontSize: 19, cursor: "pointer", boxShadow: "0 1px 7px #ffe94d50"
      }}>×</button>
      {message}
    </div>
  </div>
);

// ----------- DATOS DE PRUEBA Y UTILS -----------

const WORLDS = [
  { nombre: "Mundo 1", img: "/battle/world1.png" },
  { nombre: "Mundo 2", img: "/battle/world2.png" },
  { nombre: "Mundo 3", img: "/battle/world3.png" }
];


const getPlayerFromInventario = (inventario: any[]) => {
  const pj = inventario.find(p => p.tipo === "personaje" && p.activo);
  if (!pj || !pj.statsBase) return null;
  // Usa los stats actuales, base+extra si es posible
  const stats = {
    ...pj.statsBase,
    ...Object.keys(pj.statsExtra || {}).reduce((acc, k) => {
      acc[k] = (pj.statsBase[k] ?? 0) + (pj.statsExtra[k] ?? 0);
      return acc;
    }, { ...pj.statsBase })
  };
  return {
    ...pj,
    vida: pj.vidaActual ?? stats.vida,
    maxVida: stats.vida,
    mana: pj.manaActual ?? stats.mana,
    maxMana: stats.mana,
    energia: pj.energiaActual ?? stats.energia,
    maxEnergia: stats.energia,
    poder: stats.poder ?? 0,
    suerte: stats.suerte ?? 0,
    velocidad: stats.velocidad ?? 0,
    defensa: stats.defensa ?? 0,
    ataques: pj.ataques || [],
    hechizos: pj.hechizos || [null, null]
  };
};

const getConsumibles = (inventario: any[]) =>
  inventario.filter(item =>
    item.tipo === "consumible" &&
    (item.title.toLowerCase().includes("vida") ||
     item.title.toLowerCase().includes("mana") 
     )
  );

// --- Estados de efectos temporales ---
const initialStatusEffects = {
  damagetime: 0,
  damagetimeTicks: 0,
  damagex2: 0,
  defensex2: 0,
  healsteal: 0,
  healstealTicks: 0,
  stopdamage: 0,
  defense0: 0
};


// ----------- MAIN COMPONENT -----------

interface BattleScreenProps {
  username: string;
  inventario: any[];
  setInventario: React.Dispatch<React.SetStateAction<any[]>>;
  realmTokens: number;
  setRealmTokens: React.Dispatch<React.SetStateAction<number>>;
  wldTokens: number;
  setWldTokens: React.Dispatch<React.SetStateAction<number>>;
}

// PERSISTENCIA
const BATTLE_STORAGE = 'battle_state';

function saveBattleState(state: any) {
  window.localStorage.setItem(BATTLE_STORAGE, JSON.stringify(state));
}
function loadBattleState() {
  const d = window.localStorage.getItem(BATTLE_STORAGE);
  return d ? JSON.parse(d) : null;
}
function clearBattleState() {
  window.localStorage.removeItem(BATTLE_STORAGE);
}
type StatKey = 'vida' | 'poder' | 'mana' | 'energia' | 'suerte' | 'velocidad' | 'defensa';


function getStatsBaseNivel(nombre: string, nivel: number) {
  const base = statsBasePorPersonaje[nombre];
  const extra = statsPorNivel(nivel);
  const stats: Record<StatKey, number> = {
    vida: 0,
    poder: 0,
    mana: 0,
    energia: 0,
    suerte: 0,
    velocidad: 0,
    defensa: 0,
  };
  (Object.keys(base) as StatKey[]).forEach((key) => {
    stats[key] = (base[key] ?? 0) + (extra[key] ?? 0);
  });
  return stats;
}

const BattleScreen: React.FC<BattleScreenProps> = ({
  username, inventario, setInventario, realmTokens, setRealmTokens, wldTokens, setWldTokens
}) => {
  const navigate = useNavigate();

  // Estados principales
  const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showAbandon, setShowAbandon] = useState(false);
  const [showRestriction, setShowRestriction] = useState(false);
  const [restrictionMsg, setRestrictionMsg] = useState("");
  const [defensaAumentada, setDefensaAumentada] = useState(0);
  // Efectos especiales
  const [statusEffects, setStatusEffects] = useState({ ...initialStatusEffects });


// --- TEMPORIZADOR POR TURNO DEL JUGADOR ---
const [playerTimer, setPlayerTimer] = useState(30);

  // Recupera progreso
  const battleProgress = loadBattleState();

  // Usa personaje activo real
  const pjActivo = getPlayerFromInventario(inventario);

  // Estado de batalla
    const [enemyLevel, setEnemyLevel] = usePersistedState<number>("last_enemy_level", 1);
    const [enemy, setEnemy] = useState<any>(() => getEnemyByLevel(enemyLevel));
    const [player, setPlayer] = useState<any>(pjActivo);
    const [turn, setTurn] = useState<'player' | 'enemy'>(
      () => (pjActivo && pjActivo.velocidad >= getEnemyByLevel(enemyLevel).velocidad) ? 'player' : 'enemy'
    );
  const [battleLog, setBattleLog] = useState<string[]>(["¡La batalla comienza!"]);
  const [showDrop, setShowDrop] = useState(false);
  const [dropItem, setDropItem] = useState<any>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [retries, setRetries] = useState<number>(battleProgress?.retries ?? 0);

  // --- GUARDADO EN LOCALSTORAGE ---
  useEffect(() => {
    if (selectedWorld !== null && player && enemy && battleLog.length && !showEndModal) {
      saveBattleState({
        selectedWorld,
        player,
        enemy,
        turn,
        battleLog,
        retries
      });
    }
  }, [selectedWorld, player, enemy, turn, battleLog, retries, showEndModal]);

if (!pjActivo) {
    return (
      <>
        <TopBar username={username} />
        <div style={{
          width: '100%', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          background: '#191f33', color: '#fff'
        }}>
          <h2>No tienes personaje activo</h2>
          <p>Compra o activa un personaje en tu inventario para luchar.</p>
          <button onClick={() => navigate('/inventory')}
            style={{ marginTop: 18, background: '#39aaff', color: '#191f33', fontWeight: 700, padding: '0.6em 1.3em', borderRadius: 8, border: 'none' }}>
            Ir a Inventario
          </button>
        </div>
        <MenuBar selected="battle" onSelect={menuKey => navigate(menuKey === 'home' ? '/' : `/${menuKey}`)} />
      </>
    );
  }


  // Temporizador para el turno del jugador
useEffect(() => {
  let interval: ReturnType<typeof setInterval> | null = null;
  if (turn === "player" && selectedWorld !== null && player.vida > 0 && enemy.vida > 0 && !showEndModal) {
    setPlayerTimer(30);
    interval = setInterval(() => {
      setPlayerTimer(prev => {
        if (prev <= 1) {
          if (interval) clearInterval(interval);
          setBattleLog(log => [...log, "¡Turno terminado por tiempo!"]);
          setTimeout(() => setTurn("enemy"), 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } else {
    setPlayerTimer(30);
  }
  // Cleanup SÓLO retorna función, no null ni 0
  return () => {
    if (interval) clearInterval(interval);
  };
  // eslint-disable-next-line
}, [turn, selectedWorld, player.vida, enemy.vida, showEndModal]);

  // --- RESET TOTAL BATALLA ---
 const clearBattleData = () => {
  clearBattleState();
  setSelectedWorld(null);
  setPlayer(getPlayerFromInventario(inventario));
  setEnemy(getEnemyByLevel(enemyLevel));
  setTurn(
    (getPlayerFromInventario(inventario)?.velocidad ?? 0) >= getEnemyByLevel(enemyLevel).velocidad
      ? 'player'
      : 'enemy'
  );
  setBattleLog(["¡La batalla comienza!"]);
  setShowEndModal(false);
  setBattleResult(null);
  setRetries(0);
  setDropItem(null);
  setShowDrop(false);
  setDefensaAumentada(0);
};

  // --- Al cargar, si hay progreso pendiente (solo al entrar a BattleScreen) ---
  useEffect(() => {
    if (battleProgress && battleProgress.selectedWorld !== null) {
      setSelectedWorld(battleProgress.selectedWorld);
      setPlayer(battleProgress.player);
      setEnemy(battleProgress.enemy);
      setTurn(battleProgress.turn);
      setBattleLog(battleProgress.battleLog);
      setRetries(battleProgress.retries || 0);
      setDefensaAumentada(0);
    }
    // eslint-disable-next-line
  }, []);

  // --- Para actualización de pjActivo ---
  useEffect(() => {
    if (!pjActivo) {
      setTimeout(() => navigate('/inventory'), 800);
    }
  }, [pjActivo, navigate]);

  // --- TRANSICIÓN DE MUNDO ---
  useEffect(() => {
    if (selectedWorld !== null) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        // INICIO DE BATALLA AUTOMÁTICO según velocidad
        setTimeout(() => {
          if (battleLog.length === 1 && battleLog[0] === "¡La batalla comienza!") {
            if ((player?.velocidad ?? 0) >= (enemy?.velocidad ?? 0)) {
              setTurn('player');
              // El turno se queda en player, el botón es clickable.
            } else {
              setTurn('enemy');
              setTimeout(() => {
                enemyTurn();
              }, 900);
            }
          }
        }, 600);
      }, 1400);
    }
    // eslint-disable-next-line
  }, [selectedWorld]);

   // --- LÓGICA DE EFECTOS TEMPORALES DE HECHIZO POR TURNO ---
      useEffect(() => {
        // Daño por turno: damagetime
        if (statusEffects.damagetime > 0 && turn === "enemy" && enemy.vida > 0) {
          if (statusEffects.damagetimeTicks < 3) {
            setBattleLog(log => [...log, `${enemy.nombre} recibe 20 de daño por efecto de hechizo.`]);
            setEnemy((e: any) => ({ ...e, vida: Math.max(e.vida - 20, 0) }));
            setStatusEffects(eff => ({
              ...eff,
              damagetime: eff.damagetime - 1,
              damagetimeTicks: eff.damagetimeTicks + 1
            }));
          } else {
            setStatusEffects(eff => ({ ...eff, damagetime: 0, damagetimeTicks: 0 }));
          }
        }
        // Healsteal
        if (statusEffects.healsteal > 0 && turn === "enemy" && enemy.vida > 0) {
          if (statusEffects.healstealTicks < 3) {
            setBattleLog(log => [...log, `${player.nombre} roba 20 de vida al enemigo.`]);
            setEnemy((e: any) => ({ ...e, vida: Math.max(e.vida - 20, 0) }));
            setPlayer((p: any) => ({ ...p, vida: Math.min(p.vida + 20, p.maxVida) }));
            setStatusEffects(eff => ({
              ...eff,
              healsteal: eff.healsteal - 1,
              healstealTicks: eff.healstealTicks + 1
            }));
          } else {
            setStatusEffects(eff => ({ ...eff, healsteal: 0, healstealTicks: 0 }));
          }
        }
        // Resta turnos de buffs
        if (turn === "enemy" && enemy.vida > 0 && player.vida > 0) {
          setStatusEffects(eff => ({
            ...eff,
            damagex2: eff.damagex2 > 0 ? eff.damagex2 - 1 : 0,
            defensex2: eff.defensex2 > 0 ? eff.defensex2 - 1 : 0,
            stopdamage: eff.stopdamage > 0 ? eff.stopdamage - 1 : 0,
            defense0: eff.defense0 > 0 ? eff.defense0 - 1 : 0
          }));
        }
        // Fin buffs
        if (statusEffects.damagex2 === 0 && player.damagex2) {
          setPlayer((p: any) => ({ ...p, damagex2: undefined }));
        }
        if (statusEffects.defensex2 === 0 && player.defensex2) {
          setPlayer((p: any) => ({ ...p, defensa: p.defensa / 2, defensex2: undefined }));
        }
        if (statusEffects.defense0 === 0 && enemy.defensa0) {
          setEnemy((e: any) => ({ ...e, defensa: e.baseDefensa ?? e.defensa, defensa0: undefined }));
        }
      }, [turn]);

      const canEnemyAttack = statusEffects.stopdamage <= 0;
      // --- FIN CAMBIO HECHIZOS ---


  // --- TURNO ENEMIGO MEJORADO ---
// --- ACCIONES DEL ENEMIGO ---
  const enemyTurn = () => {
    if (enemy.vida > 0 && player.vida > 0 && !showEndModal) {
      // Si el enemigo tiene defense0, ignora defensa
      let dmg = Math.max(enemy.poder - (statusEffects.defense0 > 0 ? 0 : (player.defensa || 0)), 1);
      if (!canEnemyAttack) {
        setBattleLog(log => [...log, `${enemy.nombre} no puede atacar por efecto de hechizo.`]);
      } else {
        setBattleLog(log => [...log, `El ${enemy.nombre} ataca y causa ${dmg} de daño.`]);
        setPlayer((prev: any) => ({
          ...prev,
          vida: Math.max(prev.vida - dmg, 0)
        }));
      }
      setTimeout(() => {
        if (player.vida - dmg <= 0) {
          setBattleResult("defeat");
          setShowEndModal(true);
        } else {
          setTurn("player");
        }
      }, 850);
    }
  };



  // --- USEEFFECT de turno enemigo automático ---
useEffect(() => {
  if (turn === "enemy" && enemy.vida > 0 && player.vida > 0 && !showEndModal) {
    enemyAction({
      enemy,
      player,
      setEnemy,
      setPlayer,
      setBattleLog,
      setStatusEffects,
      canEnemyAttack,
      setTurn,
      showEndModal,
    });
  }
  // eslint-disable-next-line
}, [turn]);

type StatKey = 'vida' | 'poder' | 'mana' | 'energia' | 'suerte' | 'velocidad' | 'defensa';

// --- Donde defines la función ---
function getStatsBaseNivel(nivel: number): Record<StatKey, number> {
  return statsPorNivel(nivel);
}

// --- En el useEffect de victoria ---

useEffect(() => {
  if (enemy.vida <= 0 && !showEndModal) {
    setBattleResult("victory");
    setShowEndModal(true);

    // Reinicia defensa base
    if (defensaAumentada > 0) {
      setPlayer((prev: any) => ({
        ...prev,
        defensa: (prev.defensa || 0) - defensaAumentada
      }));
      setDefensaAumentada(0);
    }

    // --- SUMAR EXP Y SUBIR NIVEL SI CORRESPONDE ---
    setPlayer((prev: any) => {
      let experiencia = (prev.experiencia ?? 0) + 30; // Suma XP por victoria
      let nivel = prev.nivel ?? 1;
      let experienciaNecesaria = xpPorNivel[nivel] ?? xpNecesaria(nivel);

      // SUBIDA de nivel si se pasa de la XP necesaria (pueden ser varios niveles de golpe)
      while (experiencia >= experienciaNecesaria) {
        experiencia -= experienciaNecesaria;
        nivel += 1;
        experienciaNecesaria = xpPorNivel[nivel] ?? xpNecesaria(nivel);
      }

      // Ahora, statsBase es el resultado de statsPorNivel(nivel), NO suma ni mezcla con statsBasePorPersonaje.
      const nuevosStatsBase = getStatsBaseNivel(nivel);

      return {
        ...prev,
        experiencia,
        nivel,
        experienciaNecesaria,
        statsBase: nuevosStatsBase,
        // Refresca valores máximos
        vida: nuevosStatsBase.vida,
        maxVida: nuevosStatsBase.vida,
        mana: nuevosStatsBase.mana,
        maxMana: nuevosStatsBase.mana,
        energia: nuevosStatsBase.energia,
        maxEnergia: nuevosStatsBase.energia,
        poder: nuevosStatsBase.poder,
        suerte: nuevosStatsBase.suerte,
        velocidad: nuevosStatsBase.velocidad,
        defensa: nuevosStatsBase.defensa,
      };
    });

    setTimeout(() => {
      const drop = enemy.drop[Math.floor(Math.random() * enemy.drop.length)];
      setDropItem(drop);
      setShowDrop(true);
      // Ganancias al inventario/token, etc.
      if (drop.tipo === "token" && drop.itemCode === "realm_reward") {
        setRealmTokens((prev: number) => prev + (drop.value || 0));
      } else if (drop.tipo === "token" && drop.itemCode === "wld_reward") {
        setWldTokens((prev: number) => prev + (drop.value || 0));
      } else if (drop.tipo === "consumible") {
        setInventario((prev: any[]) => [...prev, { ...drop, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) }]);
      }
      // Sube nivel para la próxima batalla
      setEnemyLevel(lvl => lvl + 1);      
    }, 900);
  }
  // eslint-disable-next-line
}, [enemy.vida]);

  // --- DERROTA DEL JUGADOR ---
  useEffect(() => {
    if (player?.vida <= 0 && !showEndModal && selectedWorld !== null) {
      setBattleResult("defeat");
      setShowEndModal(true);
      // Reinicia defensa base
      if (defensaAumentada > 0) {
        setPlayer((prev: any) => ({
          ...prev,
          defensa: (prev.defensa || 0) - defensaAumentada
        }));
        setDefensaAumentada(0);
      }
    }
    // eslint-disable-next-line
  }, [player?.vida]);


  // --- Handler para atacar con hechizo ---
      const handleAttackHechizo = (idx: number) => {
        if (turn !== "player" || enemy.vida <= 0 || player.vida <= 0) return;
        const hechizo = player.hechizos[idx];
        if (!hechizo || !hechizo.name) return;

        // Gasto de mana
        if (player.mana < (hechizo.manaCost ?? 15)) {
          setBattleLog(log => [...log, `¡No tienes suficiente mana para usar ${hechizo.name}!`]);
          return;
        }
        let newPlayer = { ...player, mana: Math.max(player.mana - (hechizo.manaCost ?? 15), 0) };
        let logMsg = "";

        // Lógica de efectos:
        switch (hechizo.efecto) {
          case "damagetime":
            setStatusEffects(eff => ({ ...eff, damagetime: 3, damagetimeTicks: 0 }));
            logMsg = `${player.nombre} lanzó ${hechizo.name}, infligirá 20 de daño por turno durante 3 turnos.`;
            break;
          case "damagex2":
            setStatusEffects(eff => ({ ...eff, damagex2: 3 }));
            newPlayer.damagex2 = true;
            logMsg = `${player.nombre} lanzó ${hechizo.name}, los ataques harán doble daño durante 3 turnos.`;
            break;
          case "defensex2":
            setStatusEffects(eff => ({ ...eff, defensex2: 3 }));
            newPlayer.defensa = player.defensa * 2;
            newPlayer.defensex2 = true;
            logMsg = `${player.nombre} lanzó ${hechizo.name}, su defensa se duplicó por 3 turnos.`;
            break;
          case "healsteal":
            setStatusEffects(eff => ({ ...eff, healsteal: 3, healstealTicks: 0 }));
            logMsg = `${player.nombre} lanzó ${hechizo.name}, robará 20 de vida por 3 turnos.`;
            break;
          case "stopdamage":
            setStatusEffects(eff => ({ ...eff, stopdamage: 3 }));
            logMsg = `${player.nombre} lanzó ${hechizo.name}, el enemigo no podrá atacar por 3 turnos.`;
            break;
          case "defense0":
            setStatusEffects(eff => ({ ...eff, defense0: 2 }));
            setEnemy((e: any)=> ({ ...e, baseDefensa: e.defensa, defensa: 0, defensa0: true }));
            logMsg = `${player.nombre} lanzó ${hechizo.name}, la defensa del enemigo es 0 durante 2 turnos.`;
            break;
          default:
            logMsg = `${player.nombre} lanzó ${hechizo.name}, pero no ocurrió nada especial.`;
            break;
        }
        setPlayer(newPlayer);
        setBattleLog(log => [...log, logMsg]);
        setTimeout(() => setTurn("enemy"), 800);
      };

  // --- ACCIONES DEL JUGADOR (ATAQUES CON EFECTO) ---
  const handleAttack = (idx: number) => {
    if (turn !== "player" || enemy.vida <= 0 || player.vida <= 0) return;
    const attack = player.ataques[idx];
    let logMsg = "";
    let newPlayer = { ...player };
    let newDefensaAumentada = defensaAumentada;

    // Gasto de mana si corresponde
    if (attack.type === 'atk' || attack.type === 'heal') {
      if (player.mana < attack.manaCost) {
        setBattleLog(log => [...log, `¡No tienes suficiente mana para usar ${attack.name}!`]);
        return;
      }
      newPlayer.mana = Math.max(player.mana - attack.manaCost, 0);
    }

    // --- ATAQUE ---
    if (attack.type === 'atk') {
      const poderTotal = (player.statsBase?.poder ?? 0) + (player.statsExtra?.poder ?? 0);
      let dmg = attack.damage + Math.round(poderTotal * 0.10);
      const isCrit = Math.random() < (player.suerte / 100 + 0.1);
      if (isCrit) dmg = Math.round(dmg * 1.45);

      // Efecto steal
      if (attack.efecto?.includes("steal")) {
        const porc = parseInt(attack.efecto.replace("steal", "")) || 50;
        const stealAmount = Math.round(dmg * porc / 100);
        newPlayer.vida = Math.min(player.vida + stealAmount, player.maxVida);
        logMsg = isCrit
          ? `¡Crítico! ${player.nombre} usó ${attack.name}, robó ${stealAmount} vida y causó ${dmg} de daño al ${enemy.nombre}.`
          : `${player.nombre} usó ${attack.name}, robó ${stealAmount} vida y causó ${dmg} de daño al ${enemy.nombre}.`;
      } else {
        logMsg = isCrit
          ? `¡Crítico! ${player.nombre} usó ${attack.name} e infligió ${dmg} de daño al ${enemy.nombre}.`
          : `${player.nombre} usó ${attack.name} y causó ${dmg} de daño al ${enemy.nombre}.`;
      }
      setEnemy((prev: any) => ({ ...prev, vida: Math.max(prev.vida - dmg, 0) }));
    }

    // --- DEFENSA ---
    if (attack.type === 'def') {
      let defensa = 10;
      if (attack.efecto?.startsWith("defensa")) {
        defensa = parseInt(attack.efecto.replace("defensa", "")) || 10;
      }
      newPlayer.defensa = (player.defensa || 0) + defensa;
      newDefensaAumentada += defensa;
      logMsg = `${player.nombre} usó ${attack.name} y aumentó su defensa (+${defensa}).`;
    }

    // --- CURACIÓN ---
    if (attack.type === 'heal') {
      let heal = 35;
      if (attack.efecto?.startsWith("vida")) {
        heal = parseInt(attack.efecto.replace("vida", "")) || 35;
      }
      newPlayer.vida = Math.min(player.vida + heal, player.maxVida);
      logMsg = `${player.nombre} usó ${attack.name} y recuperó ${heal} de vida.`;
    }

    setPlayer(newPlayer);
    setDefensaAumentada(newDefensaAumentada);
    setBattleLog(log => [...log, logMsg]);
    setTimeout(() => setTurn("enemy"), 800);
  };


  // --- USAR CONSUMIBLE (mejora vida y mana según item) ---
  const handleUseConsumable = (item: any) => {
    if (player.vida <= 0 || enemy.vida <= 0 || showEndModal) return;
    let newPlayer = { ...player };
    let value = typeof item.value === 'string' ? parseInt(item.value) : (item.value ?? 10);

    if (item.title.toLowerCase().includes("vida")) {
      if (newPlayer.vida <= 0) {
        setBattleLog(log => [...log, `${player.nombre} está agotado y no puede usar consumibles de vida.`]);
        setBattleResult("defeat");
        setShowEndModal(true);
        return;
      }
      const before = newPlayer.vida;
      newPlayer.vida = Math.min(newPlayer.vida + value, newPlayer.maxVida);
      setBattleLog(log => [...log, `${player.nombre} usó ${item.title} y ganó vida (+${newPlayer.vida - before}).`]);
    }
    if (item.title.toLowerCase().includes("mana")) {
      const before = newPlayer.mana;
      newPlayer.mana = Math.min(newPlayer.mana + value, newPlayer.maxMana);
      setBattleLog(log => [...log, `${player.nombre} usó ${item.title} y recuperó mana (+${newPlayer.mana - before}).`]);
    }
    setPlayer(newPlayer);
    setInventario((prev: any[]) => {
      const idx = prev.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        const arr = [...prev];
        arr.splice(idx, 1);
        return arr;
      }
      return prev;
    });
    setShowInventory(false);
    setTimeout(() => {}, 700);
    setTurn("enemy");
  };

  // --- ENTRAR A MUNDO: validaciones ---
  const handleWorldSelect = (idx: number) => {
    if ((player.vida ?? 0) < 1) {
      setRestrictionMsg("¡Debes tener al menos 1 de vida para entrar en batalla!");
      setShowRestriction(true);
      return;
    }
    if ((player.mana ?? 0) < 10) {
      setRestrictionMsg("¡Debes tener al menos 10 de mana para entrar en batalla!");
      setShowRestriction(true);
      return;
    }
    setSelectedWorld(idx);
  };

  // --- POPUP ABANDONAR / GUARDAR ---
  const handleAbandonBattle = () => {
    clearBattleData();
    setShowAbandon(false);
    setTimeout(() => setSelectedWorld(null), 100);
  };
  const handleSaveBattle = () => {
    setShowAbandon(false);
    navigate('/');
  };

  // --- MANEJO DE REINTENTOS ---
const handleRetry = () => {
  if (retries < 2) {
    setShowEndModal(false);
    setBattleResult(null);
    setShowDrop(false);
    setRetries(prev => prev + 1);

    // 🔹 Restablecer la vida, mana y energía del jugador
    setPlayer((prev: any) => ({
      ...prev,
      vida: prev.maxVida ?? prev.vida,
      mana: prev.maxMana ?? prev.mana,
      energia: prev.maxEnergia ?? prev.energia,
    }));

    setEnemy(getEnemyByLevel(enemyLevel)); // O el nivel correcto para el retry
    setBattleLog(["¡La batalla comienza!"]);
    setTurn(
      (player?.velocidad ?? 0) >= getEnemyByLevel(enemyLevel).velocidad
        ? 'player'
        : 'enemy'
    );
  } else {
    if (realmTokens >= 25) {
      setRealmTokens(prev => prev - 25);
      setShowEndModal(false);
      setBattleResult(null);
      setShowDrop(false);
      setRetries(prev => prev + 1);

      // 🔹 Restablecer la vida, mana y energía del jugador
      setPlayer((prev: any) => ({
        ...prev,
        vida: prev.maxVida ?? prev.vida,
        mana: prev.maxMana ?? prev.mana,
        energia: prev.maxEnergia ?? prev.energia,
      }));

      setEnemy(getEnemyByLevel(enemyLevel));
      setBattleLog(["¡La batalla comienza!"]);
      setTurn(
        (player?.velocidad ?? 0) >= getEnemyByLevel(enemyLevel).velocidad
          ? 'player'
          : 'enemy'
      );
    } else {
      setRestrictionMsg("No tienes Realm suficientes para continuar (25 requeridos).");
      setShowRestriction(true);
    }
  }
};

  // --- MENUBAR Y TOPBAR ---
  const handleMenuBarSelect = (menuKey: string) => {
    if (selectedWorld !== null && !showEndModal) {
      setShowAbandon(true);
    } else {
      navigate(menuKey === 'home' ? '/' : `/${menuKey}`);
    }
  };

  if (!pjActivo) {
    return (
      <>
        <TopBar username={username} />
        <div style={{
          width: '100%', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          background: '#191f33', color: '#fff'
        }}>
          <h2>No tienes personaje activo</h2>
          <p>Compra o activa un personaje en tu inventario para luchar.</p>
          <button onClick={() => navigate('/inventory')}
            style={{ marginTop: 18, background: '#39aaff', color: '#191f33', fontWeight: 700, padding: '0.6em 1.3em', borderRadius: 8, border: 'none' }}>
            Ir a Inventario
          </button>
        </div>
        <MenuBar selected="battle" onSelect={menuKey => navigate(menuKey === 'home' ? '/' : `/${menuKey}`)} />
      </>
    );
  }

  // --- PANTALLA SELECCIÓN DE MUNDO ---
  if (selectedWorld === null) {
    return (
      <>
        <TopBar username={username} />
        <div style={{
          width: '100%', minHeight: '100vh',
          background: 'url(/battle/backgroundbattle.png) no-repeat center center / cover',
          color: '#fff', paddingTop: 80, paddingBottom: 90, maxWidth: 480, margin: '0 auto',
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start"
        }}>
          {/* Personaje activo visual */}
          <div style={{
            background: "rgba(19, 23, 39, 0.96)", borderRadius: 17, boxShadow: "0 2px 22px #39aaff25",
            display: "flex", alignItems: "center", gap: 19, padding: "19px 22px 13px 18px", marginTop: 13, marginBottom: 21, minWidth: 270
          }}>
            <img src={pjActivo.img || "/store/noimg.png"} alt={pjActivo.nombre}
              style={{ width: 62, height: 62, borderRadius: 12, objectFit: "contain", background: "#0c1b25", marginRight: 9, border: "2.5px solid #39aaff" }} />
            <div>
              <div style={{ color: '#39aaff', fontWeight: 700, fontSize: 22 }}>{pjActivo.nombre}</div>
              <div style={{ color: '#ffe94d', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{pjActivo.rareza}</div>
              <button onClick={() => setShowStats(true)} style={{
                background: 'linear-gradient(90deg,#39aaff 60%,#ffe94d 120%)',
                color: '#232940', border: 'none', borderRadius: 8, fontWeight: 900,
                fontSize: 15, padding: '0.38em 1.25em', cursor: 'pointer', marginBottom: 5,
                marginTop: 1, boxShadow: '0 1px 7px #39aaff40'
              }}>Ver Stats</button>
              <div style={{
                display: 'flex', gap: 8, marginTop: 7, marginBottom: 2
              }}>
                <span style={{
                  background: '#ffe94d', color: '#191f33', fontWeight: 900, borderRadius: 7,
                  padding: '2px 13px', fontSize: 15, boxShadow: "0 1px 7px #ffe94d32"
                }}>Vida: {pjActivo.vida} / {pjActivo.maxVida}</span>
                <span style={{
                  background: '#39aaff', color: '#fff', fontWeight: 900, borderRadius: 7,
                  padding: '2px 13px', fontSize: 15, boxShadow: "0 1px 7px #39aaff32"
                }}>Mana: {pjActivo.mana} / {pjActivo.maxMana}</span>
                <span style={{
                  background: '#aeefff', color: '#232940', fontWeight: 900, borderRadius: 7,
                  padding: '2px 13px', fontSize: 15, boxShadow: "0 1px 7px #7fdaff32"
                }}>Energía: {pjActivo.energia} / {pjActivo.maxEnergia}</span>
              </div>
            </div>
          </div>
          {/* Worlds en diagonal */}
          <div style={{
            width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 30, position: "relative"
          }}>
            {/* Mundo 1 (abajo izquierda) */}
            <div style={{
              position: "absolute", left: 0, bottom: 0, zIndex: 2, transform: "scale(1.10)"
            }}>
              <img
                src={WORLDS[0].img}
                alt={WORLDS[0].nombre}
                style={{
                  width: 110, height: 82, borderRadius: 16, border: "3px solid #ffe94d",
                  objectFit: "cover", background: "#101624", boxShadow: "0 4px 20px #ffe94d66",
                  cursor: "pointer"
                }}
                onClick={() => handleWorldSelect(0)}
              />
              <div style={{
                position: "absolute", top: 5, left: 14, background: "#ffe94d", color: "#191f33", borderRadius: 6, fontWeight: 900, fontSize: 14, padding: "2px 13px", boxShadow: "0 1px 7px #ffe94d50"
              }}>Mundo 1</div>
            </div>
            {/* Mundo 2 (centro) */}
            <div style={{
              position: "absolute", left: "44%", top: "29%", transform: "translateX(-50%) scale(1.02)"
            }}>
              <img
                src={WORLDS[1].img}
                alt={WORLDS[1].nombre}
                style={{
                  width: 98, height: 74, borderRadius: 15, border: "3px solid #7f8c9d",
                  objectFit: "cover", background: "#101624", boxShadow: "0 2px 12px #23294055",
                  filter: "grayscale(0.84)", opacity: 0.7,
                  cursor: "not-allowed"
                }}
              />
              <div style={{
                position: "absolute", top: 5, left: 12, background: "#222", color: "#aeefff", borderRadius: 5, fontWeight: 900, fontSize: 13, padding: "2px 11px", opacity: 0.8
              }}>Mundo 2</div>
            </div>
            {/* Mundo 3 (arriba derecha) */}
            <div style={{
              position: "absolute", right: 0, top: 0, zIndex: 2, transform: "scale(0.95)"
            }}>
              <img
                src={WORLDS[2].img}
                alt={WORLDS[2].nombre}
                style={{
                  width: 90, height: 65, borderRadius: 14, border: "3px solid #7f8c9d",
                  objectFit: "cover", background: "#101624", boxShadow: "0 2px 12px #23294055",
                  filter: "grayscale(0.84)", opacity: 0.6,
                  cursor: "not-allowed"
                }}
              />
              <div style={{
                position: "absolute", top: 5, left: 8, background: "#222", color: "#aeefff", borderRadius: 5, fontWeight: 900, fontSize: 13, padding: "2px 11px", opacity: 0.8
              }}>Mundo 3</div>
            </div>
          </div>
          {showStats && <StatsPopup personaje={pjActivo} onClose={() => setShowStats(false)} />}
          {showRestriction && <RestrictionPopup message={restrictionMsg} onClose={() => setShowRestriction(false)} />}
        </div>
        <MenuBar selected="battle" onSelect={handleMenuBarSelect} />
      </>
    );
  }

  // --- PANTALLA DE BATALLA ---
  return (
    <>
      <TopBar username={username} onMenuClick={() => setShowAbandon(true)} />        
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'url(/battle/backgroundbattle.png) no-repeat center center / cover',
        color: '#fff',
        paddingTop: 80,
        paddingBottom: 90,
        maxWidth: 480,
        margin: '0 auto',
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          background: "rgba(19,23,39,0.97)",
          borderRadius: 24,
          boxShadow: "0 2px 22px #23294050",
          width: "98%",
          maxWidth: 430,
          margin: "15px auto 10px auto",
          minHeight: 420,
          padding: "22px 10px 24px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "relative"
        }}>
          <div style={{
            width: "100%",
            height: 150,
            position: "relative",
            marginBottom: 20
          }}>
              {/* --- Nivel del enemigo y temporizador en fila --- */}
              <div
                style={{
                  width: "100%",
                  marginBottom: 12,
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,           // Espacio entre nivel y timer
                  position: "relative",
                  zIndex: 11,
                }}
              >
                <div
                  style={{
                    background: "#181d2a",
                    color: "#ffe94d",
                    fontWeight: 900,
                    fontSize: 15,
                    borderRadius: 11,
                    padding: "4px 15px",
                    boxShadow: "0 1px 5px #ffe94d22",
                    border: "2px solid #ffe94d",
                    letterSpacing: "1px",
                    minWidth: 72,
                    textAlign: "center",
                  }}
                >
                  Nivel {enemyLevel}
                </div>
                {turn === "player" && player.vida > 0 && enemy.vida > 0 && !showEndModal && (
                  <div
                    style={{
                      background: "#39aaff",
                      color: "#8B0000",
                      fontWeight: 900,
                      fontSize: 15,
                      borderRadius: 11,
                      padding: "4px 12px",
                      border: "2px solid #39aaff",
                      letterSpacing: "1px",
                      minWidth: 60,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <span role="img" aria-label="reloj" style={{ color: '#8B0000' }}>⏱</span> {playerTimer}s
                  </div>
                )}
              </div>
            <div style={{ position: "absolute", left: 0, bottom: 0, top: 20 }}>
              <CardHero player={player} />
            </div>
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <CardMonster enemy={enemy} />
            </div>
          </div>
          <BattleLog log={battleLog} />

          {/* --- FILA 1: ATAQUES --- */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 13, margin: "18px 0 7px 0"
          }}>
            {player.ataques && player.ataques.map((atk: any, i: number) => (
              <button  key={i}
                onClick={() => handleAttack(i)}
                disabled={atk.type !== 'def' && player.mana < atk.manaCost}
                style={{
                  ...menuBtnStyle,
                  minWidth: 115,
                  fontSize: 15,
                  background:
                    atk.type === 'atk'
                      ? "linear-gradient(90deg,#39aaff 70%,#3ff9e9 100%)"
                      : atk.type === 'heal'
                        ? "linear-gradient(90deg,#ffe94d 70%,#ffd62e 100%)"
                        : "linear-gradient(90deg,#aeefff 70%,#31bc47 100%)",
                  color: atk.type === 'heal' ? "#232940" : "#fff",
                  opacity: atk.type !== 'def' && player.mana < atk.manaCost ? 0.52 : 1,
                  padding: "0.62em 0.1em",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                <span
                    style={{
                      fontWeight: 900,
                      fontSize: atk.name.length > 18 ? 13 : 16,
                      textAlign: "center",
                      display: "block",
                      lineHeight: "1.12em",
                      minHeight: 33,
                      maxWidth: 110,
                      overflow: "hidden"
                    }}
                  >
                    {atk.name}
                  </span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {atk.type === 'atk' && `Daño: ${atk.damage} | Mana: -${atk.manaCost}`}
                  {atk.type === 'def' && `Defensa +${atk.efecto?.replace("defensa", "") || 10} | Sin costo`}
                  {atk.type === 'heal' && `Cura: ${atk.efecto?.replace("vida", "") || 35} | Mana: -${atk.manaCost}`}
                  {atk.efecto?.startsWith("steal") && <span> | Roba {atk.efecto.replace("steal", "")}% vida</span>}
                </span>
                <span style={{ color: "#aeefff", fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                  Tipo: {atk.type.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          {/* --- FILA 2: HECHIZOS + INVENTARIO --- */}
          <div style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: 11, margin: "4px 0 0 0"
          }}>
            {player.hechizos?.map((hechizo: any, idx: number) => (
              <button
                key={idx}
                disabled={!hechizo || !hechizo.name || turn !== "player" || player.vida <= 0 || enemy.vida <= 0 || player.mana < (hechizo.manaCost ?? 15)}
                onClick={() => {
                  if (hechizo && hechizo.name) handleAttackHechizo(idx);
                }}
                style={{
                  ...menuBtnStyle,
                  background: (!hechizo || !hechizo.name)
                    ? "linear-gradient(90deg,#232940 70%,#191f33 100%)"
                    : "linear-gradient(90deg,#ffe94d 70%,#39aaff 100%)",
                  color: (!hechizo || !hechizo.name) ? "#999" : "#232940",
                  opacity: (!hechizo || !hechizo.name || turn !== "player" || player.mana < (hechizo.manaCost ?? 15)) ? 0.55 : 1,
                  minWidth: 120,
                  fontWeight: 900
                }}
              >
                {(!hechizo || !hechizo.name)
                  ? "Aprende un hechizo nuevo"
                  : `${hechizo.name} (${hechizo.manaCost ?? 15} mana)`}
              </button>
            ))}
            <button
              onClick={() => setShowInventory(true)}
              style={{
                ...menuBtnStyle,
                background: "linear-gradient(90deg,#232940 70%,#39aaff 100%)",
                color: "#aeefff",
                minWidth: 52,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <img src="/menu/inventory.png" alt="Inventario" style={{ width: 32, height: 32 }} />
            </button>
          </div>
        </div>
        <InventoryModal open={showInventory} consumibles={getConsumibles(inventario)} onUse={handleUseConsumable} onClose={() => setShowInventory(false)} />
        {showDrop && dropItem && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(14,18,38,0.92)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#181d2a", borderRadius: 15, boxShadow: "0 1px 18px #ffe94d44", padding: "2.1em 2em 1.5em 2em", minWidth: 240, textAlign: "center"
            }}>
              <div style={{ color: "#ffe94d", fontWeight: 900, fontSize: 18, marginBottom: 8 }}>¡Ganaste un Drop!</div>
              <img src={dropItem.img || "/store/noimg.png"} alt={dropItem.title} style={{ width: 64, height: 64, borderRadius: 10, marginBottom: 6 }} />
              <div style={{ color: "#aeefff", fontWeight: 900, fontSize: 18 }}>{dropItem.title}{dropItem.value ? ` x${dropItem.value}` : ""}</div>
              <button style={{
                marginTop: 18, background: "linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)", color: "#232940", fontWeight: 900,
                border: "none", borderRadius: 8, fontSize: 16, padding: "0.7em 1.2em", cursor: "pointer", boxShadow: "0 1px 10px #39aaff44"
              }} onClick={() => { setShowDrop(false); setDropItem(null); }}>Cerrar</button>
            </div>
          </div>
        )}
        {showEndModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(10,16,40,0.85)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#181d2a", borderRadius: 17, color: "#ffe94d", fontWeight: 900, fontSize: 19,
              padding: "2.3em 2.3em 1.8em 2.3em", maxWidth: 320, textAlign: "center"
            }}>
              {battleResult === "victory" ? (
                <>
                  ¡Victoria!<br />
                  <span style={{ color: "#aeefff", fontSize: 18 }}>¿Continuar al siguiente nivel?</span>
                </>
              ) : (
                <>
                  Derrota<br />
                  <span style={{ color: "#ffe94d", fontWeight: 700, fontSize: 16 }}>¿Intentar de nuevo?</span>
                </>
              )}
              <div style={{ marginTop: 18 }}>
                {battleResult === "defeat" && (
                  <button style={{
                    background: "linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)", color: "#232940", fontWeight: 900,
                    border: "none", borderRadius: 8, fontSize: 15, padding: "0.6em 1.2em", marginRight: 14, cursor: "pointer"
                  }} onClick={handleRetry}>
                    {retries < 2 ? "Reintentar" : `Reintentar (-25 Realm)`}
                  </button>
                )}
                <button style={{
                  background: "linear-gradient(90deg,#eee 60%,#aeefff 100%)", color: "#232940", fontWeight: 900,
                  border: "none", borderRadius: 8, fontSize: 15, padding: "0.6em 1.2em", cursor: "pointer"
                }} onClick={clearBattleData}>Salir</button>
              </div>
            </div>
          </div>
        )}
        {showAbandon && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(18,21,38,0.87)", zIndex: 100000,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#232940", borderRadius: 18, color: "#fff", fontWeight: 900, fontSize: 18,
              padding: "2.2em 2em 1.7em 2em", minWidth: 300, textAlign: "center", boxShadow: "0 1px 18px #39aaff44", position: "relative"
            }}>
              <button onClick={() => setShowAbandon(false)} style={{
                position: "absolute", top: 13, right: 14, background: "#ffe94d", color: "#232940",
                border: "none", borderRadius: "100%", fontWeight: 900, width: 33, height: 33,
                fontSize: 19, cursor: "pointer", boxShadow: "0 1px 7px #ffe94d50"
              }}>×</button>
              <div style={{ marginBottom: 17 }}>¿Qué deseas hacer con la batalla en curso?</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
                <button onClick={handleAbandonBattle}
                  style={{
                    background: "linear-gradient(90deg,#e16464 60%,#ffe94d 100%)", color: "#232940", fontWeight: 900,
                    border: "none", borderRadius: 8, fontSize: 15, padding: "0.6em 1.3em", cursor: "pointer"
                  }}>Abandonar batalla</button>
                <button onClick={handleSaveBattle}
                  style={{
                    background: "linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)", color: "#232940", fontWeight: 900,
                    border: "none", borderRadius: 8, fontSize: 15, padding: "0.6em 1.3em", cursor: "pointer"
                  }}>Guardar progreso</button>
              </div>
            </div>
          </div>
        )}
        {showRestriction && <RestrictionPopup message={restrictionMsg} onClose={() => setShowRestriction(false)} />}
      </div>
      <MenuBar selected="battle" onSelect={handleMenuBarSelect} />
    </>
  );
};

export default BattleScreen;
