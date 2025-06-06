import React, { useState } from 'react';
import MenuBar from './MenuBar';
import TopBar from './TopBar';
import { useNavigate } from 'react-router-dom';

interface StoreScreenProps {
  username: string;
  inventario: any[];
  setInventario: React.Dispatch<React.SetStateAction<any[]>>;
  realmTokens: number;
  setRealmTokens: React.Dispatch<React.SetStateAction<number>>;
  wldTokens: number;
  setWldTokens: React.Dispatch<React.SetStateAction<number>>;
  vida: number;
  setVida: React.Dispatch<React.SetStateAction<number>>;
  mana: number;
  setMana: React.Dispatch<React.SetStateAction<number>>;
  energia: number;
  setEnergia: React.Dispatch<React.SetStateAction<number>>;
}

const StoreScreen: React.FC<StoreScreenProps> = ({
  username, inventario, setInventario,
  realmTokens, setRealmTokens,
  wldTokens, setWldTokens,
  vida, setVida, mana, setMana, energia, setEnergia
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'oficial' | 'p2p' | 'canje'>('oficial');
  const [p2pPopup, setP2pPopup] = useState(false);
  const [balancePopup, setBalancePopup] = useState<{ visible: boolean, msg: string }>({ visible: false, msg: "" });
  const [successPopup, setSuccessPopup] = useState<{ visible: boolean, msg: string }>({ visible: false, msg: "" });

  // MOCK DATOS con value y res integrados
  const items = [
    { title: "Mana x50", value: 50, itemCode: "codmana50", tipo: "consumible", img: "/store/mana.png", price: 33, btn: "Comprar", token: "realm" },
    { title: "Energía x20", value: 20, itemCode: "codenergia20", tipo: "consumible", img: "/store/energia.png", price: 33, btn: "Comprar", token: "realm" },
    { title: "Vida x10", value: 10, itemCode: "codvida10", tipo: "consumible", img: "/store/vida.png", price: 33, btn: "Comprar", token: "realm" },
    { title: "Vida x50", value: 50, itemCode: "codvida50", tipo: "consumible", img: "/store/vida.png", price: 70, btn: "Comprar", token: "realm" },
    { title: "Resurrección", itemCode: "codres", tipo: "consumible", img: "/store/res.png", price: 55, btn: "Comprar", token: "realm", res: true },
    { title: "Rafaga Oscura", itemCode: "codh", tipo: "consumible",  damage: 20, manaCost: 24, type: "atk", efecto: "damagetime", img: "/store/hechizo.png", cant: 10, price: 500, btn: "Comprar", token: "realm"},
    { title: "La Marca del Rey", itemCode: "codh", tipo: "consumible", damage: 0, manaCost: 30, type: "atk", efecto: "damagex2", img: "/store/hechizo.png", price: 750, cant: 7, btn: "Comprar", token: "realm" },
    { title: "Escudo del monarca", itemCode: "codh", tipo: "consumible", damage: 0, manaCost: 30, type: "def", efecto: "defensex2", img: "/store/hechizo.png", price: 500, cant: 10, btn: "Comprar", token: "realm" },
    { title: "Hechizo Random", itemCode: "codhx", tipo: "consumible", img: "/store/hechizo.png", price: 1000, cant: 10, btn: "Comprar", token: "realm" }
  ];
  const equip = [
    { title: "Espada Épica", itemCode: "codespada", tipo: "equipamiento", img: "/store/espada.png", price: 333, btn: "Comprar", token: "realm" },
    { title: "Armadura Oscura", itemCode: "codarmadura", tipo: "equipamiento", img: "/store/armadura.png", price: 444, btn: "Comprar", token: "realm" },
    { title: "Anillo de Suerte", itemCode: "codanillo", tipo: "equipamiento", img: "/store/anillo.png", price: 150, btn: "Comprar", token: "realm" },
    { title: "Amuleto", itemCode: "codamuleto", tipo: "equipamiento", img: "/store/amuleto.png", price: 220, btn: "Comprar", token: "realm" },
    { title: "Botas", itemCode: "codbota", tipo: "equipamiento", img: "/store/botas.png", price: 175, btn: "Comprar", token: "realm" },
  ];
  const canjes = [
    { title: "Netflix", itemCode: "codnetflix", tipo: "canje", img: "/store/netflix.png", price: 1000, btn: "Canjear", token: "wld" },
    { title: "Disney+", itemCode: "coddisney", tipo: "canje", img: "/store/disney.png", price: 1000, btn: "Canjear", token: "wld" },
    { title: "Prime Video", itemCode: "codprime", tipo: "canje", img: "/store/prime.png", price: 1000, btn: "Canjear", token: "wld" },
    { title: "MAX", itemCode: "codmax", tipo: "canje", img: "/store/max.png", price: 1000, btn: "Canjear", token: "wld" },
    { title: "Canva Pro", itemCode: "codcanva", tipo: "canje", img: "/store/canva.png", price: 500, btn: "Canjear", token: "wld" },
    { title: "Antivirus", itemCode: "codantivirus", tipo: "canje", img: "/store/antivirus.png", price: 800, btn: "Canjear", token: "wld" },
    { title: "Paramount", itemCode: "codparamount", tipo: "canje", img: "/store/paramount.png", price: 1000, btn: "Canjear", token: "wld" },
    { title: "VIX", itemCode: "codvix", tipo: "canje", img: "/store/vix.png", price: 1000, btn: "Canjear", token: "wld" },
  ];

  // NUEVA FUNCION handleBuy: recibe el objeto completo item y copia todo (incluye value y res)
  function handleBuy(item: any) {
    const price = item.price;
    const token = item.token;
    // Validar tokens
    if (token === "realm") {
      if (!realmTokens || realmTokens < price) {
        setBalancePopup({ visible: true, msg: "Saldo insuficiente de Realm tokens" });
        return;
      }
      setRealmTokens(t => t - price);
    } else if (token === "wld") {
      if (!wldTokens || wldTokens < price) {
        setBalancePopup({ visible: true, msg: "Saldo insuficiente de WLD tokens" });
        return;
      }
      setWldTokens(w => w - price);
    }
    // AGREGAR AL INVENTARIO COPIANDO TODOS LOS CAMPOS DEL OBJETO
    // Le agregamos un ID único para evitar duplicados en el inventario
    const newItem = { ...item, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) };
    setInventario(inv => [...inv, newItem]);
    setSuccessPopup({ visible: true, msg: `${item.title} comprado correctamente. Puedes revisarlo en tu inventario.` });
  }

  const debugTopUp = (
    <div style={{ display: 'flex', gap: 10, margin: "8px 0 0 18px" }}>
      <button style={tabStyle} onClick={() => setRealmTokens(t => t + 1000)}>+1000 Realm</button>
      <button style={tabStyle} onClick={() => setWldTokens(w => w + 1000)}>+1000 WLD</button>
    </div>
  );

  return (
    <>
      <TopBar username={username} />
      <div style={{
        width: '100%',
        minHeight: '100%',
        background: '#181d2a',
        boxSizing: 'border-box',
        overflowY: 'auto',
        position: 'relative',
        paddingTop: 90,
        paddingBottom: 76,
      }}>
        {/* Tabs arriba */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 12,
          position: 'absolute',
          left: 0, right: 0,
          top: 58,
          zIndex: 12,
        }}>
          <button onClick={() => setTab('oficial')}
            style={tab === 'oficial' ? activeTabStyle : tabStyle}>Tienda Oficial</button>
          <button onClick={() => setTab('p2p')}
            style={tab === 'p2p' ? activeTabStyle : tabStyle}>P2P Jugadores</button>
          <button onClick={() => setTab('canje')}
            style={tab === 'canje' ? activeTabStyle : tabStyle}>Canjes</button>
        </div>

        {/* ---- STATUS ---- */}
        <div style={{
          margin: '0 14px 16px 14px',
          background: 'linear-gradient(90deg,#232940 60%,#283b65 110%)',
          borderRadius: 16,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.8em 0.5em 0.7em 0.5em',
          boxShadow: '0 2px 8px #39aaff15',
          position: 'relative',
          top: 44,
          zIndex: 10,
        }}>        
          <div style={labelBoxStyle}>
            <div style={labelTitleStyle}>Realm Tokens</div>
            <div style={{ ...labelValueStyle, color: '#47e7ff' }}>{realmTokens ?? '-'}</div>
          </div>
          <div style={labelBoxStyle}>
            <div style={labelTitleStyle}>WLD Tokens</div>
            <div style={{ ...labelValueStyle, color: '#ffe94d' }}>{wldTokens ?? '-'}</div>
          </div>
        </div>

        {debugTopUp}

        {/* ---- TIENDA OFICIAL ---- */}
        {tab === 'oficial' && (
          <div>
            {/* Banner ESFERA */}
            <div style={{
              background: 'linear-gradient(90deg, #283b65 60%, #2cc0fa 130%)',
              borderRadius: 24,
              boxShadow: '0 4px 24px #0006',
              margin: '55px 14px 24px 14px',
              display: 'flex',
              alignItems: 'center',
              padding: '1.4em 1.5em',
              gap: 30,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img src="/store/esfera.png" alt="Esfera" style={{
                width: 86,
                height: 86,
                filter: 'drop-shadow(0 0 16px #2cc0fa66)'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: '#fff',
                  fontSize: 21,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textShadow: '0 0 8px #010c208a'
                }}>¡Esfera de Maná!</div>
                <div style={{ color: '#ffec8b', fontWeight: 700, margin: '3px 0 5px 0', fontSize: 14 }}>
                  Gacha, edición limitada: <span style={{ color: '#fff' }}>10,000 disponibles</span>
                </div>
                <div style={{ color: '#aeefff', fontWeight: 500, fontSize: 13, marginBottom: 4 }}>
                  <b>¿Qué puede salir?</b> Cazador, Sombra, Monarca (100 legendarios) y más.
                </div>
                <div style={{ color: '#c7fd8e', fontSize: 16, fontWeight: 800 }}>
                  15 USD <span style={{ color: '#7dd7ff', fontWeight: 700 }}>· 1000 Realm</span>
                </div>
                <button style={bigBtn}
                onClick={() => handleBuy({
                    title: "Esfera de Maná",
                    itemCode: "codesferas",
                    tipo: "consumible", // <-- ¡AHORA APARECE EN INVENTARIO!
                    img: "/store/esfera.png",
                    price: 1000,
                    btn: "Comprar",
                    token: "realm"
                  })}
                >
                  Comprar Esfera
                </button>
              </div>
            </div>
            <h2 style={sectionTitleStyle}>Consumibles</h2>
            <SliderCards items={items} onBuy={handleBuy} />
            <h2 style={sectionTitleStyle}>Equipamiento</h2>
            <SliderCards items={equip} onBuy={handleBuy} />
          </div>
        )}

        {tab === 'p2p' && (
          <div style={{ margin: '26px 10px 0 10px' }}>
            <div style={{
              background: 'linear-gradient(90deg,#181d2a 60%,#191f33 110%)',
              borderRadius: 16,
              boxShadow: '0 2px 8px #2cc0fa33',
              padding: 18,
              marginBottom: 20,
            }}>
              <h2 style={{ color: '#39aaff', fontSize: 18, marginBottom: 7 }}>Marketplace P2P</h2>
              <p style={{ color: '#e1e6fc', marginBottom: 11 }}>
                Compra y vende entre jugadores. Selecciona o publica tu venta:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <P2PCard type="personaje" title="Cazador SSR" price="950 Realm" img="/store/cazadorSSR.png" />
                <P2PCard type="item" title="Mana x100" price="66 Realm" img="/store/mana.png" />
                <button
                  style={p2pBtnStyle}
                  onClick={() => {
                    if (inventario.length === 0) {
                      setP2pPopup(true);
                    } else {
                      // aquí pondrás el formulario
                    }
                  }}
                >
                  Publicar Venta
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'canje' && (
          <div>
            <h2 style={sectionTitleStyle}>Canjea tus Realm Tokens</h2>
            <div style={grid2col}>
              {canjes.map(item => (
                <StoreCard
                  key={item.itemCode}
                  title={item.title}
                  img={item.img}
                  price={item.price}
                  btn={item.btn}
                  token={item.token}
                  itemCode={item.itemCode}
                  tipo={item.tipo}
                  onBuy={() => handleBuy(item)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popups iguales que antes */}
      {p2pPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(12,19,39,0.83)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#191f33',
            borderRadius: 14,
            padding: '2.2em 1.5em 1.5em 1.5em',
            boxShadow: '0 8px 32px #000b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90vw',
            maxWidth: 320,
          }}>
            <h3 style={{
              color: '#ff7272',
              fontWeight: 700,
              margin: 0,
              fontSize: 20,
              textAlign: 'center',
            }}>
              No tienes items<br />disponibles para vender
            </h3>
            <p style={{
              color: '#ccd7fa',
              margin: '1em 0 2em 0',
              textAlign: 'center',
              fontSize: 15,
            }}>
              Primero obtén algún item en misiones<br />o desde la tienda para listar una venta P2P.
            </p>
            <button
              style={{
                background: 'linear-gradient(90deg,#222f46 70%,#39aaff 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                borderRadius: 7,
                fontSize: 15,
                padding: '0.6em 1.2em',
                cursor: 'pointer',
              }}
              onClick={() => setP2pPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {balancePopup.visible && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.74)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#191f33',
            borderRadius: 13,
            padding: '2.1em 1.5em 1.5em 1.5em',
            boxShadow: '0 8px 32px #000b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90vw',
            maxWidth: 320,
          }}>
            <h3 style={{
              color: '#ff7272',
              fontWeight: 700,
              margin: 0,
              fontSize: 20,
              textAlign: 'center',
            }}>
              {balancePopup.msg}
            </h3>
            <button
              style={{
                marginTop: 24,
                background: 'linear-gradient(90deg,#222f46 70%,#39aaff 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                borderRadius: 7,
                fontSize: 15,
                padding: '0.6em 1.2em',
                cursor: 'pointer',
              }}
              onClick={() => setBalancePopup({ visible: false, msg: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {successPopup.visible && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(12, 39, 20, 0.53)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#133f22',
            borderRadius: 13,
            padding: '2.1em 1.5em 1.5em 1.5em',
            boxShadow: '0 8px 32px #008b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90vw',
            maxWidth: 320,
          }}>
            <h3 style={{
              color: '#c7fd8e',
              fontWeight: 700,
              margin: 0,
              fontSize: 20,
              textAlign: 'center',
            }}>
              {successPopup.msg}
            </h3>
            <button
              style={{
                marginTop: 24,
                background: 'linear-gradient(90deg,#31bc47 60%,#52ffbc 100%)',
                color: '#191f33',
                border: 'none',
                fontWeight: 700,
                borderRadius: 7,
                fontSize: 15,
                padding: '0.6em 1.2em',
                cursor: 'pointer',
              }}
              onClick={() => setSuccessPopup({ visible: false, msg: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <MenuBar
        selected="store"
        onSelect={menuKey => navigate(menuKey === 'home' ? '/' : `/${menuKey}`)}
      />
    </>
  );
};

// ---- COMPONENTES REUSABLES ----

const StoreCard = ({ title, img, price, btn, token, onBuy, ...itemProps }: any) => (
  <div style={{
    background: '#1e2235',
    borderRadius: 12,
    padding: '1.1em 0.8em 0.9em 0.8em',
    margin: 6,
    width: 148,
    minHeight: 178,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 12px #0003',
  }}>
    <img src={img} alt={title} style={{
      width: 68, height: 68, marginBottom: 8, borderRadius: 8,
      boxShadow: '0 2px 12px #2227', background: '#111',
      objectFit: 'contain',
    }} />
    <div style={{ fontWeight: 700, marginBottom: 4, color: '#fff', textAlign: 'center' }}>{title}</div>
    <div style={{ color: '#39aaff', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{price} {(token === "wld") ? "WLD" : "Realm"}</div>
    <button
      style={{
        background: 'linear-gradient(90deg,#31bc47 60%,#52ffbc 100%)',
        color: '#191f33', border: 'none', fontWeight: 700, borderRadius: 7,
        fontSize: 14, padding: '0.6em 1.2em', cursor: 'pointer', marginTop: 2,
        boxShadow: '0 1px 6px #39aaff44', width: '100%',
      }}
      onClick={() => onBuy({ title, img, price, btn, token, ...itemProps })}
    >{btn}</button>
  </div>
);

const SliderCards = ({ items, onBuy }: { items: any[], onBuy: any }) => (
  <div style={{
    display: 'flex',
    overflowX: 'auto',
    gap: 12,
    padding: '4px 2px 8px 4px',
    marginBottom: 10,
    scrollbarWidth: 'thin',
  }}>
    {items.map((item, idx) =>
      <StoreCard key={item.title + idx} {...item} onBuy={onBuy} />
    )}
  </div>
);

const P2PCard = ({ type, title, price, img }: any) => (
  <div style={{
    background: '#263047',
    borderRadius: 10,
    padding: '0.6em 1.1em',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 1px 6px #39aaff28',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src={img} alt={title} style={{
        width: 42, height: 42, borderRadius: 6,
        boxShadow: '0 0 12px #39aaff33', background: '#181d2a'
      }} />
      <div>
        <div style={{ color: '#fff', fontWeight: 700 }}>{title}</div>
        <div style={{ color: '#31bc47', fontWeight: 600, fontSize: 13 }}>{price}</div>
      </div>
    </div>
    <button style={p2pBtnStyle} onClick={() => alert('Comprar: ' + title)}>
      Comprar
    </button>
  </div>
);

// ---- ESTILOS ----
const labelBoxStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 55
};
const labelTitleStyle: React.CSSProperties = {
  color: '#83c8ff', fontSize: 13, fontWeight: 600, marginBottom: 2, textShadow: '0 1px 4px #0009'
};
const labelValueStyle: React.CSSProperties = {
  color: '#fff', fontWeight: 900, fontSize: 18, textShadow: '0 2px 8px #0009'
};
const activeTabStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg,#283b65 80%,#2cc0fa 120%)',
  color: '#fff', fontWeight: 700, border: 'none',
  borderRadius: 10, fontSize: 15, padding: '0.48em 1.2em',
  boxShadow: '0 2px 10px #39aaff33',
};
const tabStyle: React.CSSProperties = {
  background: 'transparent', color: '#39aaff', fontWeight: 600,
  border: '1px solid #39aaff66', borderRadius: 10, fontSize: 15,
  padding: '0.48em 1.2em', cursor: 'pointer',
};
const sectionTitleStyle: React.CSSProperties = {
  margin: '16px 0 5px 22px', fontWeight: 800, color: '#39aaff',
  fontSize: 16, letterSpacing: 0.1,
};
const grid2col: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px 8px',
  justifyItems: 'center',
  alignItems: 'flex-start',
  margin: '14px 6px 18px 6px',
};
const bigBtn: React.CSSProperties = {
  background: 'linear-gradient(90deg,#39aaff 50%,#6ff9e6 100%)',
  color: '#171e2b', border: 'none', borderRadius: 9, fontWeight: 900,
  fontSize: 15, marginTop: 10, boxShadow: '0 2px 10px #39aaff22',
  padding: '0.65em 1.6em', cursor: 'pointer',
  letterSpacing: 0.04,
};
const p2pBtnStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg,#222f46 60%,#39aaff 120%)',
  color: '#fff', border: 'none', borderRadius: 7,
  fontWeight: 700, fontSize: 14, padding: '0.5em 1.3em',
  cursor: 'pointer', boxShadow: '0 2px 6px #2cc0fa33',
};

export default StoreScreen;
