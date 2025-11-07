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
      image: '/atencion-obstetricia.jpg',
      action: () => onNavigate('registrar-atenciones')
    },
    {
      id: 2,
      title: 'Visualizar Atenciones Realizadas',
      image: '/atencion-obstetricia.jpg',
      action: () => onNavigate('visualizar-atenciones')
    },
    {
      id: 3,
      title: 'Registrar Reprogramaciones',
      image: '/atencion-obstetricia.jpg',
      action: () => onNavigate('registro-reprogramacion')
    },
    {
      id: 4,
      title: 'Generar Referencias',
      image: '/atencion-obstetricia.jpg',
      action: () => console.log('Navegar a Generar Referencias')
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
        <h2 className="atenciones-title">Atenciones</h2>

        {/* Cards Grid */}
        <div className="atenciones-grid">
          {atencionesItems.map((item) => (
            <div 
              key={item.id} 
              className="atencion-card"
              onClick={item.action}
            >
              <div className="card-image-wrapper">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="card-image"
                />
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
