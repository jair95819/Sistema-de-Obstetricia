import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    {
      id: 1,
      title: 'Añadir atención',
      description: 'Registra una nueva atención de un/una integrante del área de obstetricia.',
      image: null,
      action: () => onNavigate('atenciones')
    },
    {
      id: 2,
      title: 'Ver el avance de Metas',
      description: 'Consulta el progreso y cumplimiento de las metas establecidas.',
      image: null,
      action: () => onNavigate('metas')
    },
    {
      id: 3,
      title: 'Ver mi perfil',
      description: 'Revisa y actualiza tu información personal y profesional.',
      image: null,
      action: () => onNavigate('profile')
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
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
        currentPage="dashboard"
      />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2 className="welcome-title">Hola, Juanito</h2>
          <p className="welcome-subtitle">¿Qué vas a hacer hoy?</p>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="menu-card"
              onClick={item.action}
            >
              {item.image ? (
                <div className="card-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="card-image"
                  />
                </div>
              ) : (
                <div className="card-icon-container">
                  {item.id === 1 && <span className="card-icon">📝</span>}
                  {item.id === 2 && <span className="card-icon">🎯</span>}
                  {item.id === 3 && <span className="card-icon">👤</span>}
                </div>
              )}
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
