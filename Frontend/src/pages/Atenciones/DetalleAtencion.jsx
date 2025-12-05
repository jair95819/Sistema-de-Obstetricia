import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DetalleAtencion.css';

const DetalleAtencion = ({ onNavigate, onBack, atencionId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [atencion, setAtencion] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Función para formatear fecha sin problemas de timezone
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-PE');
  };

  // Cargar la atención específica desde la API
  useEffect(() => {
    const cargarAtencion = async () => {
      if (atencionId) {
        try {
          // El atencionId viene como "AT-000001", extraer el número
          const idNumerico = atencionId.replace('AT-', '').replace(/^0+/, '') || '0';
          
          const response = await fetch(`http://localhost:4000/api/atenciones/${idNumerico}`);
          if (response.ok) {
            const data = await response.json();
            // Los datos ya vienen formateados del backend
            setAtencion(data);
          } else {
            console.error('Atención no encontrada');
          }
        } catch (error) {
          console.error('Error al cargar atención:', error);
        }
      }
      setLoading(false);
    };
    
    cargarAtencion();
  }, [atencionId]);

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'Completada':
        return 'status-completada';
      case 'Pendiente seguimiento':
        return 'status-pendiente';
      default:
        return '';
    }
  };

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };

  // Función para exportar a TXT
  const handleExport = () => {
    if (!atencion) return;
    
    const contenido = `
DETALLE DE ATENCIÓN - MINISTERIO DE SALUD
==========================================

N° de Atención: ${atencion.id}
Estado: ${atencion.estado}

DATOS DEL PACIENTE:
- DNI: ${atencion.dniPaciente}
- Nombre: ${atencion.nombrePaciente}
- Teléfono: ${atencion.numeroTelefono || '-'}
- Email: ${atencion.correoElectronico || '-'}
- Tiene SIS: ${atencion.tieneSeguro}

DATOS DE LA ATENCIÓN:
- Fecha de Atención: ${formatDate(atencion.fechaRealizacion)}
- Programa: ${atencion.tipoAtencion}
- Obstetra: ${atencion.nombreObstetra || '-'}

OBSERVACIONES:
${atencion.observaciones || 'Sin observaciones'}

==========================================
Fecha de generación: ${new Date().toLocaleString('es-PE')}
    `;

    const elemento = document.createElement('a');
    const archivo = new Blob([contenido], { type: 'text/plain' });
    elemento.href = URL.createObjectURL(archivo);
    elemento.download = `Atencion_${atencion.id}.txt`;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  if (loading) {
    return (
      <div className="detalle-atencion-container">
        <header className="detalle-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMenu}>
              <span className="hamburger-icon">☰</span>
            </button>
            <img src="/logo.webp" alt="MINSA" className="header-logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }} />
          </div>
          <h1 className="page-title">Detalle de Atención</h1>
        </header>
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} />
        <main className="detalle-content">
          <div className="loading-message">
            <p>Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!atencion) {
    return (
      <div className="detalle-atencion-container">
        <header className="detalle-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMenu}>
              <span className="hamburger-icon">☰</span>
            </button>
            <img src="/logo.webp" alt="MINSA" className="header-logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }} />
          </div>
          <h1 className="page-title">Detalle de Atención</h1>
        </header>
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} />
        <main className="detalle-content">
          <div className="loading-message">
            <p>No se encontró la atención solicitada.</p>
            <button className="btn-primary" onClick={onBack}>Volver a Visualizar Atenciones</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="detalle-atencion-container">
      {/* Header */}
      <header className="detalle-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="hamburger-icon">☰</span>
          </button>
          <img src="/logo.webp" alt="MINSA" className="header-logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }} />
        </div>
        <h1 className="page-title">Detalle de Atención</h1>
        <div className="header-right">
          <button className="back-btn" onClick={onBack}>← Volver</button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="detalle-content">
        <div className="detalle-card" id="detalle-imprimible">
          {/* ID y Estado */}
          <div className="detalle-header-info">
            <h2>Atención N° {atencion.id}</h2>
            <span className={`status-badge ${getStatusClass(atencion.estado)}`}>
              {atencion.estado}
            </span>
          </div>

          {/* Información del Paciente */}
          <section className="detalle-section">
            <h3>Información del Paciente</h3>
            <div className="detalle-grid">
              <div className="detalle-item">
                <label>DNI</label>
                <span>{atencion.dniPaciente}</span>
              </div>
              <div className="detalle-item">
                <label>Nombre Completo</label>
                <span>{atencion.nombrePaciente}</span>
              </div>
              <div className="detalle-item">
                <label>Correo Electrónico</label>
                <span>{atencion.correoElectronico || '-'}</span>
              </div>
              <div className="detalle-item">
                <label>Teléfono</label>
                <span>{atencion.numeroTelefono || '-'}</span>
              </div>
              <div className="detalle-item">
                <label>Tiene Seguro (SIS)</label>
                <span>{atencion.tieneSeguro || 'No'}</span>
              </div>
            </div>
          </section>

          {/* Información de la Atención */}
          <section className="detalle-section">
            <h3>Información de la Atención</h3>
            <div className="detalle-grid">
              <div className="detalle-item">
                <label>Fecha de Atención</label>
                <span>{formatDate(atencion.fechaRealizacion)}</span>
              </div>
              <div className="detalle-item">
                <label>Tipo de Atención / Programa</label>
                <span>{atencion.tipoAtencion}</span>
              </div>
              <div className="detalle-item">
                <label>Obstetra</label>
                <span>{atencion.nombreObstetra || '-'}</span>
              </div>
              <div className="detalle-item">
                <label>Estado</label>
                <span>{atencion.estado}</span>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section className="detalle-section">
            <h3>Observaciones</h3>
            <div className="detalle-textarea-display">
              {atencion.observaciones || 'Sin observaciones'}
            </div>
          </section>

          {/* Botones de Acción */}
          <div className="detalle-actions">
            <button className="btn-secondary" onClick={onBack}>
              ← Volver a la Lista
            </button>
            <button className="btn-print" onClick={handlePrint}>
              🖨️ Imprimir
            </button>
            <button className="btn-export" onClick={handleExport}>
              📄 Exportar TXT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleAtencion;
