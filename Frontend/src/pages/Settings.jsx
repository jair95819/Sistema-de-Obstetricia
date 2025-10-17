import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Settings.css';

const Settings = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState('Español');
  const [fontSize, setFontSize] = useState(40);
  const [contrast, setContrast] = useState('Apagado');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleContrastChange = (e) => {
    setContrast(e.target.value);
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
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
        currentPage="config"
      />

      {/* Main Content */}
      <main className="settings-main">
        <div className="settings-content">
          <h2 className="settings-page-title">Configuraciones</h2>

          {/* Settings Form */}
          <div className="settings-form">
            {/* Language Setting */}
            <div className="setting-item">
              <label className="setting-label">Idioma</label>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="Español">Español</option>
                  <option value="English">English</option>
                  <option value="Português">Português</option>
                  <option value="Quechua">Quechua</option>
                </select>
              </div>
            </div>

            {/* Font Size Setting */}
            <div className="setting-item">
              <label className="setting-label">Tamaño de letra</label>
              <div className="setting-control font-size-control">
                <input 
                  type="range"
                  min="20"
                  max="60"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="setting-slider"
                />
                <div className="font-size-display">
                  <span className="percentage">{fontSize}%</span>
                  <span className="aa-icon">Aa</span>
                </div>
              </div>
            </div>

            {/* Contrast Setting */}
            <div className="setting-item">
              <label className="setting-label">Contraste Daltonismo</label>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={contrast}
                  onChange={handleContrastChange}
                >
                  <option value="Apagado">Apagado</option>
                  <option value="Protanopia">Protanopia</option>
                  <option value="Deuteranopia">Deuteranopia</option>
                  <option value="Tritanopia">Tritanopia</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
