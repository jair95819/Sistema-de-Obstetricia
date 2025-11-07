import { useState } from 'react';
import './RegistrarAtenciones.css';

const RegistrarAtenciones = ({ onNavigate, onBack, onNext }) => {
  const [formData, setFormData] = useState({
    nroDocumento: '',
    nombreCompleto: '',
    correoElectronico: '',
    numeroTelefono: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    console.log('Buscar paciente:', formData.nroDocumento);
    // Aquí iría la lógica para buscar el paciente por DNI
    // y autocompletar los demás campos
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Continuar con la atención:', formData);
    // Navegar a la siguiente página del flujo
    if (onNext) {
      onNext(formData);
    }
  };

  return (
    <div className="registrar-atenciones-container">
      {/* Header */}
      <header className="registrar-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            aria-label="Menu"
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

      {/* Main Content */}
      <main className="registrar-main">
        {/* Back Link */}
        <button className="back-link" onClick={onBack}>
          ← Volver a Atenciones
        </button>

        <h2 className="page-title">Registro Atenciones</h2>

        <div className="form-card">
          <h3 className="form-section-title">Datos del Paciente</h3>

          <form onSubmit={handleSubmit} className="registro-form">
            {/* Nro Documento */}
            <div className="form-row">
              <label htmlFor="nroDocumento" className="form-label">
                Nro. Documento
              </label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="nroDocumento"
                  name="nroDocumento"
                  value={formData.nroDocumento}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=""
                  required
                  maxLength={8}
                />
                <button 
                  type="button" 
                  onClick={handleSearch}
                  className="search-button"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="form-row">
              <label htmlFor="nombreCompleto" className="form-label">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
                required
              />
            </div>

            {/* Correo Electrónico */}
            <div className="form-row">
              <label htmlFor="correoElectronico" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
                required
              />
            </div>

            {/* Número de Teléfono */}
            <div className="form-row">
              <label htmlFor="numeroTelefono" className="form-label">
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="numeroTelefono"
                name="numeroTelefono"
                value={formData.numeroTelefono}
                onChange={handleInputChange}
                className="form-input"
                placeholder=""
                required
                maxLength={9}
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="continue-button">
                Continuar con la atención
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrarAtenciones;
