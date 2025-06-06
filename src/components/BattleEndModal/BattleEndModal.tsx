import React from 'react';
export default function BattleEndModal({ result, onContinue }: any) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10100, background: "rgba(12,19,39,0.81)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: result === "victory" ? "#27335b" : "#912b2b",
        borderRadius: 18, color: "#fff", padding: "2.5em 2.2em 2.2em 2.2em",
        fontWeight: 800, fontSize: 22, textAlign: "center", boxShadow: "0 6px 28px #000a"
      }}>
        {result === "victory" ? "¡Victoria!" : "Derrota"}
        <div style={{ fontSize: 16, color: "#ffe94d", margin: "10px 0 18px" }}>
          {result === "victory" ? "¡Has derrotado al enemigo!" : "Te has quedado sin vida."}
        </div>
        <button onClick={onContinue} style={{
          background: "#39aaff", color: "#232940", fontWeight: 800, borderRadius: 7, fontSize: 16, padding: "0.6em 1.3em", border: "none"
        }}>Continuar</button>
      </div>
    </div>
  );
}
