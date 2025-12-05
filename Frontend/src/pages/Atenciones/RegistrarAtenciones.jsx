import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './RegistrarAtenciones.css';

const RegistrarAtenciones = ({ onNavigate, onBack, onNext }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null); // Guardar datos del paciente encontrado
  const [formData, setFormData] = useState({
    // Datos del Paciente
    nroDocumento: '',
    nombreCompleto: '',
    correoElectronico: '',
    numeroTelefono: '',
    // Datos de la Consulta
    fechaAtencion: '',
    horaAtencion: '',
    razonConsulta: '',
    programaObstetra: '',
    tieneSeguro: '',
    apuntesMedico: '',
    requiereReferencia: ''
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async () => {
    const dni = formData.nroDocumento;
    console.log('Buscar paciente:', dni);
    
    if (!dni || dni.trim() === '') {
      alert('Por favor ingrese un número de documento');
      return;
    }

    try {
      // Buscar paciente por DNI en la API real
      const response = await fetch(`http://localhost:4000/api/pacientes/search/${dni}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar paciente');
      }
      
      const pacientes = await response.json();
      
      // Buscar coincidencia exacta por nro_documento
      const paciente = pacientes.find(p => String(p.nro_documento) === dni);
      
      if (paciente) {
        // Guardar el paciente encontrado (incluye PacienteID)
        setPacienteEncontrado(paciente);
        // Autocompletar campos si se encuentra el paciente
        setFormData(prev => ({
          ...prev,
          nombreCompleto: `${paciente.nombres || ''} ${paciente.apellidos || ''}`.trim(),
          correoElectronico: paciente.email || '',
          numeroTelefono: paciente.telefono ? String(paciente.telefono) : '',
          tieneSeguro: paciente.tiene_sis ? 'Si' : 'No'
        }));
        console.log('Paciente encontrado:', paciente);
      } else {
        alert('No se encontró un paciente con ese número de documento');
        setPacienteEncontrado(null);
        // Limpiar campos si no se encuentra
        setFormData(prev => ({
          ...prev,
          nombreCompleto: '',
          correoElectronico: '',
          numeroTelefono: ''
        }));
      }
    } catch (error) {
      console.error('Error buscando paciente:', error);
      alert('Error al buscar paciente: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registrar atención:', formData);
    
    // Validar que se haya encontrado un paciente
    if (!pacienteEncontrado) {
      alert('Debe buscar y seleccionar un paciente primero');
      return;
    }
    
    // Obtener ObstetraID del usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const obstetraId = user.obstetraId || 1; // Default a 1 si no hay
    
    // Mapear programa a ProgramaDeAtencionID
    const programaMap = {
      'Consejerias': 1,
      'PAP': 2,
      'IVAA': 3,
      'Examen Clinico': 4,
      'VPH': 5
    };
    const programaId = programaMap[formData.programaObstetra] || 1;
    
    try {
      // Enviar a la API
      const response = await fetch('http://localhost:4000/api/atenciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ObstetraID: obstetraId,
          PacienteID: pacienteEncontrado.PacienteID,
          ProgramaDeAtencionID: programaId,
          fecha_realizacion: formData.fechaAtencion,
          estado: 'Completada',
          observaciones: formData.apuntesMedico || formData.razonConsulta
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar atención');
      }
      
      const result = await response.json();
      
      // Mostrar mensaje de éxito
      alert(`✅ Atención registrada exitosamente\nN° de Atención: ${result.id}`);
      
      // Limpiar formulario e ir a visualizar atenciones
      setFormData({
        nroDocumento: '',
        nombreCompleto: '',
        correoElectronico: '',
        numeroTelefono: '',
        fechaAtencion: '',
        horaAtencion: '',
        razonConsulta: '',
        programaObstetra: '',
        tieneSeguro: '',
        apuntesMedico: '',
        requiereReferencia: ''
      });
      setPacienteEncontrado(null);
      // Ir a visualizar atenciones
      onNavigate('visualizar-atenciones');
    } catch (error) {
      console.error('Error al registrar atención:', error);
      alert('Error al registrar atención: ' + error.message);
    }
  };

  return (
    <div className="registrar-atenciones-container">
      {/* Header */}
      <header className="registrar-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
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

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="atenciones"
      />

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
          </form>
        </div>

        {/* Segunda Card: Datos de la Consulta */}
        <div className="form-card">
          <h3 className="form-section-title">Datos de la Consulta</h3>

          <form onSubmit={handleSubmit} className="registro-form">
            {/* Fecha y Hora de Atención */}
            <div className="form-row-split">
              <div className="form-field-half">
                <label htmlFor="fechaAtencion" className="form-label">
                  Fecha de Atención
                </label>
                <input
                  type="date"
                  id="fechaAtencion"
                  name="fechaAtencion"
                  value={formData.fechaAtencion}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field-half">
                <label htmlFor="horaAtencion" className="form-label">
                  Hora de Atención
                </label>
                <input
                  type="time"
                  id="horaAtencion"
                  name="horaAtencion"
                  value={formData.horaAtencion}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Razón de Consulta */}
            <div className="form-row">
              <label htmlFor="razonConsulta" className="form-label">
                Razón de Consulta
              </label>
              <textarea
                id="razonConsulta"
                name="razonConsulta"
                value={formData.razonConsulta}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describa el motivo de la consulta"
                rows="3"
                required
              />
            </div>

            {/* Programa Obstetra */}
            <div className="form-row">
              <label htmlFor="programaObstetra" className="form-label">
                Programa Obstetra
              </label>
              <select
                id="programaObstetra"
                name="programaObstetra"
                value={formData.programaObstetra}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccione un programa</option>
                <option value="Consejerias">Consejerías</option>
                <option value="PAP">PAP</option>
                <option value="IVAA">IVAA</option>
                <option value="Examen Clinico">Examen Clínico</option>
                <option value="VPH">VPH</option>
              </select>
            </div>

            {/* Tiene Seguro */}
            <div className="form-row">
              <label htmlFor="tieneSeguro" className="form-label">
                ¿Tiene Seguro? (SIS)
              </label>
              <input
                type="text"
                id="tieneSeguro"
                name="tieneSeguro"
                value={formData.tieneSeguro === 'Si' ? 'Sí' : formData.tieneSeguro === 'No' ? 'No' : 'Busque un paciente'}
                className="form-input"
                readOnly
                disabled
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </div>

            {/* Apuntes del Médico */}
            <div className="form-row">
              <label htmlFor="apuntesMedico" className="form-label">
                Apuntes del Médico
              </label>
              <textarea
                id="apuntesMedico"
                name="apuntesMedico"
                value={formData.apuntesMedico}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Observaciones, diagnóstico, tratamiento..."
                rows="4"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="continue-button">
                Registrar Atención
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrarAtenciones;

