import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Metas.css';

const API_URL = 'http://localhost:4000/api';

const Metas = ({ onNavigate, onBack, onHome }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cargar metas con progreso desde la API
  useEffect(() => {
    const fetchMetasProgreso = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/metas/progreso/${anioSeleccionado}`);
        if (response.ok) {
          const data = await response.json();
          setProgramas(data);
        } else {
          setProgramas([]);
        }
      } catch (error) {
        console.error('Error al cargar metas:', error);
        setProgramas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetasProgreso();
  }, [anioSeleccionado]);

  // Calcular avance total promedio
  const avanceTotal = programas.length > 0 
    ? Math.round(programas.reduce((acc, prog) => acc + prog.porcentaje, 0) / programas.length)
    : 0;

  // Generar años para el selector
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y++) {
    years.push(y);
  }

  return (
    <div className="metas-container">
      {/* Header */}
      <div className="metas-header">
        <button className="hamburger-button" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="header-logo">
          <img 
            src="/logo.webp" 
            alt="MINSA" 
            className="logo-img"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <h1 className="header-title">SISTEMA DE SEGUIMIENTO DE METAS DE OBSTETRICIA</h1>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
        currentPage="metas"
      />

      {/* Main Content */}
      <div className="metas-content">
        <div className="metas-title-row">
          <button className="back-button" onClick={onBack} aria-label="Volver">
            ←
          </button>
          <h2 className="metas-title">Metas</h2>
          <div className="anio-selector">
            <label>Año:</label>
            <select 
              value={anioSeleccionado} 
              onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-metas">
            <p>Cargando metas...</p>
          </div>
        ) : programas.length === 0 ? (
          <div className="no-metas">
            <p>No hay metas registradas para el año {anioSeleccionado}</p>
            <p className="no-metas-hint">El administrador puede agregar metas desde el panel de administración.</p>
          </div>
        ) : (
          <div className="metas-grid">
            {/* Left Column - Programs List */}
            <div className="programs-list">
              {programas.map((programa) => (
                <div key={programa.MetaID} className="program-item">
                  <label className="program-label">{programa.nombre_programa}:</label>
                  <div className="progress-wrapper">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ 
                          width: `${programa.porcentaje}%`,
                          backgroundColor: programa.porcentaje >= 100 ? '#28a745' : 
                                          programa.porcentaje >= 75 ? '#17a2b8' :
                                          programa.porcentaje >= 50 ? '#ffc107' : '#dc3545'
                        }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{programa.porcentaje}%</span>
                  </div>
                  <span className="progress-detail">
                    ({programa.atenciones_realizadas}/{programa.meta_cantidad})
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column - Total Progress */}
            <div className="chart-section">
              <h3 className="chart-title">Avance Total</h3>
              <div className="pie-chart-container">
                <svg viewBox="0 0 200 200" className="pie-chart">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="20"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={avanceTotal >= 100 ? '#28a745' : 
                           avanceTotal >= 75 ? '#17a2b8' :
                           avanceTotal >= 50 ? '#ffc107' : '#dc3545'}
                    strokeWidth="20"
                    strokeDasharray={`${avanceTotal * 5.65} 565`}
                    strokeDashoffset="141.25"
                    transform="rotate(-90 100 100)"
                    className="progress-arc"
                  />
                  {/* Center text */}
                  <text
                    x="100"
                    y="105"
                    textAnchor="middle"
                    className="chart-percentage"
                  >
                    {avanceTotal}%
                  </text>
                </svg>
              </div>
              <p className="chart-subtitle">Promedio de cumplimiento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metas;
