import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMissionSlots from "../hooks/useMissionSlots";
import type { MissionSlot } from "../hooks/useMissionSlots";
import MenuBar from "./MenuBar";
import TopBar from "./TopBar";

// ----------- Tipos ----------- //
interface Personaje {
  id: string;
  nombre: string;
  img: string;
  rareza: string;
  tipo: string;
  energiaActual: number;
  vidaActual: number;
  manaActual: number;
  statsBase: Record<string, number>;
  statsExtra: Record<string, number>;
}

interface Mission {
  key: string;
  label: string;
  duracionHoras: number;
  energiaCost: number;
  poderMin: number;
  realmReward: number;
  personajesRequeridos: number;
  drops?: any[];
}

const MISIONES: Mission[] = [
  { key: "mision2h", label: "Misión Corta (2h)", duracionHoras: 2, energiaCost: 12, poderMin: 12, realmReward: 50, personajesRequeridos: 1 },
  { key: "mision4h", label: "Misión Media (4h)", duracionHoras: 4, energiaCost: 22, poderMin: 18, realmReward: 130, personajesRequeridos: 1 },
  { key: "mision6h", label: "Misión Doble (6h)", duracionHoras: 6, energiaCost: 35, poderMin: 24, realmReward: 230, personajesRequeridos: 2 },
];

const MISIONES_ESPECIALES: Mission[] = [
  { key: "especial12h", label: "Especial (12h)", duracionHoras: 12, energiaCost: 40, poderMin: 30, realmReward: 500, personajesRequeridos: 1 },
  { key: "especial24h", label: "Especial (24h)", duracionHoras: 24, energiaCost: 50, poderMin: 40, realmReward: 1200, personajesRequeridos: 1 },
  { key: "especial48h", label: "Especial (48h)", duracionHoras: 48, energiaCost: 70, poderMin: 50, realmReward: 3000, personajesRequeridos: 1 },
];

const TAB_DEFINITIONS = [
  { key: "misiones", label: "Misiones", color: "#39aaff" },
  { key: "aventura", label: "Aventura", color: "#aeefff" },
  { key: "especiales", label: "Misiones Especiales", color: "#ffe94d" },
];

const neonStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontWeight: 900,
  color: "#39aaff",
  textShadow: "0 0 8px #39aaff, 0 0 24px #39aaffaa",
  fontSize: 19,
  letterSpacing: 1.5,
};

// --------- COMPONENTE PRINCIPAL --------- //
const MissionScreen: React.FC<{
  username: string;
  inventario: Personaje[];
  setInventario: React.Dispatch<React.SetStateAction<Personaje[]>>;
  realmTokens: number;
  setRealmTokens: React.Dispatch<React.SetStateAction<number>>;
  wldTokens: number;
  setWldTokens: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  username,
  inventario,
  setInventario,
  realmTokens,
  setRealmTokens,
  wldTokens,
  setWldTokens,
}) => {
  const navigate = useNavigate();
  const { slotId } = useParams<{ slotId: string }>();
  const idNum = Number(slotId);

  const [tab, setTab] = useState(0);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    slots,
    enviarAMision,
    liberarSlot,
    desbloquearSlot,
    getTimeLeft,
  } = useMissionSlots();

  const slot: MissionSlot | undefined = slots.find((s) => s.id === idNum);

  // Timer para refrescar
  useEffect(() => {
    const intv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(intv);
  }, []);

  // Libera slot al terminar misión (seguridad extra)
  const msLeft = getTimeLeft(idNum);
  useEffect(() => {
    if (slot && slot.ocupado && msLeft <= 0) liberarSlot(slot.id);
  }, [msLeft, slot, liberarSlot]);

  // ----- Personajes disponibles para seleccionar -----
  // No estén ocupados en NINGÚN slot
  const personajesDisponibles: Personaje[] = useMemo(
    () =>
      inventario.filter(
        (p) =>
          p.tipo === "personaje" &&
          !slots.some((s) => s.ocupado && s.personajeId === p.id)
      ),
    [inventario, slots]
  );

  // ---- Calcula stats (puedes refinarlo si tienes otra lógica) ----
  function calcularStatsTotales(pj: Personaje) {
    return {
      vida: (pj.statsBase?.vida ?? 0) + (pj.statsExtra?.vida ?? 0),
      energia: (pj.statsBase?.energia ?? 0) + (pj.statsExtra?.energia ?? 0),
      mana: (pj.statsBase?.mana ?? 0) + (pj.statsExtra?.mana ?? 0),
      poder: (pj.statsBase?.poder ?? 0) + (pj.statsExtra?.poder ?? 0),
      suerte: (pj.statsBase?.suerte ?? 0) + (pj.statsExtra?.suerte ?? 0),
      velocidad: (pj.statsBase?.velocidad ?? 0) + (pj.statsExtra?.velocidad ?? 0),
      defensa: (pj.statsBase?.defensa ?? 0) + (pj.statsExtra?.defensa ?? 0),
    };
  }

  // Personaje en misión (si slot ocupado)
  const personajeEnCurso = slot?.ocupado
    ? inventario.find((p) => p.id === slot.personajeId)
    : undefined;

  // ----- INICIAR MISIÓN -----
function handleIniciarMision(m: Mission, personajesUsados: Personaje[]) {
  for (const pj of personajesUsados) {
    const stats = calcularStatsTotales(pj);
    if (pj.energiaActual < m.energiaCost) {
      alert(`${pj.nombre} no tiene suficiente energía (${m.energiaCost})`);
      return;
    }
    if (stats.poder < m.poderMin) {
      alert(`${pj.nombre} no tiene suficiente poder (${m.poderMin})`);
      return;
    }
  }
  // Quita energía
  personajesUsados.forEach((pj) => {
    setInventario((inv: Personaje[]) =>
      inv.map((i) =>
        i.id === pj.id
          ? { ...i, energiaActual: Math.max(0, i.energiaActual - m.energiaCost) }
          : i
      )
    );
  });
  // Marca misión en slot (solo el primero para misiones simples)
  if (slot) {
    enviarAMision(slot.id, personajesUsados[0].id, m.duracionHoras * 60 * 60 * 1000);
    setSelectedCharacters([]);
  }
}

  // ----- FINALIZAR -----
  function handleFinalizarMision(reward: number) {
    if (slot) {
      liberarSlot(slot.id);
      setRealmTokens((t) => t + reward);
    }
  }

  // ------ INTERFAZ PRINCIPAL ------
  if (!slot) {
    return (
      <div style={{ color: "#ffe94d", fontWeight: 900, textAlign: "center", marginTop: 80 }}>
        <div>Slot de misión no encontrado.</div>
        <button
          style={{
            background: "#232940",
            color: "#39aaff",
            border: "1.2px solid #39aaff",
            borderRadius: 9,
            fontWeight: 800,
            fontSize: 15,
            padding: "0.44em 1.4em",
            marginTop: 18,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </div>
    );
  }

  // --- TAB DE DATOS DEL PERSONAJE (primero disponible) ---
  const personaje = personajesDisponibles[0];

  // ------ RENDER ------
  return (
    <>
      <TopBar username={username} />
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#181d2a",
          color: "#fff",
          paddingTop: 65,
          paddingBottom: 60,
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18, color: "#ffe94d", margin: "0 0 8px 0" }}>
          Misiones · Portal {idNum}
        </div>
        {/* Personaje activo arriba */}
        {personaje && (
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
                  onClick={() => alert("Aquí puedes mostrar un modal con stats avanzados")}
                >
                  Stats
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', marginBottom: 12, gap: 3 }}>
          {TAB_DEFINITIONS.map((t, idx) => (
            <button
              key={t.key}
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

        {/* ------ Estado misión en curso ------ */}
        {slot.ocupado && personajeEnCurso ? (
          <div style={{
            background: "#232940",
            color: "#fff",
            borderRadius: 15,
            padding: "2em 1.3em 1.7em 1.3em",
            margin: "18px 0 0 0",
            boxShadow: "0 1px 14px #23294066",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#ffe94d", fontWeight: 900, fontSize: 18, marginBottom: 13 }}>
              {personajeEnCurso.nombre} está en misión
            </h3>
            <div style={{ color: "#aeefff", marginBottom: 7 }}>
              Termina en: <span style={neonStyle}>{msLeft > 0 ? new Date(msLeft).toISOString().substr(11, 8) : "¡Completado!"}</span>
            </div>
            {/* Puedes guardar la misión activa en el slot para mostrar recompensa */}
            <button
              style={{
                background: "linear-gradient(90deg,#ffe94d 60%,#39aaff 100%)",
                color: "#232940",
                border: "none",
                borderRadius: 8,
                fontWeight: 900,
                fontSize: 16,
                padding: "0.6em 1.8em",
                cursor: "pointer"
              }}
              onClick={() => handleFinalizarMision(100)}
            >
              Reclamar Recompensa
            </button>
          </div>
        ) : (
          <div style={{ maxHeight: 340, overflowY: "auto", paddingRight: 2 }}>
            {tab === 0 && renderMisiones(MISIONES)}
            {tab === 1 && renderAventura()}
            {tab === 2 && renderMisiones(MISIONES_ESPECIALES)}
          </div>
        )}

        {/* Botón de regreso */}
        <div style={{ margin: "24px 0 0 0", textAlign: "center" }}>
          <button
            style={{
              background: "#232940",
              color: "#39aaff",
              border: "1.2px solid #39aaff",
              borderRadius: 9,
              fontWeight: 800,
              fontSize: 15,
              padding: "0.44em 1.4em",
              marginTop: 18,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Volver
          </button>
        </div>
      </div>
      <MenuBar
        selected="missions"
        onSelect={(menuKey) => navigate(menuKey === "home" ? "/" : `/${menuKey}`)}
      />
    </>
  );

  // ---- Funciones de Renderizado ----
function renderMisiones(misiones: Mission[]) {
  return (
    <div>
      {misiones.map((m) => {
        const req2 = m.personajesRequeridos === 2;
        return (
          <div
            key={m.key}
            style={{
              background: "#232940",
              borderRadius: 10,
              boxShadow: "0 2px 8px #13161c33",
              padding: "14px 10px",
              marginBottom: 11,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: req2 ? "#ffe94d" : "#39aaff",
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: 13, color: "#aeefff", margin: "4px 0 7px 0" }}>
              Duración: {m.duracionHoras} horas &nbsp;·&nbsp; Energía -{m.energiaCost} &nbsp;·&nbsp; Poder mínimo: {m.poderMin}
              {req2 && <> &nbsp;·&nbsp; <b>Se requieren 2 personajes</b></>}
            </div>
            <div style={{ color: "#ffe94d", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
              Recompensa: {m.realmReward} Realm Tokens
            </div>

            <div style={{ margin: "8px 0 7px 0", color: "#fff", fontWeight: 700 }}>
              <b>Selecciona {req2 ? "dos" : "un"} personaje{req2 ? "s" : ""} disponible{req2 ? "s" : ""}:</b>
            </div>
            {/* Grid ordenado */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(138px, 1fr))",
                gap: 8,
                marginBottom: 7,
              }}
            >
              {personajesDisponibles.map((p: Personaje) => (
                <button
                  key={p.id}
                  style={{
                    background: selectedCharacters.includes(p.id) ? "#39aaff" : "#181d2a",
                    color: selectedCharacters.includes(p.id) ? "#fff" : "#39aaff",
                    border: selectedCharacters.includes(p.id)
                      ? "2px solid #ffe94d"
                      : "1.2px solid #232940",
                    borderRadius: 7,
                    fontWeight: 700,
                    fontSize: 13,
                    padding: "12px 7px",
                    minHeight: 44,
                    marginBottom: 4,
                    cursor: slot?.ocupado
                      ? "not-allowed"
                      : "pointer",
                    boxShadow: selectedCharacters.includes(p.id)
                      ? "0 2px 8px #ffe94d33"
                      : "0 1px 4px #181d2a22",
                    opacity:
                      req2
                        ? selectedCharacters.length >= 2 && !selectedCharacters.includes(p.id)
                          ? 0.55
                          : 1
                        : selectedCharacters.length >= 1 && !selectedCharacters.includes(p.id)
                          ? 0.55
                          : 1,
                  }}
                  onClick={() => {
                    if (selectedCharacters.includes(p.id)) {
                      setSelectedCharacters(selectedCharacters.filter(id => id !== p.id));
                    } else if (
                      selectedCharacters.length < (req2 ? 2 : 1)
                    ) {
                      setSelectedCharacters([...selectedCharacters, p.id]);
                    }
                  }}
                  disabled={
                    slot?.ocupado ||
                    (req2
                      ? selectedCharacters.length >= 2 && !selectedCharacters.includes(p.id)
                      : selectedCharacters.length >= 1 && !selectedCharacters.includes(p.id))
                  }
                >
                  {p.nombre}
                </button>
              ))}
            </div>
            <button
              style={{
                background:
                  selectedCharacters.length === (req2 ? 2 : 1) && !slot?.ocupado
                    ? "linear-gradient(90deg,#39aaff 60%,#31bc47 100%)"
                    : "#eee",
                color:
                  selectedCharacters.length === (req2 ? 2 : 1) && !slot?.ocupado
                    ? "#232940"
                    : "#888",
                border: "none",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
                padding: "0.44em 1.4em",
                cursor:
                  selectedCharacters.length === (req2 ? 2 : 1) && !slot?.ocupado
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  selectedCharacters.length === (req2 ? 2 : 1) && !slot?.ocupado
                    ? 1
                    : 0.5,
              }}
              disabled={
                selectedCharacters.length !== (req2 ? 2 : 1) ||
                !slot ||
                slot.ocupado
              }
              onClick={() => {
                const personajesUsados = personajesDisponibles.filter((p) =>
                  selectedCharacters.includes(p.id)
                );
                handleIniciarMision(m, personajesUsados);
              }}
            >
              Enviar a Misión
            </button>
          </div>
        );
      })}
    </div>
  );
}

  function renderAventura() {
    return (
      <div style={{
        background: "#232940",
        color: "#ffe94d",
        borderRadius: 12,
        padding: "2em 1em",
        margin: "12px auto",
        textAlign: "center",
        fontWeight: 900,
        fontSize: 17,
      }}>
        <div>¡La sección de Aventuras en equipo llegará pronto!</div>
        <div style={{ fontWeight: 600, color: "#aeefff", marginTop: 12 }}>¡Podrás explorar con amigos!</div>
      </div>
    );
  }
};

export default MissionScreen;
