import { useState, useEffect } from 'react';
import './Sidebar.css';

const API_URL = 'http://localhost:4000/api';

const Sidebar = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/my-profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.nombre_rol);
        }
      } catch (err) {
        console.error('Error cargando rol de usuario:', err);
      }
    };
    
    fetchUserRole();
  }, []);

  const handleNavigation = (page) => {
    onClose();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Verificar si el usuario puede ver el menú de administración
  const canAccessAdmin = userRole && userRole !== 'Obstetra';

  return (
    <>
      {/* Sidebar Menu */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <a 
                href="#" 
                className={`sidebar-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}
              >
                <span className="menu-icon">🏠</span>
                Home
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#" 
                className={`sidebar-link ${currentPage === 'atenciones' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('atenciones'); }}
              >
                <span className="menu-icon">📋</span>
                Atenciones
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#" 
                className={`sidebar-link ${currentPage === 'metas' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('metas'); }}
              >
                <span className="menu-icon">🎯</span>
                Mis metas
              </a>
            </li>
            <li className="sidebar-item">
              <a 
                href="#" 
                className={`sidebar-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('profile'); }}
              >
                <span className="menu-icon">👤</span>
                Mi perfil
              </a>
            </li>
            {canAccessAdmin && (
              <li className="sidebar-item">
                <a 
                  href="#" 
                  className={`sidebar-link ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigation('admin-dashboard'); }}
                >
                  <span className="menu-icon">🔧</span>
                  Administración
                </a>
              </li>
            )}
          </ul>
          
          <div className="sidebar-bottom">
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <a 
                  href="#" 
                  className={`sidebar-link ${currentPage === 'config' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigation('config'); }}
                >
                  <span className="menu-icon">⚙️</span>
                  Configuración
                </a>
              </li>
            </ul>
            <button className="logout-button" onClick={() => handleNavigation('login')}>
              Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
