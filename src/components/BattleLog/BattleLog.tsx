import React from 'react';
export default function BattleLog({ log }: any) {
  return (
    <div style={{
      background: "#232940", color: "#ffe94d", margin: "18px 0 8px 0",
      borderRadius: 8, fontSize: 15, fontWeight: 600, padding: "0.9em 1.4em", minHeight: 40, minWidth: 260
    }}>
      {log.slice(-3).map((line: string, i: number) => <div key={i}>{line}</div>)}
    </div>
  );
}
