import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './RegistrarAtenciones.css';

const RegistrarAtenciones = ({ onNavigate, onBack, onNext }) => {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleSearch = () => {
    const dni = formData.nroDocumento;
    console.log('Buscar paciente:', dni);
    
    // Base de datos simulada de pacientes
    const pacientesDB = {
      '73822138': {
        nombreCompleto: 'Sofía Ramírez Torres',
        correoElectronico: 'sofia@upn.pe',
        numeroTelefono: '912345678'
      },
      '73370017': {
        nombreCompleto: 'Valeria Castro Flores',
        correoElectronico: 'valeria@upn.pe',
        numeroTelefono: '912345679'
      }
    };

    // Buscar paciente por DNI
    const paciente = pacientesDB[dni];
    
    if (paciente) {
      // Autocompletar campos si se encuentra el paciente
      setFormData(prev => ({
        ...prev,
        nombreCompleto: paciente.nombreCompleto,
        correoElectronico: paciente.correoElectronico,
        numeroTelefono: paciente.numeroTelefono
      }));
      console.log('Paciente encontrado:', paciente);
    } else {
      alert('No se encontró un paciente con ese número de documento');
      // Limpiar campos si no se encuentra
      setFormData(prev => ({
        ...prev,
        nombreCompleto: '',
        correoElectronico: '',
        numeroTelefono: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registrar atención:', formData);
    
    // Generar ID único para la atención
    const atencionId = 'AT-' + String(Date.now()).slice(-6);
    
    // Crear objeto de atención
    const nuevaAtencion = {
      id: atencionId,
      dniPaciente: formData.nroDocumento,
      nombrePaciente: formData.nombreCompleto,
      fechaRealizacion: formData.fechaAtencion,
      horaAtencion: formData.horaAtencion,
      tipoAtencion: formData.programaObstetra,
      estado: 'Completada',
      seReprogramo: 'No',
      razonConsulta: formData.razonConsulta,
      tieneSeguro: formData.tieneSeguro,
      apuntesMedico: formData.apuntesMedico,
      requiereReferencia: formData.requiereReferencia,
      correoElectronico: formData.correoElectronico,
      numeroTelefono: formData.numeroTelefono
    };
    
    // Obtener atenciones existentes del localStorage
    const atencionesGuardadas = localStorage.getItem('atenciones');
    const atenciones = atencionesGuardadas ? JSON.parse(atencionesGuardadas) : [];
    
    // Agregar la nueva atención
    atenciones.push(nuevaAtencion);
    
    // Guardar en localStorage
    localStorage.setItem('atenciones', JSON.stringify(atenciones));
    
    // Mostrar mensaje de éxito
    alert(`✅ Atención registrada exitosamente\nN° de Atención: ${atencionId}`);
    
    // Si requiere referencia, redireccionar a Generar Referencia
    if (formData.requiereReferencia === 'Si') {
      // Guardar datos para la referencia en localStorage temporalmente
      localStorage.setItem('datosReferencia', JSON.stringify(nuevaAtencion));
      onNavigate('generar-referencia');
    } else {
      // Limpiar formulario si no requiere referencia
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
                <option value="Programa 1">Programa 1: Control Prenatal</option>
                <option value="Programa 2">Programa 2: Planificación Familiar</option>
                <option value="Programa 3">Programa 3: Puerperio</option>
                <option value="Programa 4">Programa 4: Detección de Riesgo</option>
                <option value="Programa 5">Programa 5: Educación Materna</option>
              </select>
            </div>

            {/* Tiene Seguro */}
            <div className="form-row">
              <label htmlFor="tieneSeguro" className="form-label">
                ¿Tiene Seguro?
              </label>
              <select
                id="tieneSeguro"
                name="tieneSeguro"
                value={formData.tieneSeguro}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
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

            {/* Requiere Referencia */}
            <div className="form-row">
              <label htmlFor="requiereReferencia" className="form-label">
                ¿Requiere Referencia?
              </label>
              <select
                id="requiereReferencia"
                name="requiereReferencia"
                value={formData.requiereReferencia}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
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

