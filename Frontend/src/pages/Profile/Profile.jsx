import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Profile.css';

const API_URL = 'http://localhost:4000/api';

const Profile = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/my-profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }
        
        const data = await response.json();
        setProfileData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  // Renderizar loading state
  if (loading) {
    return (
      <div className="profile-container">
        <header className="profile-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMenu}>
              <span className="hamburger-icon">☰</span>
            </button>
            <img src="/logo.webp" alt="Logo" className="header-logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }} />
          </div>
          <h1 className="header-title">SISTEMA DE SEGUIMIENTO DE METAS DE OBSTETRICIA</h1>
        </header>
        <main className="profile-main">
          <div className="profile-content">
            <div className="loading-state"><p>Cargando perfil...</p></div>
          </div>
        </main>
      </div>
    );
  }

  // Datos para mostrar según el rol
  const esObstetra = profileData?.esObstetra;
  const obstetra = profileData?.obstetra;

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
        currentPage="profile"
      />

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header-section">
            <h2 className="profile-page-title">Mi Perfil</h2>
            {esObstetra && (
              <button 
                className="health-position-button"
                onClick={() => onNavigate('health-center')}
              >
                PUESTO DE SALUD
              </button>
            )}
          </div>

          {error && <div className="error-message">Error: {error}</div>}

          {/* Avatar and Name Section */}
          <div className="profile-identity">
            <div className="avatar-container">
              <div className="avatar-circle">
                <span className="avatar-icon">👤</span>
              </div>
            </div>
            <h3 className="profile-name">
              {esObstetra 
                ? `${obstetra.nombres} ${obstetra.apellidos}`
                : profileData?.username
              }
            </h3>
            <p className="profile-title">
              {esObstetra 
                ? obstetra.titulo_profesional || 'Obstetra'
                : profileData?.nombre_rol || 'Usuario'
              }
            </p>
          </div>

          {/* Information Cards */}
          <div className="info-cards-container">
            {esObstetra ? (
              <>
                {/* Personal Information Card - Para Obstetras */}
                <div className="info-card personal-info">
                  <h4 className="info-card-title">Información Personal</h4>
                  <div className="info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{obstetra.nombres}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Apellidos:</span>
                    <span className="info-value">{obstetra.apellidos}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha Nacimiento:</span>
                    <span className="info-value">{formatDate(obstetra.fecha_nacimiento)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Celular:</span>
                    <span className="info-value">{obstetra.num_telefono || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Correo:</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                </div>

                {/* Professional Information Card - Para Obstetras */}
                <div className="info-card professional-info">
                  <h4 className="info-card-title">Información Profesional</h4>
                  <div className="info-item">
                    <span className="info-label">Nro. De Colegiatura:</span>
                    <span className="info-value">{obstetra.nro_colegiatura || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nro. De Documento:</span>
                    <span className="info-value">{profileData.NumDoc}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Título Profesional:</span>
                    <span className="info-value">{obstetra.titulo_profesional || '-'}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* User Information Card - Para Administradores u otros roles */}
                <div className="info-card personal-info">
                  <h4 className="info-card-title">Información de Usuario</h4>
                  <div className="info-item">
                    <span className="info-label">Usuario:</span>
                    <span className="info-value">{profileData?.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Correo:</span>
                    <span className="info-value">{profileData?.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nro. Documento:</span>
                    <span className="info-value">{profileData?.NumDoc || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rol:</span>
                    <span className="info-value">{profileData?.nombre_rol}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Registro:</span>
                    <span className="info-value">{formatDate(profileData?.fecha_creacion)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    <span className={`info-value status-badge ${profileData?.is_active ? 'status-activo' : 'status-inactivo'}`}>
                      {profileData?.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
