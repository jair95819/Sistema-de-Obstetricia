import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    {
      id: 1,
      title: 'Consultar Obstretras',
      description: 'Consulta la información de un/una integrante del área de obstetricia.',
      image: '/consultar-obstetras.jpg',
      action: () => console.log('Navegar a Consultar Obstretras')
    }
    // Aquí se pueden agregar más cards en el futuro
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
              <div className="card-image-container">
                <img 
                  src="/Consultar obstetra.webp" 
                  alt={item.title}
                  className="card-image"
                />
              </div>
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
