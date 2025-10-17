import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './HealthCenter.css';

const HealthCenter = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackToProfile = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const healthCenterInfo = {
    name: 'Centro de Salud Olmos',
    address: 'C. San Francisco 717, Olmos 14211',
    phone: '044 - 712345',
    description: '"En el Centro de Salud Olmos, creemos que la medicina avanzada debe ir de la mano con un profundo sentido de humanidad. Más que un hospital, somos una comunidad de profesionales de la salud dedicados a interesar de cada paciente y su familia. Ofrecemos un cuidado integral y cercano, donde la empatía, el respeto y la calidez son el corazón de nuestro trabajo. Estamos aquí para cuidarte, en cada etapa de tu vida."'
  };

  return (
    <div className="health-center-container">
      {/* Header */}
      <header className="health-center-header">
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
        currentPage="profile"
      />

      {/* Main Content */}
      <main className="health-center-main">
        <div className="health-center-content">
          {/* Back Button */}
          <button className="back-button" onClick={handleBackToProfile}>
            ← Volver a Mi Perfil
          </button>

          {/* Hospital Icon */}
          <div className="hospital-icon-container">
            <div className="hospital-icon">
              <div className="hospital-symbol">
                <div className="hospital-circle">
                  <span className="h-letter">H</span>
                </div>
                <div className="hospital-building">
                  <div className="building-top">
                    <div className="window-row">
                      <span className="window"></span>
                      <span className="window"></span>
                      <span className="window"></span>
                    </div>
                  </div>
                  <div className="building-body">
                    <div className="side-column left">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                    <div className="entrance">
                      <div className="door"></div>
                    </div>
                    <div className="side-column right">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Center Name */}
          <h2 className="health-center-name">{healthCenterInfo.name}</h2>

          {/* Address and Phone */}
          <div className="contact-info">
            <p className="address">
              <strong>DIRECCION:</strong> {healthCenterInfo.address}
            </p>
            <p className="phone">
              <strong>Celular:</strong> {healthCenterInfo.phone}
            </p>
          </div>

          {/* Description Card */}
          <div className="description-card">
            <p className="description-text">
              {healthCenterInfo.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthCenter;
