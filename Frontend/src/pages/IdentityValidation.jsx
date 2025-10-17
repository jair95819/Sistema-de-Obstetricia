import { useState } from 'react';
import './IdentityValidation.css';

const IdentityValidation = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState({
    captcha: '',
    reCaptcha: false,
    recaptchaText: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log('Verification attempt:', formData);
    // Aquí irá la lógica de verificación
  };

  const handleNext = () => {
    console.log('Navigate to dashboard');
    // Navegar al dashboard
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="validation-container">
      {/* Panel izquierdo - Branding */}
      <div className="validation-left-panel">
        <div className="logo-container">
          <img 
            src="/logo-minsa.png" 
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

      {/* Panel derecho - Formulario de validación */}
      <div className="validation-right-panel">
        <div className="validation-form-container">
          <h2 className="validation-title">Validación de Identidad</h2>
          
          <form onSubmit={handleVerify} className="validation-form">
            {/* Captcha */}
            <div className="form-group">
              <label htmlFor="captcha" className="form-label">
                Captcha
              </label>
              <div className="recaptcha-wrapper">
                <div className="recaptcha-checkbox">
                  <input
                    type="checkbox"
                    id="recaptchaCheck"
                    name="reCaptcha"
                    checked={formData.reCaptcha}
                    onChange={handleInputChange}
                    className="recaptcha-input"
                  />
                  <label htmlFor="recaptchaCheck" className="recaptcha-label">
                    I'm not a robot
                  </label>
                  <div className="recaptcha-logo">
                    <div className="recaptcha-placeholder">
                      reCAPTCHA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ReCaptcha Image */}
            <div className="form-group">
              <label htmlFor="recaptchaText" className="form-label">
                ReCaptcha
              </label>
              <div className="captcha-image-container">
                <div className="captcha-image-placeholder">
                  <span className="captcha-text">Qserjn0ks</span>
                  <span className="captcha-text-2">inquiry</span>
                </div>
              </div>
              <div className="captcha-input-group">
                <input
                  type="text"
                  id="recaptchaText"
                  name="recaptchaText"
                  value={formData.recaptchaText}
                  onChange={handleInputChange}
                  className="captcha-input"
                  placeholder="Ingresar el texto de arriba"
                />
                <button type="submit" className="verify-button">
                  Verificar
                </button>
              </div>
            </div>
          </form>

          {/* Botón siguiente (flecha) */}
          <button 
            type="button" 
            className="next-button"
            onClick={handleNext}
            aria-label="Siguiente"
          >
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityValidation;
