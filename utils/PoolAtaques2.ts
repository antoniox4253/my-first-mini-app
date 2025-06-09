// PoolAtaques.ts
export interface Ataque {
  name: string;
  damage: number;
  manaCost: number;
  type: 'atk' | 'def' | 'heal';
  efecto?: string; // Opcional: "", "defensa10", "vida35", "steal50"
  descripcion?: string;
}

export const POOL_ATAQUES2: Ataque[] = [
  
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
    name: "Escudo Umbral",
    damage: 0,
    manaCost: 0,
    type: "def",
    efecto: "defensa20",
    descripcion: "Barrera de sombras que absorbe daño."
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

  // --- 5 Ataques daño 35-50 con efecto STEAL50 ---
  {
    name: "Golpe Vampírico",
    damage: 40,
    manaCost: 18,
    type: "atk",
    efecto: "steal50",
    descripcion: "Inflige daño y absorbe vitalidad rival."
  },
  {
    name: "Lanza del Devorador",
    damage: 45,
    manaCost: 20,
    type: "atk",
    efecto: "steal50",
    descripcion: "Una lanza oscura roba la vida de su objetivo."
  },
  {
    name: "Guadaña Voraz",
    damage: 50,
    manaCost: 22,
    type: "atk",
    efecto: "steal50",
    descripcion: "Guadaña espectral que roba salud masivamente."
  },

// --- 5 Ataques daño 50-70 con efecto STEAL100 ---
{
    name: "Robo de Almas Pro",
    damage: 60,
    manaCost: 25,
    type: "atk",
    efecto: "steal100",
    descripcion: "Daña y roba vida del enemigo a gran escala."
  },
  {
    name: "Golpe Vampírico Pro",
    damage: 65,
    manaCost: 28,
    type: "atk",
    efecto: "steal100",
    descripcion: "Inflige daño y absorbe vitalidad rival a gran escala."
  },
  {
    name: "Lanza del Devorador Pro",
    damage: 70,
    manaCost: 30,
    type: "atk",
    efecto: "steal100",
    descripcion: "Una lanza oscura roba la vida de su objetivo a gran escala."
  },

  ];