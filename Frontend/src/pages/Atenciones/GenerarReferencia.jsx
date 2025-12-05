import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './GenerarReferencia.css';

const GenerarReferencia = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [datosReferencia, setDatosReferencia] = useState(null);
  const [formData, setFormData] = useState({
    establecimientoDestino: '',
    especialidad: '',
    urgencia: 'No',
    motivoReferencia: '',
    resumenClinico: '',
    examenesAdjuntos: '',
    medicacionActual: '',
    recomendaciones: ''
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Función para formatear fecha sin problemas de timezone
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Si la fecha viene en formato YYYY-MM-DD, parseamos directamente
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    // Cargar datos de la atención desde localStorage
    const datos = localStorage.getItem('datosReferencia');
    if (datos) {
      setDatosReferencia(JSON.parse(datos));
      // Pre-llenar algunos campos
      setFormData(prev => ({
        ...prev,
        motivoReferencia: 'Seguimiento especializado',
        resumenClinico: JSON.parse(datos).apuntesMedico || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Crear contenido para exportar
    const contenido = `
REFERENCIA MÉDICA - MINISTERIO DE SALUD

N° de Referencia: REF-${datosReferencia?.id}
Fecha de Emisión: ${new Date().toLocaleDateString('es-PE')}

DATOS DEL PACIENTE:
- DNI: ${datosReferencia?.dniPaciente}
- Nombre: ${datosReferencia?.nombrePaciente}
- Teléfono: ${datosReferencia?.numeroTelefono}
- Email: ${datosReferencia?.correoElectronico}

DATOS DE LA ATENCIÓN:
- N° Atención: ${datosReferencia?.id}
- Fecha de Atención: ${datosReferencia?.fechaRealizacion}
- Programa: ${datosReferencia?.tipoAtencion}
- Razón de Consulta: ${datosReferencia?.razonConsulta}

DATOS DE REFERENCIA:
- Establecimiento Destino: ${formData.establecimientoDestino}
- Especialidad: ${formData.especialidad}
- Urgencia: ${formData.urgencia}
- Motivo de Referencia: ${formData.motivoReferencia}
- Resumen Clínico: ${formData.resumenClinico}
- Exámenes Adjuntos: ${formData.examenesAdjuntos}
- Medicación Actual: ${formData.medicacionActual}
- Recomendaciones: ${formData.recomendaciones}

Obstetra: [Nombre del profesional]
Colegiatura: [Número]
Firma: ________________
    `;

    // Crear y descargar archivo
    const elemento = document.createElement('a');
    const archivo = new Blob([contenido], { type: 'text/plain' });
    elemento.href = URL.createObjectURL(archivo);
    elemento.download = `Referencia_${datosReferencia?.id}.txt`;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Referencia generada exitosamente');
    // Limpiar datos temporales
    localStorage.removeItem('datosReferencia');
    onNavigate('atenciones');
  };

  if (!datosReferencia) {
    return (
      <div className="generar-referencia-container">
        <header className="referencia-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMenu}>
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
        <Sidebar 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)}
          onNavigate={onNavigate}
          currentPage="atenciones"
        />
        <main className="referencia-main">
          <button className="back-link" onClick={onBack}>
            ← Volver a Atenciones
          </button>
          
          <div className="sin-datos-container">
            <div className="sin-datos-card">
              <div className="sin-datos-icon">📄</div>
              <h3>Generar Nueva Referencia</h3>
              <p>Para generar una referencia médica, primero debe registrar una atención con "Requiere referencia: Sí"</p>
              
              <div className="acciones-sin-datos">
                <button 
                  onClick={() => onNavigate('registrar-atenciones')} 
                  className="btn-registrar-atencion"
                >
                  📝 Registrar Atención
                </button>
                <button 
                  onClick={() => onNavigate('visualizar-atenciones')} 
                  className="btn-ver-atenciones"
                >
                  📊 Ver Atenciones Existentes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="generar-referencia-container">
      {/* Header */}
      <header className="referencia-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleMenu}>
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

      <Sidebar 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="atenciones"
      />

      <main className="referencia-main">
        <button className="back-link" onClick={onBack}>
          ← Volver a Atenciones
        </button>

        <h2 className="page-title">Generar Referencia Médica</h2>

        {/* Documento de Referencia */}
        <div className="referencia-documento" id="documento-referencia">
          <div className="documento-header">
            <div className="logo-ministerio">
              <img src="/logo.webp" alt="MINSA" className="logo-doc" />
            </div>
            <div className="titulo-documento">
              <h3>MINISTERIO DE SALUD</h3>
              <h4>REFERENCIA MÉDICA</h4>
              <p>N° REF-{datosReferencia.id}</p>
            </div>
          </div>

          <div className="documento-contenido">
            <div className="seccion-paciente">
              <h4>DATOS DEL PACIENTE</h4>
              <div className="datos-grid">
                <div><strong>DNI:</strong> {datosReferencia.dniPaciente}</div>
                <div><strong>Nombre:</strong> {datosReferencia.nombrePaciente}</div>
                <div><strong>Teléfono:</strong> {datosReferencia.numeroTelefono}</div>
                <div><strong>Email:</strong> {datosReferencia.correoElectronico}</div>
              </div>
            </div>

            <div className="seccion-atencion">
              <h4>DATOS DE LA ATENCIÓN</h4>
              <div className="datos-grid">
                <div><strong>N° Atención:</strong> {datosReferencia.id}</div>
                <div><strong>Fecha:</strong> {formatDate(datosReferencia.fechaRealizacion)}</div>
                <div><strong>Programa:</strong> {datosReferencia.tipoAtencion}</div>
                <div><strong>Razón de Consulta:</strong> {datosReferencia.razonConsulta}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="formulario-referencia" id="formulario-referencia">
              <div className="seccion-referencia">
                <h4>DATOS DE REFERENCIA</h4>
                
                <div className="form-row-split">
                  <div className="form-field-half">
                    <label>Establecimiento Destino</label>
                    <select name="establecimientoDestino" value={formData.establecimientoDestino} onChange={handleInputChange} required>
                      <option value="">Seleccionar</option>
                      <option value="Hospital Nacional Dos de Mayo">Hospital Nacional Dos de Mayo</option>
                      <option value="Hospital Rebagliati">Hospital Rebagliati</option>
                      <option value="Hospital Loayza">Hospital Loayza</option>
                      <option value="Hospital María Auxiliadora">Hospital María Auxiliadora</option>
                    </select>
                  </div>
                  <div className="form-field-half">
                    <label>Especialidad</label>
                    <select name="especialidad" value={formData.especialidad} onChange={handleInputChange} required>
                      <option value="">Seleccionar</option>
                      <option value="Ginecología">Ginecología</option>
                      <option value="Obstetricia">Obstetricia</option>
                      <option value="Medicina Fetal">Medicina Fetal</option>
                      <option value="Endocrinología">Endocrinología</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <label>Urgencia</label>
                  <select name="urgencia" value={formData.urgencia} onChange={handleInputChange}>
                    <option value="No">No</option>
                    <option value="Sí">Sí</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Motivo de Referencia</label>
                  <textarea name="motivoReferencia" value={formData.motivoReferencia} onChange={handleInputChange} rows="3" required />
                </div>

                <div className="form-row">
                  <label>Resumen Clínico</label>
                  <textarea name="resumenClinico" value={formData.resumenClinico} onChange={handleInputChange} rows="4" required />
                </div>

                <div className="form-row">
                  <label>Exámenes Adjuntos</label>
                  <textarea name="examenesAdjuntos" value={formData.examenesAdjuntos} onChange={handleInputChange} rows="2" placeholder="Ecografías, análisis de laboratorio, etc." />
                </div>

                <div className="form-row">
                  <label>Medicación Actual</label>
                  <textarea name="medicacionActual" value={formData.medicacionActual} onChange={handleInputChange} rows="2" placeholder="Medicamentos y dosis actuales" />
                </div>

                <div className="form-row">
                  <label>Recomendaciones</label>
                  <textarea name="recomendaciones" value={formData.recomendaciones} onChange={handleInputChange} rows="3" placeholder="Indicaciones especiales para el especialista" />
                </div>
              </div>

              <div className="firma-seccion">
                <div className="fecha-emision">
                  <strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-PE')}
                </div>
                <div className="firma-profesional">
                  <div className="linea-firma">________________________________</div>
                  <p>Obstetra</p>
                  <p>Colegiatura N°: _______________</p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="acciones-documento">
          <button type="button" onClick={handlePrint} className="btn-imprimir">
            🖨️ Imprimir
          </button>
          <button type="button" onClick={handleExport} className="btn-exportar">
            📄 Exportar TXT
          </button>
          <button type="submit" form="formulario-referencia" className="btn-generar">
            ✅ Confirmar Referencia
          </button>
        </div>
      </main>
    </div>
  );
};

export default GenerarReferencia;