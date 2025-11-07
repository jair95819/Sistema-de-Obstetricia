import { useState } from 'react';
import './RegistroReprogramacion.css';

const RegistroReprogramacion = ({ onNavigate, onBack }) => {
  const [searchAtencion, setSearchAtencion] = useState('');
  const [formData, setFormData] = useState({
    nroAtencion: '',
    dniPaciente: '',
    fechaOriginal: '',
    fechaReprogramacion: '',
    motivoReprogramacion: ''
  });
  const [atencionFound, setAtencionFound] = useState(false);

  // Datos de ejemplo de atenciones (simula la búsqueda en BD)
  const atencionesDB = {
    'AT-001': {
      dniPaciente: '12345678',
      fechaOriginal: '2025-01-15',
      nombrePaciente: 'María García López'
    },
    'AT-002': {
      dniPaciente: '87654321',
      fechaOriginal: '2025-01-16',
      nombrePaciente: 'Ana Rodríguez Sánchez'
    },
    'AT-003': {
      dniPaciente: '11223344',
      fechaOriginal: '2025-01-17',
      nombrePaciente: 'Carmen Flores Torres'
    }
  };

  const handleSearch = () => {
    const atencion = atencionesDB[searchAtencion.toUpperCase()];
    
    if (atencion) {
      // Autocompletar campos si se encuentra la atención
      setFormData({
        ...formData,
        nroAtencion: searchAtencion.toUpperCase(),
        dniPaciente: atencion.dniPaciente,
        fechaOriginal: atencion.fechaOriginal
      });
      setAtencionFound(true);
      console.log('Atención encontrada:', atencion);
    } else {
      alert('No se encontró una atención con ese número');
      setAtencionFound(false);
      setFormData({
        nroAtencion: '',
        dniPaciente: '',
        fechaOriginal: '',
        fechaReprogramacion: '',
        motivoReprogramacion: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!atencionFound) {
      alert('Primero debe buscar y seleccionar una atención válida');
      return;
    }

    console.log('Reprogramación registrada:', formData);
    alert('Reprogramación registrada exitosamente');
    
    // Limpiar formulario
    setSearchAtencion('');
    setFormData({
      nroAtencion: '',
      dniPaciente: '',
      fechaOriginal: '',
      fechaReprogramacion: '',
      motivoReprogramacion: ''
    });
    setAtencionFound(false);
  };

  return (
    <div className="reprogramacion-container">
      {/* Header */}
      <header className="reprogramacion-header">
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
      <main className="reprogramacion-main">
        {/* Back Link */}
        <button className="back-link" onClick={onBack}>
          ← Volver a Atenciones
        </button>

        <div className="page-header-row">
          <h2 className="page-title">Registro Reprogramación</h2>
          
          {/* Search Box */}
          <div className="search-box">
            <label htmlFor="searchAtencion" className="search-label">
              Nro Atención
            </label>
            <div className="search-input-group">
              <input
                type="text"
                id="searchAtencion"
                value={searchAtencion}
                onChange={(e) => setSearchAtencion(e.target.value)}
                className="search-input-field"
                placeholder="Ingrese N° de Atención"
              />
              <button 
                type="button"
                onClick={handleSearch}
                className="search-btn"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <h3 className="form-section-title">Datos de la Atención</h3>

          <form onSubmit={handleSubmit} className="reprogramacion-form">
            {/* DNI Paciente (readonly) */}
            <div className="form-row">
              <label htmlFor="dniPaciente" className="form-label">
                DNI Paciente
              </label>
              <input
                type="text"
                id="dniPaciente"
                name="dniPaciente"
                value={formData.dniPaciente}
                className="form-input readonly-input"
                placeholder=""
                readOnly
              />
            </div>

            {/* Fechas con flecha */}
            <div className="form-row-dates">
              <div className="date-field">
                <label htmlFor="fechaOriginal" className="form-label">
                  Fecha Original
                </label>
                <input
                  type="date"
                  id="fechaOriginal"
                  name="fechaOriginal"
                  value={formData.fechaOriginal}
                  className="form-input readonly-input"
                  readOnly
                />
              </div>

              <div className="arrow-container">
                <span className="arrow-icon">→</span>
              </div>

              <div className="date-field">
                <label htmlFor="fechaReprogramacion" className="form-label">
                  Fecha de Reprogramación
                </label>
                <input
                  type="date"
                  id="fechaReprogramacion"
                  name="fechaReprogramacion"
                  value={formData.fechaReprogramacion}
                  onChange={handleInputChange}
                  className="form-input highlighted-input"
                  required
                  disabled={!atencionFound}
                />
              </div>
            </div>

            {/* Motivo Reprogramación */}
            <div className="form-row">
              <label htmlFor="motivoReprogramacion" className="form-label">
                Motivo Reprogramación
              </label>
              <textarea
                id="motivoReprogramacion"
                name="motivoReprogramacion"
                value={formData.motivoReprogramacion}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describa el motivo de la reprogramación"
                rows="4"
                required
                disabled={!atencionFound}
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="continue-button"
                disabled={!atencionFound}
              >
                Continuar con la atención
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistroReprogramacion;
