import React from 'react';
export default function DropPopup({ drop, onClose }: any) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10099, background: "rgba(20,18,30,0.82)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#20222b", borderRadius: 14, boxShadow: "0 1px 18px #13161c88",
        color: "#ffe94d", fontWeight: 800, fontSize: 19, padding: "2.1em 2em 1.3em 2em", maxWidth: 340, textAlign: "center"
      }}>
        <img src={drop.img} alt={drop.title} style={{
          width: 70, height: 70, marginBottom: 11, borderRadius: 10, background: "#222"
        }} />
        <div style={{ marginBottom: 13 }}>{drop.title} {drop.value ? `x${drop.value}` : ""}</div>
        <button onClick={onClose} style={{
          background: "#39aaff", color: "#232940", fontWeight: 800, borderRadius: 7, fontSize: 16, padding: "0.6em 1.2em", border: "none"
        }}>Cerrar</button>
      </div>
    </div>
  );
}
