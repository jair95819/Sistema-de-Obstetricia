import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Atenciones.css';

const Atenciones = ({ onNavigate, onBack, onHome }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const atencionesItems = [
    {
      id: 1,
      title: 'Registrar Atenciones',
      emoji: '📝',
      action: () => onNavigate('registrar-atenciones')
    },
    {
      id: 2,
      title: 'Visualizar Atenciones Realizadas',
      emoji: '📊',
      action: () => onNavigate('visualizar-atenciones')
    },
    {
      id: 3,
      title: 'Registrar Reprogramaciones',
      emoji: '📅',
      action: () => onNavigate('registro-reprogramacion')
    }
  ];

  return (
    <div className="atenciones-container">
      {/* Header */}
      <header className="atenciones-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-icon">☰</span>
          </button>
          <img 
            src="/logo.webp" 
            alt="Ministerio de Salud - Perú" 
            className="header-logo"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <h1 className="header-title">SISTEMA DE SEGUIMIENTO DE METAS DE OBSTETRICIA</h1>
      </header>

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="atenciones"
      />

      {/* Main Content */}
      <main className="atenciones-main">
        <div className="atenciones-title-row">
          <button className="back-button" onClick={onBack} aria-label="Volver">
            ←
          </button>
          <h2 className="atenciones-title">Atenciones</h2>
        </div>

        {/* Cards Grid */}
        <div className="atenciones-grid">
          {atencionesItems.map((item) => (
            <div 
              key={item.id} 
              className="atencion-card"
              onClick={item.action}
            >
              <div className="card-emoji-wrapper">
                <span className="card-emoji">{item.emoji}</span>
              </div>
              <div className="card-footer">
                <h3 className="card-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Atenciones;
