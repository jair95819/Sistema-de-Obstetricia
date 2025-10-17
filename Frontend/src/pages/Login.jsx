import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    documentNumber: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Navegar a la página de validación
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="login-container">
      {/* Panel izquierdo - Branding */}
      <div className="login-left-panel">
        <div className="logo-container">
          <img 
            src="/logo.webp" 
            alt="Ministerio de Salud - Perú" 
            className="logo-minsa"
          />
        </div>
        <h1 className="system-title">
          SISTEMA DE<br />
          SEGUIMIENTO DE<br />
          METAS DE<br />
          OBSTETRICIA
        </h1>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <h2 className="login-title">Ingresa al Sistema</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="documentNumber" className="form-label">
                Nro. Documento
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=""
                  required
                />
                <span className="input-icon">👤</span>
              </div>
              <span className="input-hint">
                El Nro. Documento debe tener 8 dígitos de largo
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=""
                  required
                />
                <span className="input-icon">🔒</span>
              </div>
              <span className="input-hint">
                La contraseña debe tener al menos 8 dígitos de largo
              </span>
            </div>

            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Recuérdame</span>
              </label>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="submit-button">
              INGRESAR A LA PLATAFORMA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
