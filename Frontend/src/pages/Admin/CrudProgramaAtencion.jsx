import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudProgramaAtencion = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    AreaDeObstetriciaID: '',
    nombre_programa: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: true,
    tipo_programa: ''
  });

  // Estados para asignación de obstetras
  const [showObstetrasModal, setShowObstetrasModal] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [obstetrasAsignados, setObstetrasAsignados] = useState([]);
  const [obstetrasDisponibles, setObstetrasDisponibles] = useState([]);
  const [loadingObstetras, setLoadingObstetras] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [asignacionData, setAsignacionData] = useState({
    ObstetraID: '',
    fecha_inicio: '',
    fecha_fin: '',
    is_active: true
  });

  const fetchProgramas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/programas`);
      if (!response.ok) throw new Error('Error al cargar programas');
      const data = await response.json();
      setProgramas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_URL}/areas`);
      if (!response.ok) throw new Error('Error al cargar áreas');
      const data = await response.json();
      setAreas(data);
    } catch (err) {
      console.error('Error cargando áreas:', err);
    }
  };

  useEffect(() => {
    fetchProgramas();
    fetchAreas();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      AreaDeObstetriciaID: '',
      nombre_programa: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: true,
      tipo_programa: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      AreaDeObstetriciaID: item.AreaDeObstetriciaID || '',
      nombre_programa: item.nombre_programa || '',
      descripcion: item.descripcion || '',
      fecha_inicio: formatDate(item.fecha_inicio),
      fecha_fin: formatDate(item.fecha_fin),
      estado: item.estado === true || item.estado === 1,
      tipo_programa: item.tipo_programa || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar este programa?')) {
      try {
        const response = await fetch(`${API_URL}/programas/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar');
        }
        await fetchProgramas();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        AreaDeObstetriciaID: formData.AreaDeObstetriciaID ? parseInt(formData.AreaDeObstetriciaID) : null,
        estado: formData.estado ? 1 : 0
      };
      
      let response;
      if (editingItem) {
        response = await fetch(`${API_URL}/programas/${editingItem.ProgramaDeAtencionID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/programas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al guardar');
      }
      setShowModal(false);
      await fetchProgramas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`${API_URL}/programas/search/${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setProgramas(data);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    } else {
      fetchProgramas();
    }
  };

  // Funciones para gestionar obstetras asignados
  const handleVerObstetras = async (programa) => {
    setSelectedPrograma(programa);
    setLoadingObstetras(true);
    setShowObstetrasModal(true);
    
    try {
      const [asignadosRes, disponiblesRes] = await Promise.all([
        fetch(`${API_URL}/programas/${programa.ProgramaDeAtencionID}/obstetras`),
        fetch(`${API_URL}/programas/${programa.ProgramaDeAtencionID}/obstetras-disponibles`)
      ]);
      
      if (asignadosRes.ok) {
        const asignados = await asignadosRes.json();
        setObstetrasAsignados(asignados);
      }
      
      if (disponiblesRes.ok) {
        const disponibles = await disponiblesRes.json();
        setObstetrasDisponibles(disponibles);
      }
    } catch (err) {
      console.error('Error cargando obstetras:', err);
    } finally {
      setLoadingObstetras(false);
    }
  };

  const handleAbrirAsignar = () => {
    setAsignacionData({
      ObstetraID: '',
      fecha_inicio: formatDate(new Date().toISOString()),
      fecha_fin: '',
      is_active: true
    });
    setShowAsignarModal(true);
  };

  const handleAsignarObstetra = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/programas/${selectedPrograma.ProgramaDeAtencionID}/obstetras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ObstetraID: parseInt(asignacionData.ObstetraID),
          fecha_inicio: asignacionData.fecha_inicio,
          fecha_fin: asignacionData.fecha_fin || null,
          is_active: asignacionData.is_active ? 1 : 0
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al asignar obstetra');
      }
      
      setShowAsignarModal(false);
      handleVerObstetras(selectedPrograma); // Recargar lista
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminarAsignacion = async (obstetraId) => {
    if (confirm('¿Está seguro de eliminar esta asignación?')) {
      try {
        const response = await fetch(`${API_URL}/programas/${selectedPrograma.ProgramaDeAtencionID}/obstetras/${obstetraId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar asignación');
        }
        
        handleVerObstetras(selectedPrograma); // Recargar lista
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredData = programas.filter(p => 
    p.nombre_programa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tipo_programa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombre_area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-crud-container">
      <header className="admin-crud-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="hamburger-icon">☰</span>
          </button>
          <img src="/logo.webp" alt="Logo" className="header-logo" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }} />
        </div>
        <h1 className="header-title">SISTEMA DE SEGUIMIENTO DE METAS DE OBSTETRICIA</h1>
      </header>

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onNavigate} currentPage="admin" />

      <main className="admin-crud-main">
        <button className="back-link" onClick={onBack}>← Volver a Administración</button>

        <div className="crud-header">
          <h2 className="crud-title">📋 Gestión de Programas de Atención</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Programa</button>
        </div>

        <div className="crud-search-bar">
          <input
            type="text"
            className="crud-search-input"
            placeholder="Buscar por nombre, tipo o área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>Buscar</button>
        </div>

        {error && <div className="error-message">Error: {error}</div>}

        <div className="crud-table-container">
          {loading ? (
            <div className="loading-state"><p>Cargando programas...</p></div>
          ) : filteredData.length > 0 ? (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del Programa</th>
                  <th>Área</th>
                  <th>Tipo</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.ProgramaDeAtencionID}>
                    <td><span className="codigo-badge">{item.ProgramaDeAtencionID}</span></td>
                    <td>
                      <div className="programa-info">
                        <strong>{item.nombre_programa}</strong>
                        {item.descripcion && <small>{item.descripcion}</small>}
                      </div>
                    </td>
                    <td>
                      <span className="area-badge">{item.nombre_area || 'Sin área'}</span>
                    </td>
                    <td>
                      <span className={`tipo-badge ${item.tipo_programa === 'Preventivo' ? 'tipo-preventivo' : item.tipo_programa === 'Recuperativo' ? 'tipo-recuperativo' : ''}`}>
                        {item.tipo_programa}
                      </span>
                    </td>
                    <td>{formatDisplayDate(item.fecha_inicio)}</td>
                    <td>{formatDisplayDate(item.fecha_fin)}</td>
                    <td>
                      <span className={`status-badge ${item.estado ? 'status-activo' : 'status-inactivo'}`}>
                        {item.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="crud-actions">
                        <button className="btn-toggle" onClick={() => handleVerObstetras(item)} title="Ver obstetras asignados">👥</button>
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.ProgramaDeAtencionID)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No se encontraron programas de atención</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Programa' : 'Nuevo Programa'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Programa *</label>
                <input 
                  type="text" 
                  value={formData.nombre_programa} 
                  onChange={e => setFormData({...formData, nombre_programa: e.target.value})} 
                  placeholder="Ingrese el nombre del programa"
                  required 
                  maxLength={200} 
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  value={formData.descripcion} 
                  onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                  rows={3} 
                  placeholder="Descripción del programa de atención"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Área de Obstetricia</label>
                  <select 
                    value={formData.AreaDeObstetriciaID} 
                    onChange={e => setFormData({...formData, AreaDeObstetriciaID: e.target.value})}
                  >
                    <option value="">Seleccione un área...</option>
                    {areas.map(area => (
                      <option key={area.AreaDeObstetriciaID} value={area.AreaDeObstetriciaID}>
                        {area.nombre_area}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de Programa *</label>
                  <select 
                    value={formData.tipo_programa} 
                    onChange={e => setFormData({...formData, tipo_programa: e.target.value})} 
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Preventivo">Preventivo</option>
                    <option value="Recuperativo">Recuperativo</option>
                    <option value="Promocional">Promocional</option>
                    <option value="Control">Control</option>
                    <option value="Seguimiento">Seguimiento</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input 
                    type="date" 
                    value={formData.fecha_inicio} 
                    onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input 
                    type="date" 
                    value={formData.fecha_fin} 
                    onChange={e => setFormData({...formData, fecha_fin: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.estado} 
                    onChange={e => setFormData({...formData, estado: e.target.checked})} 
                  />
                  <span>Programa Activo</span>
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Obstetras Asignados */}
      {showObstetrasModal && (
        <div className="modal-overlay" onClick={() => setShowObstetrasModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">👥 Obstetras - {selectedPrograma?.nombre_programa}</h3>
              <button className="modal-close" onClick={() => setShowObstetrasModal(false)}>×</button>
            </div>
            
            <div className="obstetras-section">
              <div className="obstetras-header">
                <h4>Obstetras Asignados</h4>
                <button className="btn-add btn-small" onClick={handleAbrirAsignar}>+ Asignar Obstetra</button>
              </div>
              
              {loadingObstetras ? (
                <div className="loading-state"><p>Cargando...</p></div>
              ) : obstetrasAsignados.length > 0 ? (
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Obstetra</th>
                      <th>DNI</th>
                      <th>Especialidad</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obstetrasAsignados.map(obs => (
                      <tr key={obs.ObstetraID}>
                        <td><strong>{obs.apellido}, {obs.nombre}</strong></td>
                        <td>{obs.DNI}</td>
                        <td>{obs.especialidad || '-'}</td>
                        <td>{formatDisplayDate(obs.fecha_inicio)}</td>
                        <td>{formatDisplayDate(obs.fecha_fin)}</td>
                        <td>
                          <span className={`status-badge ${obs.is_active ? 'status-activo' : 'status-inactivo'}`}>
                            {obs.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-delete btn-small" onClick={() => handleEliminarAsignacion(obs.ObstetraID)}>Quitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No hay obstetras asignados a este programa</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Asignar Obstetra */}
      {showAsignarModal && (
        <div className="modal-overlay" onClick={() => setShowAsignarModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Asignar Obstetra</h3>
              <button className="modal-close" onClick={() => setShowAsignarModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleAsignarObstetra}>
              <div className="form-group">
                <label>Seleccionar Obstetra *</label>
                <select 
                  value={asignacionData.ObstetraID} 
                  onChange={e => setAsignacionData({...asignacionData, ObstetraID: e.target.value})}
                  required
                >
                  <option value="">Seleccione un obstetra...</option>
                  {obstetrasDisponibles.map(obs => (
                    <option key={obs.ObstetraID} value={obs.ObstetraID}>
                      {obs.apellido}, {obs.nombre} - DNI: {obs.DNI}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Inicio *</label>
                  <input 
                    type="date" 
                    value={asignacionData.fecha_inicio} 
                    onChange={e => setAsignacionData({...asignacionData, fecha_inicio: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input 
                    type="date" 
                    value={asignacionData.fecha_fin} 
                    onChange={e => setAsignacionData({...asignacionData, fecha_fin: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={asignacionData.is_active} 
                    onChange={e => setAsignacionData({...asignacionData, is_active: e.target.checked})} 
                  />
                  <span>Asignación Activa</span>
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAsignarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Asignar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudProgramaAtencion;
