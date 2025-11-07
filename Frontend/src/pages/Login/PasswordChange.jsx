import { useState } from 'react';
import './PasswordChange.css';

const PasswordChange = ({ onBack, onHome }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
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
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Password change attempt:', formData);
    // Volver a login después de cambiar contraseña
    if (onBack) {
      onBack();
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
          <h2 className="login-title">Cambiar Contraseña</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nueva Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=""
                  required
                  minLength={8}
                />
                <span className="input-icon">�</span>
              </div>
              <span className="input-hint">
                La contraseña debe tener al menos 8 dígitos de largo
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Nueva Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=""
                  required
                  minLength={8}
                />
                <span className="input-icon">🔒</span>
              </div>
              <span className="input-hint">
                La contraseña debe coincidir
              </span>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={onBack} className="back-button">
                Volver
              </button>
              <button type="submit" className="submit-button">
                CAMBIAR CONTRASEÑA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
