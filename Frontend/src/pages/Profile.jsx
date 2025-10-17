import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Profile.css';

const Profile = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const userInfo = {
    name: 'Juan Pablo',
    lastName: 'Navarro Neyra',
    title: 'Licenciado en Obstetricia',
    dateOfBirth: '23/07/2005',
    phone: '987987987',
    email: 'juan123@gmail.com',
    collegeNumber: '9999123',
    documentNumber: '12341234'
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-icon">☰</span>
          </button>
          <img 
            src="/logo-minsa.png" 
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
      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header-section">
            <h2 className="profile-page-title">Mi Perfil</h2>
            <button 
              className="health-position-button"
              onClick={() => onNavigate('health-center')}
            >
              PUESTO DE SALUD
            </button>
          </div>

          {/* Avatar and Name Section */}
          <div className="profile-identity">
            <div className="avatar-container">
              <div className="avatar-circle">
                <span className="avatar-icon">👤</span>
              </div>
            </div>
            <h3 className="profile-name">{userInfo.name} {userInfo.lastName}</h3>
            <p className="profile-title">{userInfo.title}</p>
          </div>

          {/* Information Cards */}
          <div className="info-cards-container">
            {/* Personal Information Card */}
            <div className="info-card personal-info">
              <h4 className="info-card-title">Información Personal</h4>
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{userInfo.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Apellidos:</span>
                <span className="info-value">{userInfo.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha Nacimiento:</span>
                <span className="info-value">{userInfo.dateOfBirth}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Celular:</span>
                <span className="info-value">{userInfo.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Correo:</span>
                <span className="info-value">{userInfo.email}</span>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="info-card professional-info">
              <h4 className="info-card-title">Información Profesional</h4>
              <div className="info-item">
                <span className="info-label">Nro. De Colegiatura:</span>
                <span className="info-value">{userInfo.collegeNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nro. De Documento:</span>
                <span className="info-value">{userInfo.documentNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
