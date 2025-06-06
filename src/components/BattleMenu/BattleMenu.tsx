import React from 'react';
export default function BattleMenu({ onAttack, onDefend, onCastSpell, onUseConsumable, hechizos, mana }: any) {
  return (
    <div style={{
      display: "flex", gap: 13, margin: "20px 0 0 0", justifyContent: "center"
    }}>
      <button onClick={onAttack}>⚔️ Atacar</button>
      <button onClick={onDefend}>🛡️ Defender</button>
      {hechizos.map((spell: any, i: number) =>
        <button key={spell.nombre}
          onClick={() => onCastSpell(i)}
          disabled={mana < spell.costo}
        >
          {spell.nombre} {mana < spell.costo && <span style={{ color: "#e44" }}>Sin mana</span>}
        </button>
      )}
      <button onClick={onUseConsumable}>💊 Consumible</button>
    </div>
  );
}
