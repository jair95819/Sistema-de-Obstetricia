import { useState } from 'react';
import './VisualizarAtenciones.css';

const VisualizarAtenciones = ({ onNavigate, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Datos de ejemplo - en producción vendrían de la API
  const [atenciones] = useState([
    {
      id: 'AT-001',
      dniPaciente: '12345678',
      nombrePaciente: 'María García López',
      fechaRealizacion: '2025-01-15',
      tipoAtencion: 'Control Prenatal',
      estado: 'Completada',
      seReprogramo: 'No'
    },
    {
      id: 'AT-002',
      dniPaciente: '87654321',
      nombrePaciente: 'Ana Rodríguez Sánchez',
      fechaRealizacion: '2025-01-16',
      tipoAtencion: 'Consulta',
      estado: 'Pendiente seguimiento',
      seReprogramo: 'Sí'
    },
    {
      id: 'AT-003',
      dniPaciente: '11223344',
      nombrePaciente: 'Carmen Flores Torres',
      fechaRealizacion: '2025-01-17',
      tipoAtencion: 'Urgencia',
      estado: 'Completada',
      seReprogramo: 'No'
    },
    {
      id: 'AT-004',
      dniPaciente: '55667788',
      nombrePaciente: 'Rosa Martínez Pérez',
      fechaRealizacion: '2025-01-18',
      tipoAtencion: 'Control Prenatal',
      estado: 'Completada',
      seReprogramo: 'No'
    },
    {
      id: 'AT-005',
      dniPaciente: '99887766',
      nombrePaciente: 'Lucía Hernández Ruiz',
      fechaRealizacion: '2025-01-19',
      tipoAtencion: 'Posparto',
      estado: 'Pendiente seguimiento',
      seReprogramo: 'No'
    }
  ]);

  const handleSearch = () => {
    console.log('Buscar:', searchTerm);
    // Implementar lógica de búsqueda
  };

  const handleViewDetails = (atencionId) => {
    console.log('Ver detalles de:', atencionId);
    // Navegar a la página de detalles
    onNavigate('detalle-atencion-view', { atencionId });
  };

  const handleExport = () => {
    console.log('Exportar datos');
    // Implementar exportación a Excel/PDF
  };

  // Filtrar atenciones según búsqueda y filtros
  const filteredAtenciones = atenciones.filter(atencion => {
    const matchesSearch = 
      atencion.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atencion.dniPaciente.includes(searchTerm) ||
      atencion.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'todos' || atencion.tipoAtencion === filterType;
    const matchesStatus = filterStatus === 'todos' || atencion.estado === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

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

  return (
    <div className="visualizar-atenciones-container">
      {/* Header */}
      <header className="visualizar-header">
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
      <main className="visualizar-main">
        {/* Back Link */}
        <button className="back-link" onClick={onBack}>
          ← Volver a Atenciones
        </button>

        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">Visualizar Atenciones Realizadas</h2>
          <button className="search-button-header" onClick={handleSearch}>
            Buscar
          </button>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o N° de atención..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="filterType">Tipo de Atención:</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos</option>
                <option value="Control Prenatal">Control Prenatal</option>
                <option value="Consulta">Consulta</option>
                <option value="Urgencia">Urgencia</option>
                <option value="Posparto">Posparto</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filterStatus">Estado:</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos</option>
                <option value="Completada">Completada</option>
                <option value="Pendiente seguimiento">Pendiente seguimiento</option>
              </select>
            </div>

            <button className="export-button" onClick={handleExport}>
              📊 Exportar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {filteredAtenciones.length > 0 ? (
            <table className="atenciones-table">
              <thead>
                <tr>
                  <th>N° Atención</th>
                  <th>DNI Paciente</th>
                  <th>Nombre Paciente</th>
                  <th>Fecha de Realización</th>
                  <th>Tipo de Atención</th>
                  <th>Estado</th>
                  <th>¿Se reprogramó?</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAtenciones.map((atencion) => (
                  <tr key={atencion.id}>
                    <td className="id-column">{atencion.id}</td>
                    <td>{atencion.dniPaciente}</td>
                    <td className="nombre-column">{atencion.nombrePaciente}</td>
                    <td>{new Date(atencion.fechaRealizacion).toLocaleDateString('es-PE')}</td>
                    <td>{atencion.tipoAtencion}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(atencion.estado)}`}>
                        {atencion.estado}
                      </span>
                    </td>
                    <td className="reprogramo-column">{atencion.seReprogramo}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleViewDetails(atencion.id)}
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>📋 No se encontraron atenciones con los criterios seleccionados</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAtenciones.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Mostrando {filteredAtenciones.length} de {atenciones.length} atenciones
            </span>
          </div>
        )}
      </main>
    </div>
  );
};

export default VisualizarAtenciones;
