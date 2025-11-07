import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Metas.css';

const Metas = ({ onNavigate, onBack, onHome }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Datos de ejemplo para los programas
  const programas = [
    { id: 1, nombre: 'Programa 1:', progreso: 75 },
    { id: 2, nombre: 'Programa 2:', progreso: 60 },
    { id: 3, nombre: 'Programa 3:', progreso: 45 },
    { id: 4, nombre: 'Programa 4:', progreso: 90 },
    { id: 5, nombre: 'Programa 5:', progreso: 30 },
  ];

  // Calcular avance total promedio
  const avanceTotal = Math.round(
    programas.reduce((acc, prog) => acc + prog.progreso, 0) / programas.length
  );

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
        onClose={toggleSidebar}
        onNavigate={onNavigate}
        onHome={onHome}
      />

      {/* Main Content */}
      <div className="metas-content">
        <h2 className="metas-title">Mis Metas</h2>

        <div className="metas-grid">
          {/* Left Column - Programs List */}
          <div className="programs-list">
            {programas.map((programa) => (
              <div key={programa.id} className="program-item">
                <label className="program-label">{programa.nombre}</label>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${programa.progreso}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Pie Chart */}
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
                  stroke="#8B0000"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metas;
