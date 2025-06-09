// PoolAtaques.ts
export interface Ataque {
  name: string;
  damage: number;
  manaCost: number;
  type: 'atk' | 'def' | 'heal';
  efecto?: string; // Opcional: "", "defensa10", "vida35", "steal50"
  descripcion?: string;
}

export const POOL_ATAQUES: Ataque[] = [
  // --- 12 Ataques poco daño (28-35) ---
  {
    name: "Corte Sombrío",
    damage: 28,
    manaCost: 7,
    type: "atk",
    efecto: "",
    descripcion: "Un tajo rápido envuelto en sombras."
  },
  {
    name: "Daga Relámpago",
    damage: 30,
    manaCost: 8,
    type: "atk",
    efecto: "",
    descripcion: "Ataca a la velocidad de un rayo."
  },
  {
    name: "Golpe Ágil",
    damage: 32,
    manaCost: 9,
    type: "atk",
    efecto: "",
    descripcion: "Un golpe preciso y veloz."
  },
  {
    name: "Llama Menor",
    damage: 33,
    manaCost: 8,
    type: "atk",
    efecto: "",
    descripcion: "Lanza una pequeña flama hacia el rival."
  },
  {
    name: "Embate Umbral",
    damage: 35,
    manaCost: 9,
    type: "atk",
    efecto: "",
    descripcion: "Causa daño con energía de las sombras."
  },
  {
    name: "Puño de Hierro",
    damage: 29,
    manaCost: 6,
    type: "atk",
    efecto: "",
    descripcion: "Un puñetazo reforzado con maná."
  },
  {
    name: "Sombra Fugaz",
    damage: 31,
    manaCost: 9,
    type: "atk",
    efecto: "",
    descripcion: "Golpea rápidamente desde la oscuridad."
  },
  {
    name: "Toque Glacial",
    damage: 32,
    manaCost: 8,
    type: "atk",
    efecto: "",
    descripcion: "Un toque que debilita con frío intenso."
  },
  {
    name: "Estocada Furtiva",
    damage: 33,
    manaCost: 10,
    type: "atk",
    efecto: "",
    descripcion: "Ataque inesperado y silencioso."
  },
  {
    name: "Ráfaga Corta",
    damage: 30,
    manaCost: 8,
    type: "atk",
    efecto: "",
    descripcion: "Golpea varias veces en rápida sucesión."
  },
  {
    name: "Rayo Azul",
    damage: 28,
    manaCost: 7,
    type: "atk",
    efecto: "",
    descripcion: "Un pequeño rayo de energía azul."
  },
  {
    name: "Filo Lunar",
    damage: 34,
    manaCost: 10,
    type: "atk",
    efecto: "",
    descripcion: "Ataque que aprovecha la energía lunar."
  },

  // --- 13 Ataques daño medio (35-45) ---
  {
    name: "Corte Celestial",
    damage: 39,
    manaCost: 14,
    type: "atk",
    efecto: "",
    descripcion: "Desciende una hoja de luz sobre el enemigo."
  },
  {
    name: "Llama Superior",
    damage: 37,
    manaCost: 13,
    type: "atk",
    efecto: "",
    descripcion: "Llama ardiente que consume todo a su paso."
  },
  {
    name: "Impacto Rúnico",
    damage: 44,
    manaCost: 15,
    type: "atk",
    efecto: "",
    descripcion: "Un golpe marcado por runas mágicas."
  },
  {
    name: "Explosión Sónica",
    damage: 36,
    manaCost: 11,
    type: "atk",
    efecto: "",
    descripcion: "Causa una vibración sónica demoledora."
  },
  {
    name: "Golpe del Vacío",
    damage: 41,
    manaCost: 16,
    type: "atk",
    efecto: "",
    descripcion: "Absorbe energía del vacío y la libera."
  },
  {
    name: "Destello Umbral",
    damage: 40,
    manaCost: 15,
    type: "atk",
    efecto: "",
    descripcion: "Un destello de sombras, letal y rápido."
  },
  {
    name: "Espina de Dragón",
    damage: 43,
    manaCost: 17,
    type: "atk",
    efecto: "",
    descripcion: "Ataque que emula el filo de un dragón."
  },
  {
    name: "Flecha Abisal",
    damage: 42,
    manaCost: 16,
    type: "atk",
    efecto: "",
    descripcion: "Flecha que atraviesa cualquier defensa."
  },
  {
    name: "Látigo de Maná",
    damage: 38,
    manaCost: 13,
    type: "atk",
    efecto: "",
    descripcion: "Azota con pura energía mágica."
  },
  {
    name: "Tormenta Fugaz",
    damage: 37,
    manaCost: 12,
    type: "atk",
    efecto: "",
    descripcion: "Desata una breve pero violenta tormenta."
  },
  {
    name: "Luz Purificadora",
    damage: 36,
    manaCost: 14,
    type: "atk",
    efecto: "",
    descripcion: "Daña a seres corruptos con luz pura."
  },
  {
    name: "Sable Carmesí",
    damage: 40,
    manaCost: 13,
    type: "atk",
    efecto: "",
    descripcion: "Una hoja carmesí corta profundamente."
  },
  {
    name: "Impacto Centella",
    damage: 45,
    manaCost: 16,
    type: "atk",
    efecto: "",
    descripcion: "Impacto electrizante devastador."
  },

  // --- 5 DEFENSIVOS ---
  {
    name: "Guardia Divina",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa10",
    descripcion: "Aumenta la defensa del usuario drásticamente."
  },
  {
    name: "Escudo Umbral",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa20",
    descripcion: "Barrera de sombras que absorbe daño."
  },
  {
    name: "Muro de Acero",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa15",
    descripcion: "Convoca una muralla de acero impenetrable."
  },
  {
    name: "Defensa Celeste",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa25",
    descripcion: "Protección otorgada por los cielos."
  },
  {
    name: "Refugio Místico",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa28",
    descripcion: "Una barrera mística lo rodea por completo."
  },

  // --- 5 HEAL (efecto vida35 o variantes) ---
  {
    name: "Curación Menor",
    damage: 0,
    manaCost: 10,
    type: "heal",
    efecto: "vida20",
    descripcion: "Recupera una pequeña cantidad de vida."
  },
  {
    name: "Sanación de Luz",
    damage: 0,
    manaCost: 14,
    type: "heal",
    efecto: "vida35",
    descripcion: "La luz divina sana heridas graves."
  },
  {
    name: "Reconstitución Rápida",
    damage: 0,
    manaCost: 11,
    type: "heal",
    efecto: "vida30",
    descripcion: "Regenera tejidos rápidamente."
  },
  {
    name: "Bendición Vital",
    damage: 0,
    manaCost: 16,
    type: "heal",
    efecto: "vida50",
    descripcion: "Otorga vitalidad excepcional."
  },
  {
    name: "Pulso Restaurador",
    damage: 0,
    manaCost: 12,
    type: "heal",
    efecto: "vida25",
    descripcion: "Un pulso energético revitaliza al usuario."
  },

  ];