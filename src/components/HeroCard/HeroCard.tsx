import React from 'react';
export default function HeroCard({ player, effect }: any) {
  return (
    <div style={{
      minWidth: 120, textAlign: "center"
    }}>
      <img src={player.img} alt={player.nombre} style={{
        width: 90, height: 90, borderRadius: 18,
        boxShadow: effect?.type === "damage" ? "0 0 20px #e44" : "0 1px 9px #111",
        filter: effect?.type === "crit" ? "drop-shadow(0 0 8px #ffe94d)" : undefined,
        transition: "box-shadow .2s, filter .2s"
      }} />
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{player.nombre}</div>
      <div style={{ color: "#39aaff", fontWeight: 700, fontSize: 13 }}>❤️ {player.vida} | 🔮 {player.mana}</div>
    </div>
  );
}
