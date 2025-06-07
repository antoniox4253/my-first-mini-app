import React, { useState } from 'react';
import MenuBar from './MenuBar';
import TopBar from './TopBar';
import { useNavigate } from 'react-router-dom';

const dummyStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: '#39aaff',
  fontSize: '1.1rem',
  background: '#191f33',
  paddingTop: 30,
};

interface SettingsScreenProps {
  username: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ username }) => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(50);
  const [language, setLanguage] = useState('es');

  // Cerrar sesión formalmente
  const handleLogout = () => {
    // 1. Borra toda la persistencia local
    localStorage.clear();
    sessionStorage.clear();

    // 2. Si tienes estado global (ejemplo: setUser(null)), ponlo aquí también
    // Por ejemplo: setUser(null);

    // 3. Redirige al login o splash
    navigate('/login', { replace: true });

    // 4. (Extra) Forzar recarga ligera para resetear memoria JS residual (solo si lo necesitas)
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <>
      <TopBar username={username} />
      <div style={dummyStyle}>
        <h2 style={{ color: '#fff', marginBottom: 30, marginTop: 50 }}>Configuración</h2>
        <div style={{ marginBottom: 24, width: '90%' }}>
          <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>
            Volumen: <b style={{ color: '#39aaff' }}>{volume}</b>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            style={{ width: '90%' }}
          />
        </div>
        <div style={{ marginBottom: 24, width: '90%' }}>
          <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>
            Idioma:
          </label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ width: '100%', padding: '0.4em', borderRadius: 6, border: '1px solid #39aaff' }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <button
          style={{
            background: 'linear-gradient(90deg,#b40028 70%,#ff3956 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            borderRadius: 7,
            fontSize: 15,
            padding: '0.6em 1.2em',
            cursor: 'pointer',
            marginTop: 20,
            width: '90%',
          }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
      <MenuBar
        selected=""
        onSelect={menuKey => {
          navigate(menuKey === 'home' ? '/' : `/${menuKey}`);
        }}
      />
    </>
  );
};

export default SettingsScreen;
