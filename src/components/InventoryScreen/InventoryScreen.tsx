import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import MenuBar from './MenuBar';
import OpeningAnimado from './OpeningAnimado';
import { getPool, updatePool } from '../utils/gachaPool';
import { statsBasePorPersonaje } from '../utils/progresionPersonaje';
import type { RarezaType } from '../utils/gachaPool';
import { v4 as uuidv4 } from 'uuid';
import { POOL_ATAQUES } from '../utils/PoolAtaques';
import { POOL_ATAQUES2 } from '../utils/PoolAtaques2';
import usePersistedState from "../hooks/usePersistedState";


const INVENTORY_TABS = [
  { key: 'consumible', label: 'Consumibles' },
  { key: 'equipamiento', label: 'Equipamiento' },
  { key: 'personaje', label: 'Personajes' },
  { key: 'canje', label: 'Canje' },
];

const rarezaBorder: Record<string, string> = {
  legendario: '#ffe94d',
  epico: '#e67cff',
  raro: '#2cc0fa',
  'poco común': '#39aaff',
  comun: '#c7fd8e',
};

// Hechizos avanzados (para codhx)
const HECHIZOS_AVANZADOS = [
  { name: "Ráfaga Oscura", damage: 20, manaCost: 24, type: "atk", efecto: "damagetime", descripcion: "" },
  { name: "La Marca del Rey", damage: 0, manaCost: 30, type: "atk", efecto: "damagex2", descripcion: "" },
  { name: "Escudo del Monarca", damage: 0, manaCost: 30, type: "def", efecto: "defensex2", descripcion: "" },
  { name: "Elixer", damage: 0, manaCost: 40, type: "heal", efecto: "healsteal", descripcion: "" },
  { name: "Sigilo", damage: 0, manaCost: 30, type: "def", efecto: "stopdamage", descripcion: "" },
  { name: "Miedo del Dragón", damage: 0, manaCost: 35, type: "def", efecto: "defense0", descripcion: "" }
];

interface InventoryScreenProps {
  username: string;
  inventario: any[];
  setInventario: React.Dispatch<React.SetStateAction<any[]>>;
  realmTokens: number;
  wldTokens: number;
  vida: number;
  mana: number;
  energia: number;
  trainingActive?: boolean;
}

const labelBoxStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 43
};
const labelTitleStyle: React.CSSProperties = {
  color: '#83c8ff', fontSize: 12, fontWeight: 600, marginBottom: 1, textShadow: '0 1px 4px #0009'
};
const labelValueStyle: React.CSSProperties = {
  color: '#fff', fontWeight: 900, fontSize: 15, textShadow: '0 2px 8px #0009'
};

const HEADER_HEIGHT = 80;
const TABS_HEIGHT = 54;
const H2_MARGIN = 13;
const BOTTOM_MENU_HEIGHT = 150;
const PADDING_EXTRA = 30;

const InventoryScreen: React.FC<InventoryScreenProps> = ({
  username,
  inventario,
  setInventario,
  realmTokens,
  wldTokens,
  vida,
  mana,
  energia,
  trainingActive = false,
}) => {
  const [tab, setTab] = useState<'consumible' | 'equipamiento' | 'personaje' | 'canje'>('consumible');
  const [opening, setOpening] = useState(false);
  const [popup, setPopup] = useState<null | any>(null);
  const [showPool, setShowPool] = useState(false);

  // Para asignar hechizo a personaje
  const [showSelectPersonaje, setShowSelectPersonaje] = useState(false);
  const [personajeAHechizar, setPersonajeAHechizar] = useState<any>(null);
  const [hechizoConsumibleItem, setHechizoConsumibleItem] = useState<any>(null);
  const [showHechizoMaxPopup, setShowHechizoMaxPopup] = useState(false);
// En InventoryScreen o donde manejes los consumibles:
const [hechizoAleatorioPendiente, setHechizoAleatorioPendiente] = usePersistedState<any>('hechizoAleatorioPendiente', null);
  const [showHechizoReplacePopup, setShowHechizoReplacePopup] = useState(false);
const [nuevoHechizoPendiente, setNuevoHechizoPendiente] = useState<any>(null);
const [popupError, setPopupError] = useState<string | null>(null);


  const [maxHeight, setMaxHeight] = useState<number>(420);
  useEffect(() => {
    function updateHeight() {
      const windowH = window.innerHeight;
      setMaxHeight(windowH - HEADER_HEIGHT - TABS_HEIGHT - H2_MARGIN - BOTTOM_MENU_HEIGHT - PADDING_EXTRA);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // ----------- USAR ESFERA (Gacha) ------------
  const handleUsarEsfera = () => setOpening(true);

  const handleOpeningFinish = () => {
    const pool = getPool();
    const stock: { key: RarezaType; left: number }[] = Object.entries(pool)
      .filter(([_, val]) => val.left > 0)
      .map(([key, val]) => ({ key: key as RarezaType, left: val.left }));

    const totalRestantes = stock.reduce((acc, curr) => acc + curr.left, 0);
    if (totalRestantes === 0) {
      setPopup({
        img: '/store/noimg.png',
        nombre: 'Sin personajes',
        rareza: 'comun',
        nivel: 1,
        experiencia: 0,
        experienciaNecesaria: 100,
        statsBase: { vida: 0, poder: 0, mana: 0, energia: 0, suerte: 0, velocidad: 0, defensa: 0 },
        statsExtra: { vida: 0, poder: 0, mana: 0, energia: 0, suerte: 0, velocidad: 0, defensa: 0 },
        vidaActual: 0,
        manaActual: 0,
        energiaActual: 0,
        equipamiento: {},
        activo: false,
      });
      setOpening(false);
      return;
    }
    let r = Math.floor(Math.random() * totalRestantes);
    let chosenRareza: RarezaType = stock[0].key;
    for (let i = 0; i < stock.length; i++) {
      if (r < stock[i].left) {
        chosenRareza = stock[i].key;
        break;
      }
      r -= stock[i].left;
    }
    const poolPersonajes = pool[chosenRareza].personajes;
    const idx = Math.floor(Math.random() * poolPersonajes.length);
    const personaje = poolPersonajes[idx];

    // --- Aquí: Busca los stats base según el nombre ---
    const statsBase = statsBasePorPersonaje[personaje] ?? {
      vida: 80, poder: 10, mana: 10, energia: 9, suerte: 5, velocidad: 5, defensa: 5
    };

    const poolAtaquesElegida = (chosenRareza === "legendario")
      ? POOL_ATAQUES2
      : POOL_ATAQUES;

    // --- Genera 3 ataques únicos aleatorios ---
    function getRandomAttacks(pool: any[], n: number) {
      const arr = [...pool];
      const attacks = [];
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * arr.length);
        attacks.push(arr[idx]);
        arr.splice(idx, 1);
      }
      return attacks;
    }

    const personajeGenerado = {
      id: uuidv4(),
      tipo: "personaje",
      nombre: personaje,
      rareza: chosenRareza,
      img: `/gacha/${personaje.toLowerCase().replace(/ /g, "_")}.png`,
      activo: false,
      nivel: 1,
      experiencia: 0,
      experienciaNecesaria: 100,
      statsBase: { ...statsBase },
      statsExtra: { vida: 0, poder: 0, mana: 0, energia: 0, suerte: 0, velocidad: 0, defensa: 0 },
      vidaActual: statsBase.vida,
      manaActual: statsBase.mana,
      energiaActual: statsBase.energia,
      equipamiento: {
        cabeza: null, brazos: null, pecho: null, piernas: null, armaDerecha: null, armaIzquierda: null
      },
      ataques: getRandomAttacks(poolAtaquesElegida, 3),
      hechizos: [null, null],
      misionActiva: false,
    };

    updatePool(p => {
      p[chosenRareza].left = Math.max(0, p[chosenRareza].left - 1);
    });

    setInventario(prev => {
      const idxEsfera = prev.findIndex(item => item.itemCode === 'codesferas');
      let newArr = [...prev];
      if (idxEsfera !== -1) newArr.splice(idxEsfera, 1);
      newArr.push(personajeGenerado);
      return newArr;
    });

    setPopup({ ...personajeGenerado });
    setOpening(false);
  };

  // ----------- ACTIVAR PERSONAJE INDIVIDUAL (SOLO UNO) -----------
  const handleActivarPersonaje = (personajeId: string) => {
    if (trainingActive) return;
    setInventario(prev =>
      prev.map(item =>
        item.tipo === "personaje"
          ? { ...item, activo: item.id === personajeId }
          : item
      )
    );
    setPopup(null);
  };

  // ----------- MOSTRAR POPUP DE PERSONAJE INDIVIDUAL -----------
  const handleShowPersonaje = (item: any) => {
    setPopup(item);
  };

  // ----------- USAR CONSUMIBLE (vida, mana, energia, hechizo) -----------
const handleUsarConsumible = (item: any) => {
    // Hechizo: abrir modal de selección de personaje
    if (item.itemCode === "codhx") {
      if (!hechizoAleatorioPendiente) {
        const randomIdx = Math.floor(Math.random() * HECHIZOS_AVANZADOS.length);
        const nuevoHechizo = HECHIZOS_AVANZADOS[randomIdx];
        setHechizoAleatorioPendiente(nuevoHechizo);
      }
    }

    if (item.itemCode === "codh" || item.itemCode === "codhx") { 
      setHechizoConsumibleItem(item);
      setShowSelectPersonaje(true);
      setPersonajeAHechizar(null);
      return;
    }

    // Busca personaje activo para consumibles normales
    const personajeIdx = inventario.findIndex(p => p.tipo === "personaje" && p.activo);
    if (personajeIdx === -1) {
      setPopupError("No hay personaje activo.");
      return;
    }
    const personaje = inventario[personajeIdx];
    let modificado = { ...personaje };

    // Calcular totales
    const statsTotales = {
      vida: (modificado.statsBase?.vida ?? 0) + (modificado.statsExtra?.vida ?? 0),
      mana: (modificado.statsBase?.mana ?? 0) + (modificado.statsExtra?.mana ?? 0),
      energia: (modificado.statsBase?.energia ?? 0) + (modificado.statsExtra?.energia ?? 0),
    };

    // Validación de máximos con mensajes específicos
    if (item.title?.toLowerCase().includes("vida")) {
      if ((modificado.vidaActual ?? statsTotales.vida) >= statsTotales.vida) {
        setPopupError("La vida ya está al máximo.");
        return;
      }
    }
    if (item.title?.toLowerCase().includes("mana")) {
      if ((modificado.manaActual ?? statsTotales.mana) >= statsTotales.mana) {
        setPopupError("El mana ya está al máximo.");
        return;
      }
    }
    if (item.title?.toLowerCase().includes("energía") || item.title?.toLowerCase().includes("energia")) {
      if ((modificado.energiaActual ?? statsTotales.energia) >= statsTotales.energia) {
        setPopupError("La energía ya está al máximo.");
        return;
      }
    }

    // Si no está al máximo, aplica el consumible normalmente
    if (item.title?.toLowerCase().includes("vida")) {
      modificado.vidaActual = Math.min(statsTotales.vida, (modificado.vidaActual ?? statsTotales.vida) + (item.value ?? 0));
    }
    if (item.title?.toLowerCase().includes("mana")) {
      modificado.manaActual = Math.min(statsTotales.mana, (modificado.manaActual ?? statsTotales.mana) + (item.value ?? 0));
    }
    if (item.title?.toLowerCase().includes("energía") || item.title?.toLowerCase().includes("energia")) {
      modificado.energiaActual = Math.min(statsTotales.energia, (modificado.energiaActual ?? statsTotales.energia) + (item.value ?? 0));
    }

    // Quitar un consumible del inventario (de los agrupados)
    let firstIdx = inventario.findIndex(x =>
      x.itemCode === item.itemCode &&
      (item.value === undefined || x.value === item.value)
    );
    if (firstIdx === -1) return;

    let nuevoInv = [...inventario];
    nuevoInv[personajeIdx] = modificado;
    nuevoInv.splice(firstIdx, 1);

    setInventario(nuevoInv);
  };

  // ----------- AGRUPACIÓN DE CONSUMIBLES POR TÍTULO Y VALOR -----------
  const consumibles = inventario
    .filter(item => item.tipo === 'consumible' || (!item.tipo && tab === 'consumible'))
    .reduce((acc: Record<string, any>, item: any) => {
      const key = `${item.title || item.nombre || item.itemCode}_${item.value ?? ''}`;
      if (acc[key]) {
        acc[key].count += 1;
      } else {
        acc[key] = { ...item, count: 1 };
      }
      return acc;
    }, {});
  const consumibleArray = Object.values(consumibles);

  // ----------- AGRUPACIÓN DE EQUIPAMIENTO Y CANJES -----------
  const equipamiento = inventario
    .filter(item => item.tipo === 'equipamiento')
    .reduce((acc: Record<string, any>, item: any) => {
      const key = item.itemCode;
      if (acc[key]) acc[key].count += 1;
      else acc[key] = { ...item, count: 1 };
      return acc;
    }, {});
  const equipArray = Object.values(equipamiento);

  const personajesArray = inventario.filter(item => item.tipo === 'personaje');

  const canjes = inventario
    .filter(item => item.tipo === 'canje')
    .reduce((acc: Record<string, any>, item: any) => {
      const key = item.itemCode;
      if (acc[key]) acc[key].count += 1;
      else acc[key] = { ...item, count: 1 };
      return acc;
    }, {});
  const canjeArray = Object.values(canjes);

  // --- Modal para asignar hechizo a un personaje ---
const renderSelectPersonajeModal = () => {
  if (!showSelectPersonaje) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100002, background: "rgba(18,23,38,0.93)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#1a2036", borderRadius: 14, minWidth: 310, maxWidth: 410,
        boxShadow: "0 1px 16px #39aaff99", padding: "2em 2em 1.5em 2em", color: "#fff", textAlign: "center"
      }}>
        <h3 style={{ color: "#ffe94d", fontWeight: 900, fontSize: 20, marginBottom: 10 }}>
          Selecciona un personaje
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
         {personajesArray.map((pj: any) => {
            const selected = personajeAHechizar?.id === pj.id;
            return (
              <button
                key={pj.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: selected ? "linear-gradient(90deg,#ffe94d33 60%,#ffe94d22 100%)" : "#212940",
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontWeight: 800,
                  fontSize: 16,
                  border: selected ? "3px solid #ffe94d" : "2px solid #444c66",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: selected ? "0 0 5px 2px #ffe94d88" : "none",
                  outline: "none",
                  transition: "all 0.13s",
                  marginBottom: 4
                }}
                onClick={() => setPersonajeAHechizar(pj)}
              >
                <img
                  src={pj.img}
                  alt={pj.nombre}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 7,
                    objectFit: "cover",
                    background: "#232940",
                    marginRight: 8
                  }}
                />
                <span style={{ fontWeight: 900, color: selected ? "#39aaff" : "#fff", fontSize: 17 }}>
                  {pj.nombre}
                </span>
                <span style={{ marginLeft: "auto", color: "#ffe94d", fontSize: 15, fontWeight: 900 }}>
                  {pj.rareza}
                </span>
              </button>
            );
          })}
        </div>
      {/* Confirmar asignación de hechizo */}
      <div style={{ marginTop: 17 }}>
        {hechizoConsumibleItem && hechizoConsumibleItem.itemCode === 'codh' && (
          <button
            disabled={!personajeAHechizar}
            style={{
              marginTop: 4,
              background: personajeAHechizar ? "linear-gradient(90deg,#ffe94d 60%,#39aaff 100%)" : "#eee",
              color: personajeAHechizar ? "#232940" : "#aaa",
              border: "none",
              borderRadius: 7,
              fontWeight: 900,
              fontSize: 15,
              padding: "0.45em 1.4em",
              cursor: personajeAHechizar ? "pointer" : "not-allowed",
              opacity: personajeAHechizar ? 1 : 0.65,
              transition: "all 0.14s"
            }}
            onClick={() => {
              if (!personajeAHechizar) return;
              let hechizosArr = Array.isArray(personajeAHechizar.hechizos) ? [...personajeAHechizar.hechizos] : [null, null];

              // Contar la cantidad de hechizos "ocupados"
              const llenos = hechizosArr.filter(x => x && x.name).length;
               if (llenos >= 2) {
                  setShowHechizoMaxPopup(true);
                  setTimeout(() => setShowHechizoMaxPopup(false), 2000);
                  return;
                }

              // Encontrar el primer espacio vacío
              let primerEspacio = hechizosArr.findIndex(h => !h || !h.name);

              // Definir el nuevo hechizo
              let nuevoHechizo = {
                name: hechizoConsumibleItem.title,
                damage: hechizoConsumibleItem.value ?? 15,
                manaCost: hechizoConsumibleItem.manaCost ?? 15,
                type: hechizoConsumibleItem.type ?? "atk",
                efecto: hechizoConsumibleItem.efecto ?? "",
                descripcion: hechizoConsumibleItem.descripcion ?? ""
              };

              // Asignar el nuevo hechizo en el primer espacio vacío, si hay
              if (primerEspacio !== -1) {
                hechizosArr[primerEspacio] = nuevoHechizo;
              } else {
                hechizosArr.push(nuevoHechizo); // seguridad, nunca debería ocurrir
              }

              setInventario(prev => {
                let nuevo = prev.map(item =>
                  item.id === personajeAHechizar.id
                    ? { ...item, hechizos: hechizosArr }
                    : item
                );
                let consumido = false;
                nuevo = nuevo.filter(x => {
                  if (
                    !consumido &&
                    x.itemCode === hechizoConsumibleItem.itemCode &&
                    (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                  ) {
                    consumido = true;
                    return false;
                  }
                  return true;
                });
                return nuevo;
              });
              setShowSelectPersonaje(false);
              setPersonajeAHechizar(null);
              setHechizoConsumibleItem(null);
            }}
          >Asignar Hechizo</button>
        )}

         {hechizoConsumibleItem && hechizoConsumibleItem.itemCode === 'codhx' && (
                <>
                  <button
                    disabled={!personajeAHechizar}
                    style={{
                      marginTop: 4,
                      background: personajeAHechizar ? "linear-gradient(90deg,#ffe94d 60%,#39aaff 100%)" : "#eee",
                      color: personajeAHechizar ? "#232940" : "#aaa",
                      border: "none",
                      borderRadius: 7,
                      fontWeight: 900,
                      fontSize: 15,
                      padding: "0.45em 1.4em",
                      cursor: personajeAHechizar ? "pointer" : "not-allowed",
                      opacity: personajeAHechizar ? 1 : 0.65,
                      transition: "all 0.14s"
                    }}
                    onClick={() => {
                      if (!personajeAHechizar || !hechizoAleatorioPendiente) return;

                      let hechizo = hechizoAleatorioPendiente;
                      let hechizosArr = Array.isArray(personajeAHechizar.hechizos) ? [...personajeAHechizar.hechizos] : [null, null];
                      const llenos = hechizosArr.filter(x => x && x.name).length;

                      if (llenos >= 2) {
                        setNuevoHechizoPendiente(hechizo);
                        setShowHechizoReplacePopup(true);
                        return;
                      }

                      let primerEspacio = hechizosArr.findIndex(h => !h || !h.name);
                      if (primerEspacio !== -1) {
                        hechizosArr[primerEspacio] = hechizo;
                      } else {
                        hechizosArr.push(hechizo);
                      }

                      setInventario(prev => {
                        // Antes de consumir, cuenta la cantidad
                        const cantidadAntes = prev.filter(x =>
                          x.itemCode === hechizoConsumibleItem.itemCode &&
                          (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                        ).length;

                        let nuevo = prev.map(item =>
                          item.id === personajeAHechizar.id
                            ? { ...item, hechizos: hechizosArr }
                            : item
                        );
                        let consumido = false;
                        nuevo = nuevo.filter(x => {
                          if (
                            !consumido &&
                            x.itemCode === hechizoConsumibleItem.itemCode &&
                            (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                          ) {
                            consumido = true;
                            return false;
                          }
                          return true;
                        });

                        const cantidadDespues = nuevo.filter(x =>
                          x.itemCode === hechizoConsumibleItem.itemCode &&
                          (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                        ).length;

                        // SOLO si se descontó realmente un ítem, limpia el hechizo pendiente
                        if (cantidadDespues < cantidadAntes) {
                          setHechizoAleatorioPendiente(null);
                        }
                        return nuevo;
                      });

                      setShowSelectPersonaje(false);
                      setPersonajeAHechizar(null);
                      setHechizoConsumibleItem(null);
                    }}
                  >
                    Asignar Hechizo Aleatorio
                  </button>

                  {/* Popup para reemplazar hechizo si hay 2 llenos */}
                  {showHechizoReplacePopup && personajeAHechizar && (
                    <div style={{
                      position: "fixed", inset: 0, background: "rgba(16,22,38,0.93)", zIndex: 10004,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <div style={{
                        background: "#232940", borderRadius: 14, minWidth: 330, maxWidth: 410,
                        boxShadow: "0 1px 14px #ffe94d88", padding: "2em 2em 1.5em 2em", color: "#fff"
                      }}>
                        <h3 style={{ color: "#ffe94d", fontWeight: 900, fontSize: 19, marginBottom: 7 }}>
                          Elige el hechizo que quieres reemplazar
                        </h3>
                        <div style={{ display: "flex", gap: 18, margin: "15px 0" }}>
                          {personajeAHechizar.hechizos.map((h: any, idx: number) => (
                            <div key={idx} style={{ background: "#212940", borderRadius: 11, padding: "13px 14px", minWidth: 115 }}>
                              <div style={{ fontWeight: 900, color: "#39aaff", marginBottom: 4 }}>{h?.name || "Vacío"}</div>
                              <div style={{ fontWeight: 600, color: "#ffe94d", fontSize: 14 }}>{h?.efecto}</div>
                              <button
                                style={{
                                  marginTop: 8,
                                  background: "linear-gradient(90deg,#ffe94d 60%,#39aaff 100%)",
                                  color: "#232940",
                                  border: "none",
                                  borderRadius: 7,
                                  fontWeight: 900,
                                  fontSize: 15,
                                  padding: "0.32em 1.1em",
                                  cursor: "pointer"
                                }}
                                onClick={() => {
                                  let hechizosArr = Array.isArray(personajeAHechizar.hechizos)
                                    ? [...personajeAHechizar.hechizos]
                                    : [null, null];
                                  hechizosArr[idx] = nuevoHechizoPendiente || hechizoAleatorioPendiente;

                                  setInventario(prev => {
                                    const cantidadAntes = prev.filter(x =>
                                      x.itemCode === hechizoConsumibleItem.itemCode &&
                                      (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                                    ).length;

                                    let nuevo = prev.map(item =>
                                      item.id === personajeAHechizar.id
                                        ? { ...item, hechizos: hechizosArr }
                                        : item
                                    );
                                    let consumido = false;
                                    nuevo = nuevo.filter(x => {
                                      if (
                                        !consumido &&
                                        x.itemCode === hechizoConsumibleItem.itemCode &&
                                        (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                                      ) {
                                        consumido = true;
                                        return false;
                                      }
                                      return true;
                                    });

                                    const cantidadDespues = nuevo.filter(x =>
                                      x.itemCode === hechizoConsumibleItem.itemCode &&
                                      (hechizoConsumibleItem.value === undefined || x.value === hechizoConsumibleItem.value)
                                    ).length;

                                    if (cantidadDespues < cantidadAntes) {
                                      setHechizoAleatorioPendiente(null);
                                    }
                                    return nuevo;
                                  });

                                  setShowSelectPersonaje(false);
                                  setPersonajeAHechizar(null);
                                  setHechizoConsumibleItem(null);
                                  setNuevoHechizoPendiente(null);
                                  setShowHechizoReplacePopup(false);
                                }}
                              >Reemplazar</button>
                            </div>
                          ))}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <button
                            style={{
                              marginTop: 8,
                              background: "#e16464",
                              color: "#fff",
                              border: "none",
                              borderRadius: 7,
                              fontWeight: 900,
                              fontSize: 15,
                              padding: "0.39em 1.4em",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              setShowHechizoReplacePopup(false);
                              setNuevoHechizoPendiente(null);
                              // ¡NO LIMPIES hechizoAleatorioPendiente aquí! El hechizo sigue siendo el mismo para la próxima vez
                            }}
                          >Cancelar</button>
                        </div>
                        <div style={{ marginTop: 15, fontWeight: 700, color: "#aeefff", fontSize: 15 }}>
                          Nuevo Hechizo: <span style={{ color: "#ffe94d" }}>{(nuevoHechizoPendiente || hechizoAleatorioPendiente)?.name}</span> ({(nuevoHechizoPendiente || hechizoAleatorioPendiente)?.efecto})
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

        <button
          style={{
            marginTop: 8,
            background: "#e16464",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 900,
            fontSize: 15,
            padding: "0.39em 1.4em",
            cursor: "pointer"
          }}
          onClick={() => {
            setShowSelectPersonaje(false);
            setPersonajeAHechizar(null);
            setHechizoConsumibleItem(null);
          }}
        >Cancelar</button>
      </div>
              {/* POPUP para máximo de 2 hechizos */}
              {showHechizoMaxPopup && (
                <div style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(14,18,38,0.82)",
                  zIndex: 10001,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{
                    background: "#232940",
                    color: "#ffe94d",
                    borderRadius: 13,
                    fontWeight: 900,
                    fontSize: 18,
                    padding: "2.1em 2.4em",
                    boxShadow: "0 1px 14px #ffe94d66",
                    textAlign: "center"
                  }}>
                    <div>Este personaje ya tiene el máximo de 2 hechizos.</div>
                    <button
                      style={{
                        marginTop: 20,
                        background: "linear-gradient(90deg,#ffe94d 60%,#39aaff 100%)",
                        color: "#232940",
                        border: "none",
                        borderRadius: 7,
                        fontWeight: 900,
                        fontSize: 15,
                        padding: "0.45em 1.2em",
                        cursor: "pointer"
                      }}
                      onClick={() => setShowHechizoMaxPopup(false)}
                    >Entendido</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      };

  // Tabs y botón pool
  const mobileTabs = (
    <div style={{
      display: 'flex',
      position: 'sticky',
      top: 59,
      zIndex: 22,
      background: '#181d2a',
      borderBottom: '1px solid #232940',
      marginBottom: 12,
    }}>
      {INVENTORY_TABS.map(t => (
        <button key={t.key}
          onClick={() => setTab(t.key as any)}
          style={{
            flex: 1,
            padding: '0.7em 0',
            background: tab === t.key ? 'linear-gradient(90deg,#39aaff 60%,#2cc0fa 100%)' : 'transparent',
            color: tab === t.key ? '#181d2a' : '#aeefff',
            fontWeight: tab === t.key ? 900 : 700,
            border: 'none',
            borderBottom: tab === t.key ? '3px solid #fff' : '3px solid transparent',
            fontSize: 17,
            letterSpacing: 0.2,
            borderRadius: 0,
            cursor: 'pointer',
            transition: 'background 0.18s'
          }}>
          {t.label}
        </button>
      ))}
      <button
        style={{
          background: '#27335b',
          color: '#ffe94d',
          fontWeight: 900,
          border: 'none',
          borderRadius: 9,
          fontSize: 15,
          padding: '0.6em 1.1em',
          marginLeft: 7,
          boxShadow: '0 1px 6px #ffe94d33',
          cursor: 'pointer',
        }}
        onClick={() => setShowPool(true)}
      >Ver Pool Gacha</button>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      background: '#181d2a',
      boxSizing: 'border-box',
      paddingTop: HEADER_HEIGHT,
      paddingBottom: BOTTOM_MENU_HEIGHT,
      position: 'relative',
      maxWidth: 430,
      margin: '0 auto'
    }}>
      <TopBar username={username} />
      <div style={{
        margin: '0 12px 12px 12px',
        background: 'linear-gradient(90deg,#232940 60%,#283b65 110%)',
        borderRadius: 16,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.7em 0.3em 0.5em 0.3em',
        boxShadow: '0 2px 8px #39aaff15',
        position: 'relative',
        top: 0,
        zIndex: 10,
      }}>
        <div style={labelBoxStyle}>
          <div style={labelTitleStyle}>Realm</div>
          <div style={{ ...labelValueStyle, color: '#47e7ff' }}>{realmTokens ?? '-'}</div>
        </div>
        <div style={labelBoxStyle}>
          <div style={labelTitleStyle}>WLD</div>
          <div style={{ ...labelValueStyle, color: '#ffe94d' }}>{wldTokens ?? '-'}</div>
        </div>
      </div>

      <h2 style={{
        margin: `${H2_MARGIN}px 0 3px 12px`,
        fontWeight: 800,
        color: '#39aaff',
        fontSize: 20,
        letterSpacing: 0.1,
        textAlign: 'left'
      }}>
        Inventario
      </h2>

      {mobileTabs}

      {/* LISTA SCROLLEABLE */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          margin: '0 8px 0 8px',
          overflowY: 'auto',
          maxHeight: maxHeight,
          paddingBottom: 0,
        }}
      >
        {/* ---- CONSUMIBLES AGRUPADOS ---- */}
        {tab === 'consumible' && (
          consumibleArray.length === 0 ? (
            <EmptySection msg="No tienes esferas ni consumibles." />
          ) : (
            consumibleArray.map((item: any, idx: number) => (
              <ItemCard
                key={item.itemCode + "_" + (item.value ?? "") + "_" + idx}
                item={item}
                count={item.count}
                onUsarEsfera={item.itemCode === 'codesferas' ? handleUsarEsfera : undefined}
                // Personaliza para abrir modal en codh/codhx
                onUsarConsumible={item.tipo === 'consumible' && item.itemCode !== 'codesferas' ? handleUsarConsumible : undefined}
              />
            ))
          )
        )}
        {/* ---- EQUIPAMIENTO ---- */}
        {tab === 'equipamiento' && (
          equipArray.length === 0 ? (
            <EmptySection msg="No tienes equipamiento aún." />
          ) : (
            equipArray.map((item: any) => (
              <ItemCard key={item.itemCode} item={item} count={item.count} />
            ))
          )
        )}
        {/* ---- CANJE ---- */}
        {tab === 'canje' && (
          canjeArray.length === 0 ? (
            <EmptySection msg="No tienes canjes aún." />
          ) : (
            canjeArray.map((item: any) => (
              <ItemCard key={item.itemCode} item={item} count={item.count} />
            ))
          )
        )}
        {/* ---- PERSONAJES ---- */}
        {tab === 'personaje' && (
          personajesArray.length === 0 ? (
            <EmptySection msg="No tienes personajes aún." />
          ) : (
            personajesArray.map((item: any) => (
              <PersonajeCard key={item.id} item={item} onShowPopup={handleShowPersonaje} trainingActive={trainingActive} />
            ))
          )
        )}
        <div style={{ height: BOTTOM_MENU_HEIGHT + 24 }} />
      </div>

      {/* POPUPS */}
      {opening && <OpeningAnimado onFinish={handleOpeningFinish} />}
      {popup && (
        <PersonajePopup
          item={popup}
          onClose={() => setPopup(null)}
          onActivate={handleActivarPersonaje}
          trainingActive={trainingActive}
        />
      )}
      {renderSelectPersonajeModal()}
      {showPool && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 20000,
          background: 'rgba(12,19,39,0.88)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div
            style={{
              background: '#19213a',
              borderRadius: 18,
              color: '#fff',
              padding: '2.2em 2em 2.1em 2em',
              boxShadow: '0 8px 32px #000b',
              minWidth: 320,
              maxWidth: 420,
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ color: '#39aaff', marginBottom: 14 }}>Pool Gacha - Stock Restante</h3>
            {Object.entries(getPool()).map(([rareza, data]: any) => (
              <div key={rareza} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, color: '#ffe94d', fontSize: 16 }}>
                  {rareza.toUpperCase()}: <span style={{ color: '#aeefff' }}>{data.left} restantes</span>
                </div>
                <ul style={{ margin: '4px 0 0 20px', padding: 0, color: '#fff' }}>
                  {data.personajes.map((pj: string, i: number) => (
                    <li key={pj + i} style={{ fontSize: 15 }}>
                      {pj}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              style={{
                marginTop: 10,
                background: 'linear-gradient(90deg,#31bc47 70%,#39aaff 100%)',
                color: '#191f33',
                border: 'none',
                borderRadius: 7,
                fontWeight: 800,
                fontSize: 15,
                padding: '0.5em 1.3em',
                cursor: 'pointer',
              }}
              onClick={() => setShowPool(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* POPUP DE ERROR GENERAL */}
      {popupError && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100002, background: "rgba(18,23,38,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#232940", borderRadius: 14, minWidth: 280, maxWidth: 360,
            boxShadow: "0 1px 18px #e1646488", padding: "2em 2em 1.5em 2em", color: "#ffe94d", textAlign: "center"
          }}>
            <h3 style={{ fontWeight: 900, fontSize: 19, marginBottom: 9 }}>{popupError}</h3>
            <button
              style={{
                marginTop: 10,
                background: 'linear-gradient(90deg,#ffe94d 70%,#39aaff 100%)',
                color: '#232940',
                border: "none",
                borderRadius: 7,
                fontWeight: 900,
                fontSize: 15,
                padding: "0.45em 1.4em",
                cursor: "pointer"
              }}
              onClick={() => setPopupError(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <MenuBar
        selected="inventory"
        onSelect={menuKey =>
          (window.location.pathname = menuKey === 'home' ? '/' : `/${menuKey}`)
        }
      />
    </div>
  );
};
// ------------- COMPONENTES INDIVIDUALES ------------- //

const PersonajeCard = ({ item, onShowPopup, trainingActive }: { item: any; onShowPopup: (item: any) => void; trainingActive: boolean }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      background: '#232940',
      borderRadius: 13,
      boxShadow: '0 2px 10px #13161c29',
      padding: '11px 12px',
      gap: 13,
      cursor: 'pointer',
      border: `3.5px solid ${rarezaBorder[item.rareza] ?? '#aaa'}`,
      outline: item.activo ? '3px solid #ffe94d' : 'none',
      outlineOffset: '2px',
      position: 'relative',
      transition: 'outline 0.2s',
      opacity: trainingActive && !item.activo ? 0.8 : 1,
    }}
    onClick={() => onShowPopup(item)}
  >
    <img
      src={item.img}
      alt={item.nombre}
      style={{
        width: 48,
        height: 48,
        borderRadius: 7,
        objectFit: 'contain',
        background: '#111',
        boxShadow: '0 1px 6px #111a',
        border: item.activo ? '2px solid #ffe94d' : 'none',
        transition: 'border 0.15s'
      }}
      onError={e => (e.currentTarget.src = '/store/noimg.png')}
    />
    <div style={{ flex: 1 }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{item.nombre}</div>
      <div style={{ color: '#ffe94d', fontWeight: 600, fontSize: 14 }}>{item.rareza}</div>
      {item.activo && (
        <div style={{
          color: '#ffe94d',
          fontWeight: 900,
          fontSize: 14,
          marginTop: 2,
          textShadow: '0 1px 5px #000a'
        }}>¡Activo!</div>
      )}
      {!item.activo && trainingActive && (
        <div style={{
          color: '#ffe94d', fontWeight: 700, fontSize: 13, marginTop: 3
        }}>No puedes cambiar de personaje durante un entrenamiento</div>
      )}
    </div>
  </div>
);

const PersonajePopup = ({
  item,
  onClose,
  onActivate,
  trainingActive
}: {
  item: any,
  onClose: () => void,
  onActivate: (id: string) => void,
  trainingActive: boolean
}) => {
  const [pagina, setPagina] = useState(0); // 0: Stats, 1: Ataques/Hechizos

  // Flecha estilo dorado para cambiar de página
  const flechaStyle: React.CSSProperties = {
    fontSize: 32,
    color: "#ffe94d",
    cursor: "pointer",
    fontWeight: 900,
    background: "none",
    border: "none",
    outline: "none",
    margin: "0 9px",
    padding: 0,
    lineHeight: 1,
    transition: "transform 0.12s"
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      background: 'rgba(12,19,39,0.84)', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        background: '#191f33',
        color: '#fff',
        borderRadius: 15,
        boxShadow: '0 8px 32px #000b',
        padding: '2em 1.1em 2em 1.1em',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 400,
        minWidth: 230,
        maxHeight: '85vh',
        overflowY: 'auto',
        border: `5px solid ${rarezaBorder[item.rareza] ?? '#fff'}`,
        outline: item.activo ? '4px solid #ffe94d' : 'none',
        outlineOffset: '3px',
        transition: 'outline 0.2s',
        position: 'relative'
      }}>        
        {/* VISTA PRINCIPAL */}
        {pagina === 0 ? (
          <>
            <img
              src={item.img}
              alt={item.nombre}
              style={{
                width: 100,
                height: 100,
                borderRadius: 11,
                objectFit: 'contain',
                background: '#222',
                marginRight: 20,
                boxShadow: '0 1px 12px #5faeff66',
                border: item.activo ? '3px solid #ffe94d' : 'none',
                transition: 'border 0.15s'
              }}
              onError={e => (e.currentTarget.src = '/store/noimg.png')}
            />
            <div>
              <div style={{
                fontWeight: 900, fontSize: 20, color: '#39aaff', marginBottom: 2,
                textTransform: 'capitalize'
              }}>
                {item.nombre}
              </div>
              <div style={{
                color: '#ffe94d',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 1.2,
                marginBottom: 10,
                marginTop: 3,
                textTransform: 'uppercase'
              }}>
                {item.rareza}
              </div>
              <div style={{
                fontWeight: 500, fontSize: 13, color: '#fff',
                marginBottom: 9, lineHeight: '1.9em',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '16px',
                rowGap: '2px'
              }}>
                <div><b>Nivel:</b> {item.nivel ?? 1}</div>
                <div><b>Exp:</b> {item.experiencia ?? 0} / {item.experienciaNecesaria ?? 100}</div>
                <div><b>Vida:</b> {item.vidaActual ?? item.statsBase?.vida} / {item.statsBase?.vida}</div>
                <div><b>Mana:</b> {item.manaActual ?? item.statsBase?.mana} / {item.statsBase?.mana}</div>
                <div><b>Energía:</b> {item.energiaActual ?? item.statsBase?.energia} / {item.statsBase?.energia}</div>
                <div><b>Poder:</b> {item.statsBase?.poder}</div>
                <div><b>Suerte:</b> {item.statsBase?.suerte}</div>
                <div><b>Velocidad:</b> {item.statsBase?.velocidad}</div>
                <div><b>Defensa:</b> {item.statsBase?.defensa}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button style={{
                  background: 'linear-gradient(90deg,#31bc47 70%,#39aaff 100%)',
                  color: '#191f33', border: 'none', borderRadius: 7,
                  fontWeight: 800, fontSize: 15, padding: '0.45em 1.2em',
                  cursor: 'pointer',
                }} onClick={onClose}>Cerrar</button>
                {!item.activo && (
                  <button style={{
                    background: trainingActive
                      ? 'linear-gradient(90deg,#ccc 60%,#eee 100%)'
                      : 'linear-gradient(90deg,#ffe94d 60%,#fff1bc 100%)',
                    color: trainingActive ? '#888' : '#191f33',
                    border: 'none', borderRadius: 7, fontWeight: 900, fontSize: 15,
                    padding: '0.45em 1.2em',
                    cursor: trainingActive ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 12px #ffe94d80',
                    opacity: trainingActive ? 0.7 : 1
                  }}
                    disabled={trainingActive}
                    title={trainingActive ? "No puedes cambiar el personaje mientras está entrenando." : ""}
                    onClick={() => !trainingActive && onActivate(item.id)}
                  >
                    Activar
                  </button>
                )}
              </div>
              {/* Flecha DERECHA */}           

              {trainingActive && !item.activo && (
                <div style={{ color: '#ffe94d', fontWeight: 700, marginTop: 8 }}>
                  ⚠️ No puedes activar otro personaje durante un entrenamiento.
                </div>
              )}
            </div>
             <button style={{ ...flechaStyle, position: "absolute", right: -10, top: 239, padding: '0.20em 0.2em'}}
              onClick={() => setPagina(1)}
              title="Ver ataques y hechizos"
            >{">"}</button>          
          </>
        ) : (
          // ----------- SEGUNDA PÁGINA: ATAQUES/HECHIZOS -----------
          <div style={{ width: "100%", minWidth: 200, maxWidth: 320 }}>
            <div style={{
              fontWeight: 900, color: "#39aaff", fontSize: 20, marginBottom: 8, textAlign: "center"
            }}>Ataques</div>
            {item.ataques && item.ataques.length > 0 ? (
              item.ataques.map((atk: any, idx: number) => (
                <div key={idx} style={{
                  marginBottom: 7,
                  background: "#222a37",
                  borderRadius: 8,
                  padding: "7px 13px"
                }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#aeefff" }}>
                    {atk.name}
                  </div>
                  <div style={{ fontSize: 14, color: "#fff", marginLeft: 2 }}>
                    Daño: <b>{atk.damage}</b> | Mana: <b>-{atk.manaCost}</b> | Tipo: <b>{atk.type?.toUpperCase()}</b>
                    {atk.efecto && atk.efecto !== "" && (
                      <span style={{ color: "#ffe94d", marginLeft: 10 }}>
                        {/* Traducción de efectos */}
                        {atk.efecto.startsWith('defensa') && `Aumenta ${atk.efecto.replace('defensa', '')} defensa`}
                        {atk.efecto.startsWith('vida') && `Cura ${atk.efecto.replace('vida', '')} vida`}
                        {atk.efecto.startsWith('steal') && `Roba ${atk.efecto.replace('steal', '')}% vida`}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#ccc", fontWeight: 600 }}>Sin ataques</div>
            )}
            <div style={{
              fontWeight: 900, color: "#ffe94d", fontSize: 20, margin: "13px 0 7px 0", textAlign: "center"
            }}>Hechizos</div>
            <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
              {item.hechizos && item.hechizos.length > 0
                ? item.hechizos.map((h: any, idx: number) =>
                  h && h.name ? (
                    <div key={idx} style={{
                      background: "#232940",
                      borderRadius: 7,
                      padding: "7px 11px",
                      minWidth: 110
                    }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#aeefff" }}>{h.name}</div>
                      <div style={{ fontSize: 13, color: "#fff" }}>
                        Daño: <b>{h.damage}</b> | Mana: <b>-{h.manaCost}</b> | Tipo: <b>{h.type?.toUpperCase()}</b>
                        {h.efecto && h.efecto !== "" && (
                          <span style={{ color: "#ffe94d", marginLeft: 7 }}>
                            {h.efecto}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} style={{
                      background: "#222a37",
                      borderRadius: 7,
                      padding: "7px 11px",
                      color: "#ccc",
                      fontWeight: 700,
                      minWidth: 110,
                      textAlign: "center"
                    }}>
                      Aprende un hechizo nuevo
                    </div>
                  )
                )
                : <div style={{ color: "#ccc", fontWeight: 600 }}>Sin hechizos</div>
              }
            </div>
            {/* Flecha IZQUIERDA abajo para volver */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 22 }}>
              <button style={flechaStyle}
                onClick={() => setPagina(0)}
                title="Volver"
              >Volver</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemCard = ({
  item,
  count,
  onUsarEsfera,
  onUsarConsumible,
}: {
  item: any;
  count?: number;
  onUsarEsfera?: () => void;
  onUsarConsumible?: (item: any) => void;
}) => (
  <div
    key={item.itemCode}
    style={{
      display: 'flex',
      alignItems: 'center',
      background: '#232940',
      borderRadius: 14,
      boxShadow: '0 2px 12px #13161c44',
      padding: '12px 18px',
      gap: 18,
      marginBottom: 8,
    }}
  >
    <img
      src={item.img}
      alt={item.title || item.nombre}
      style={{
        width: 56,
        height: 56,
        borderRadius: 9,
        objectFit: 'contain',
        background: '#111',
        boxShadow: '0 1px 8px #111a',
      }}
      onError={e => (e.currentTarget.src = '/store/noimg.png')}
    />
    <div style={{ flex: 1 }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
        {item.title || item.nombre}
      </div>
    </div>
    {count !== undefined && (
      <div
        style={{
          color: '#39aaff',
          fontWeight: 800,
          fontSize: 17,
          minWidth: 38,
          background: '#101624',
          borderRadius: 9,
          textAlign: 'center',
          padding: '7px 14px',
        }}
      >
        x{count}
      </div>
    )}
    {onUsarEsfera && (
      <button
        style={{
          background: 'linear-gradient(90deg,#39aaff 60%,#31bc47 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.6em 1.3em',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          marginLeft: 18,
        }}
        onClick={e => {
          e.stopPropagation();
          onUsarEsfera();
        }}
      >
        Usar
      </button>
    )}
    {/* Botón para consumibles (vida, mana, energía, hechizo) */}
    {!onUsarEsfera && item.tipo === "consumible" && item.itemCode !== 'codesferas' && (
      <button
        style={{
          background: 'linear-gradient(90deg,#39aaff 60%,#ffe94d 100%)',
          color: '#232940',
          border: 'none',
          borderRadius: 8,
          padding: '0.6em 1.3em',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          marginLeft: 12,
        }}
        onClick={e => {
          e.stopPropagation();
          onUsarConsumible && onUsarConsumible(item);
        }}
      >Usar</button>
    )}
  </div>
);

const EmptySection = ({ msg }: { msg: string }) => (
  <div
    style={{
      color: '#ccc',
      fontWeight: 600,
      background: '#21263a',
      borderRadius: 14,
      padding: '2em 1em',
      textAlign: 'center',
      marginBottom: 10,
    }}
  >
    {msg}
  </div>
);

export default InventoryScreen;