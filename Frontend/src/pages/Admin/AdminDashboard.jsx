import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const adminItems = [
    {
      id: 1,
      title: 'Gestión de Obstetras',
      description: 'Administra el registro de obstetras del sistema.',
      emoji: '👩‍⚕️',
      action: () => onNavigate('admin-obstetras')
    },
    {
      id: 2,
      title: 'Gestión de Pacientes',
      description: 'Administra el registro de pacientes del sistema.',
      emoji: '🤰',
      action: () => onNavigate('admin-pacientes')
    },
    {
      id: 3,
      title: 'Gestión de Metas',
      description: 'Configura y administra las metas del área de obstetricia.',
      emoji: '🎯',
      action: () => onNavigate('admin-metas')
    },
    {
      id: 4,
      title: 'Programas de Atención',
      description: 'Administra los programas de atención disponibles.',
      emoji: '📋',
      action: () => onNavigate('admin-programas')
    }
  ];

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-header">
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
        currentPage="admin"
      />

      {/* Main Content */}
      <main className="admin-main">
        <button className="back-link" onClick={onBack}>
          ← Volver
        </button>

        <div className="welcome-section">
          <h2 className="welcome-title">Panel de Administración</h2>
          <p className="welcome-subtitle">Gestiona los datos del sistema</p>
        </div>

        {/* Cards Grid */}
        <div className="admin-cards-grid">
          {adminItems.map((item) => (
            <div 
              key={item.id} 
              className="admin-card"
              onClick={item.action}
            >
              <div className="admin-card-icon-container">
                <span className="admin-card-icon">{item.emoji}</span>
              </div>
              <div className="admin-card-content">
                <h3 className="admin-card-title">{item.title}</h3>
                <p className="admin-card-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
