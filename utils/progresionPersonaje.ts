// Archivo de configuración de stats, experiencia y personajes para el sistema RPG estilo Solo Leveling

// Stats base por personaje según su rareza
// Puedes modificar estos valores para balancear las diferencias entre rarezas
export const statsBasePorPersonaje: Record<string, {vida: number, poder: number, mana: number, energia: number, suerte: number, velocidad: number, defensa: number}> = {
  // ⭐️ Comunes (5)
  "Cazador Novato":        { vida: 120,  poder: 20, mana: 30,  energia: 80, suerte: 5, velocidad: 5, defensa: 5 },
  "Cazador Inexperto":     { vida: 150,  poder: 30, mana: 30,  energia: 80, suerte: 6, velocidad: 5, defensa: 6 },
  "Cazador Errante":       { vida: 150,  poder: 25,  mana: 30, energia: 80,  suerte: 7, velocidad: 6, defensa: 5 },
  "Cazador Desconocido":   { vida: 150,  poder: 35, mana: 30, energia: 80, suerte: 5, velocidad: 6, defensa: 6 },
  "Cazador Frágil":        { vida: 180,  poder: 35, mana: 30,  energia: 80,  suerte: 4, velocidad: 5, defensa: 4 },

  // 🟢 Poco Comunes (5)
  "Cazador Tenaz":         { vida: 80,  poder: 13, mana: 45, energia: 80, suerte: 6, velocidad: 6, defensa: 7 },
  "Cazador de Élite":      { vida: 82,  poder: 14, mana: 44, energia: 80, suerte: 7, velocidad: 7, defensa: 8 },
  "Cazador Persistente":   { vida: 84,  poder: 13, mana: 48, energia: 80, suerte: 8, velocidad: 6, defensa: 8 },
  "Cazador de Sombras":    { vida: 78,  poder: 15, mana: 42, energia: 80, suerte: 6, velocidad: 8, defensa: 7 },
  "Cazador Ágil":          { vida: 76,  poder: 12, mana: 45, energia: 80, suerte: 8, velocidad: 9, defensa: 6 },

  // 🔵 Raros (3)
  "Cazador de Rango B":    { vida: 90,  poder: 17, mana: 55, energia: 80, suerte: 9, velocidad: 8, defensa: 10 },
  "Cazador de Rango A":    { vida: 94,  poder: 18, mana: 58, energia: 80, suerte: 10, velocidad: 8, defensa: 11 },
  "Cazador Maldito":       { vida: 88,  poder: 20, mana: 56, energia: 80, suerte: 8, velocidad: 9, defensa: 9 },

  // 🟣 Épicos (3) - Aumentados
  "Cazador Sombra":        { vida: 110, poder: 25, mana: 60, energia: 80, suerte: 13, velocidad: 12, defensa: 14 },
  "Cazador Absoluto":      { vida: 112, poder: 26, mana: 68, energia: 80, suerte: 14, velocidad: 13, defensa: 15 },
  "Cazador de Fuego":      { vida: 108, poder: 27, mana: 68, energia: 80, suerte: 12, velocidad: 14, defensa: 13 },

  // 🟡 Legendarios (2 - Monarcas) - Aumentados
  "Monarca de la Destrucción": { vida: 160, poder: 34, mana: 75, energia: 80, suerte: 25, velocidad: 16, defensa: 18 },
  "Monarca de las Sombras":    { vida: 175, poder: 38, mana: 80, energia: 80, suerte: 19, velocidad: 18, defensa: 17 },
};

// Progresión de stats que se suman cada nivel
// Puedes cambiar estas fórmulas para modificar el ritmo de mejora
export function statsPorNivel(nivel: number) {
  return {
    vida: 20 + (nivel - 1) * 3,            // Vida base + 3 por nivel
    poder: 2 + Math.floor(nivel / 4),      // Poder +1 cada 4 niveles
    mana: 2 + Math.floor(nivel / 5),       // Mana +1 cada 5 niveles
    energia: 1 + Math.floor(nivel / 7),    // Energía +1 cada 7 niveles
    suerte: (nivel % 5 === 0) ? 1 : 0,     // Suerte +1 cada 5 niveles
    velocidad: (nivel % 8 === 0) ? 1 : 0,  // Velocidad +1 cada 8 niveles
    defensa: (nivel % 6 === 0) ? 1 : 0     // Defensa +1 cada 6 niveles
  };
}

// Cálculo de experiencia total necesaria por cada nivel
// Esta función da la experiencia necesaria para alcanzar un nivel en particular (no acumulada)
export function xpNecesaria(nivel: number) {
  return 100 + 50 * (nivel - 1); // Nivel 1: 100, Nivel 2: 150, ..., Nivel 100: 5050
}

// Tabla precomputada para los niveles 1 al 100 con la XP necesaria
// Puedes usarla directamente o exportarla si prefieres no calcular en tiempo real
export const xpPorNivel: Record<number, number> = {
  1: 100, 2: 150, 3: 200, 4: 250, 5: 300, 6: 350, 7: 400, 8: 450, 9: 500, 10: 550,
  11: 600, 12: 650, 13: 700, 14: 750, 15: 800, 16: 850, 17: 900, 18: 950, 19: 1000, 20: 1050,
  21: 1100, 22: 1150, 23: 1200, 24: 1250, 25: 1300, 26: 1350, 27: 1400, 28: 1450, 29: 1500, 30: 1550,
  31: 1600, 32: 1650, 33: 1700, 34: 1750, 35: 1800, 36: 1850, 37: 1900, 38: 1950, 39: 2000, 40: 2050,
  41: 2100, 42: 2150, 43: 2200, 44: 2250, 45: 2300, 46: 2350, 47: 2400, 48: 2450, 49: 2500, 50: 2550,
  51: 2600, 52: 2650, 53: 2700, 54: 2750, 55: 2800, 56: 2850, 57: 2900, 58: 2950, 59: 3000, 60: 3050,
  61: 3100, 62: 3150, 63: 3200, 64: 3250, 65: 3300, 66: 3350, 67: 3400, 68: 3450, 69: 3500, 70: 3550,
  71: 3600, 72: 3650, 73: 3700, 74: 3750, 75: 3800, 76: 3850, 77: 3900, 78: 3950, 79: 4000, 80: 4050,
  81: 4100, 82: 4150, 83: 4200, 84: 4250, 85: 4300, 86: 4350, 87: 4400, 88: 4450, 89: 4500, 90: 4550,
  91: 4600, 92: 4650, 93: 4700, 94: 4750, 95: 4800, 96: 4850, 97: 4900, 98: 4950, 99: 5000, 100: 5050
};