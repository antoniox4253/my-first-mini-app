import React from "react";

// Pool de hechizos especiales para enemigos inteligentes
const ENEMY_SPELLS = [
  { name: "Sanación Oscura", efecto: "heal", value: 40, manaCost: 0, type: "heal" },
  { name: "Defensa Total", efecto: "defensex2", value: 0, manaCost: 0, type: "def" },
  { name: "Marca Letal", efecto: "damagetime", value: 0, manaCost: 0, type: "atk" },
  { name: "Toque de Muerte", efecto: "damagex2", value: 0, manaCost: 0, type: "atk" },
  { name: "Escudo Infernal", efecto: "defensex2", value: 0, manaCost: 0, type: "def" },
  { name: "Robo Vital", efecto: "healsteal", value: 0, manaCost: 0, type: "heal" },
  { name: "Parálisis", efecto: "stopdamage", value: 0, manaCost: 0, type: "def" },
  { name: "Rendición de Armaduras", efecto: "defense0", value: 0, manaCost: 0, type: "atk" },
  { name: "Explosión de Caos", efecto: "damagex2", value: 0, manaCost: 0, type: "atk" },
  { name: "Maldición de Maná", efecto: "manadrain", value: 20, manaCost: 0, type: "atk" },
];

// Ataque básico del enemigo (puedes añadir más variantes)
const BASIC_ATTACKS = [
  { name: "Garra Afilada", damage: 28, type: "atk" },
  { name: "Golpe de Cabeza", damage: 32, type: "atk" },
  { name: "Mordida", damage: 30, type: "atk" },
];

// Drops posibles
const BASE_DROPS = [
  { tipo: "consumible", title: "Mana x10", value: 10, img: "/store/mana.png", itemCode: "codmana10" },
  { tipo: "token", title: "Realm x5", value: 5, img: "/store/realm.png", itemCode: "realm_reward" }
];
const ADVANCED_DROPS = [
  { tipo: "consumible", title: "Vida x30", value: 30, img: "/store/vida.png", itemCode: "codvida30" },
  { tipo: "consumible", title: "Mana x30", value: 30, img: "/store/mana.png", itemCode: "codmana30" },
  { tipo: "consumible", title: "Energía x20", value: 20, img: "/store/energia.png", itemCode: "codenergia20" },
  { tipo: "token", title: "Realm x10", value: 10, img: "/store/realm.png", itemCode: "realm_reward" },
  { tipo: "token", title: "WLD x2", value: 2, img: "/store/wld.png", itemCode: "wld_reward" },
];

export type EnemyType = {
  nombre: string;
  vida: number;
  maxVida: number;
  poder: number;
  defensa: number;
  velocidad: number;
  img: string;
  drop: any[];
  spells?: any[];
  level: number;
};

export function getEnemyByLevel(level: number): EnemyType {
  // Escalado de stats
  const baseVida = 100 + level * 20 + (level > 30 ? 40 * (level - 30) : 0);
  const basePoder = 28 + Math.floor(level * 1.8);
  const baseDefensa = 1 + Math.floor(level / 4);
  const baseVelocidad = 10 + Math.floor(level / 7);

  // Enemy base
  const enemy: EnemyType = {
    nombre: level <= 30 ? "Goblin" : (level < 45 ? "Goblin Élite" : "Señor del Abismo"),
    vida: baseVida,
    maxVida: baseVida,
    poder: basePoder,
    defensa: baseDefensa,
    velocidad: baseVelocidad,
    img: level <= 30
      ? "/sprites/goblin.png"
      : (level < 45 ? "/sprites/goblin_elite.png" : "/sprites/lord_abyss.png"),
    drop: level <= 30 ? BASE_DROPS : ADVANCED_DROPS,
    level
  };

  // Niveles avanzados: añade hechizos
  if (level >= 31) {
    // Elige aleatoriamente entre 2 y 3 hechizos
    const spellCount = level < 45 ? 2 : 3;
    const shuffled = ENEMY_SPELLS
      .map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
    enemy.spells = shuffled.slice(0, spellCount);
  }

  return enemy;
}

// --- Lógica de acción enemiga --- //
export function enemyAction({
  enemy,
  player,
  setEnemy,
  setPlayer,
  setBattleLog,
  setStatusEffects,
  canEnemyAttack,
  setTurn,
  showEndModal
}: any) {
  // ¿Enemigo tiene hechizos y suficiente nivel?
  if (enemy.spells && enemy.spells.length > 0 && Math.random() < 0.4) { // 40% chance usa spell
    // Elige spell aleatorio
    const spell = enemy.spells[Math.floor(Math.random() * enemy.spells.length)];

    let logMsg = `${enemy.nombre} lanza ${spell.name}!`;
    switch (spell.efecto) {
      case "heal":
        setEnemy((e: any) => ({ ...e, vida: Math.min(e.vida + spell.value, e.maxVida) }));
        logMsg += ` Se cura ${spell.value} de vida.`;
        break;
      case "defensex2":
        setEnemy((e: any) => ({ ...e, defensa: e.defensa * 2, defensex2: true }));
        setStatusEffects((eff: any) => ({ ...eff, defensex2: 3 }));
        logMsg += ` Duplica su defensa por 3 turnos.`;
        break;
      case "damagetime":
        setStatusEffects((eff: any) => ({ ...eff, damagetime: 3, damagetimeTicks: 0 }));
        logMsg += ` Te inflige daño por turno durante 3 turnos.`;
        break;
      case "damagex2":
        setStatusEffects((eff: any) => ({ ...eff, damagex2: 3 }));
        logMsg += ` Hará doble daño durante 3 turnos.`;
        break;
      case "healsteal":
        setEnemy((e: any) => {
          setPlayer((p: any) => ({ ...p, vida: Math.max(p.vida - 20, 0) }));
          return { ...e, vida: Math.min(e.vida + 20, e.maxVida) };
        });
        logMsg += ` Roba 20 de vida.`;
        break;
      case "stopdamage":
        setStatusEffects((eff: any) => ({ ...eff, stopdamage: 2 }));
        logMsg += ` ¡Te paraliza y detiene tu ataque por 2 turnos!`;
        break;
      case "defense0":
        setStatusEffects((eff: any) => ({ ...eff, defense0: 2 }));
        setPlayer((p: any) => ({ ...p, defensa: 0, defensa0: true }));
        logMsg += ` ¡Reduce tu defensa a 0 durante 2 turnos!`;
        break;
      case "manadrain":
        setPlayer((p: any) => ({ ...p, mana: Math.max((p.mana ?? 0) - (spell.value ?? 10), 0) }));
        logMsg += ` Drena ${spell.value} de tu maná.`;
        break;
      default:
        logMsg += ` ¡Pero no sucede nada!`;
    }
    setBattleLog((log: string[]) => [...log, logMsg]);
    setTimeout(() => setTurn("player"), 1000);
    return;
  }

  // Si no usa hechizo, hace ataque básico
  const attack = BASIC_ATTACKS[Math.floor(Math.random() * BASIC_ATTACKS.length)];
  let dmg = Math.max(enemy.poder - (player.defensa || 0), 1);

  if (!canEnemyAttack) {
    setBattleLog((log: string[]) => [...log, `${enemy.nombre} no puede atacar por efecto de hechizo.`]);
  } else {
    setBattleLog((log: string[]) => [...log, `El ${enemy.nombre} usa ${attack.name} y causa ${dmg} de daño.`]);
    setPlayer((prev: any) => ({
      ...prev,
      vida: Math.max(prev.vida - dmg, 0)
    }));
  }
  setTimeout(() => setTurn("player"), 850);
}
