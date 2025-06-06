import React from 'react';
export default function BattleEffect({ effect }: any) {
  // Efecto flotante (daño, curación, etc.)
  if (!effect) return null;
  return (
    <div style={{
      position: "absolute",
      left: effect.target === "enemy" ? "62%" : "15%",
      top: "26%",
      fontWeight: 900,
      fontSize: 34,
      color: effect.type === "damage" ? "#e44" : effect.type === "heal" ? "#39aaff" : "#ffe94d",
      textShadow: "0 2px 10px #000a",
      pointerEvents: "none",
      animation: "moveUp 1s forwards"
    }}>
      {effect.type === "crit" ? "¡CRIT!" : ""}
      {effect.value > 0 ? ` ${effect.type === "heal" ? "+" : "-"}${effect.value}` : ""}
      <style>
        {`@keyframes moveUp {
          0% { opacity: 1; transform: translateY(0);}
          90% { opacity: 1;}
          100% { opacity: 0; transform: translateY(-50px);}
        }`}
      </style>
    </div>
  );
}
