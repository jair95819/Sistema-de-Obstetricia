import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const handleNavigation = (page) => {
    onClose();
    if (onNavigate) {
      onNavigate(page);
    }
  };

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
