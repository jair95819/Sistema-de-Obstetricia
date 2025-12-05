import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudMetas = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [metas, setMetas] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ProgramaDeAtencionID: '',
    anio: new Date().getFullYear(),
    cantidad_atenciones: '',
    observaciones: '',
    estado: true,
    edad_objetivo_base: '',
    edad_objetivo_limite: ''
  });

  const fetchMetas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/metas`);
      if (!response.ok) throw new Error('Error al cargar metas');
      const data = await response.json();
      setMetas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramas = async () => {
    try {
      const response = await fetch(`${API_URL}/programas`);
      if (response.ok) {
        const data = await response.json();
        setProgramas(data);
      }
    } catch (err) {
      console.error('Error al cargar programas:', err);
    }
  };

  useEffect(() => {
    fetchMetas();
    fetchProgramas();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      ProgramaDeAtencionID: '',
      anio: new Date().getFullYear(),
      cantidad_atenciones: '',
      observaciones: '',
      estado: true,
      edad_objetivo_base: '',
      edad_objetivo_limite: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ProgramaDeAtencionID: item.ProgramaDeAtencionID || '',
      anio: item.anio || new Date().getFullYear(),
      cantidad_atenciones: item.cantidad_atenciones || '',
      observaciones: item.observaciones || '',
      estado: item.estado !== undefined ? item.estado : true,
      edad_objetivo_base: item.edad_objetivo_base || '',
      edad_objetivo_limite: item.edad_objetivo_limite || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar esta meta?')) {
      try {
        const response = await fetch(`${API_URL}/metas/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar');
        }
        await fetchMetas();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      let response;
      if (editingItem) {
        response = await fetch(`${API_URL}/metas/${editingItem.MetaID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/metas`, {
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
      await fetchMetas();
      alert(editingItem ? 'Meta actualizada exitosamente' : 'Meta creada exitosamente');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`${API_URL}/metas/search/${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setMetas(data);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    } else {
      fetchMetas();
    }
  };

  const filteredData = metas.filter(m => 
    m.nombre_programa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.observaciones?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(m.anio).includes(searchTerm)
  );

  // Generar años para el select (últimos 5 y próximos 2)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 5; y <= currentYear + 2; y++) {
    years.push(y);
  }

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
          <h2 className="crud-title">🎯 Gestión de Metas</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Meta</button>
        </div>

        <div className="crud-search-bar">
          <input
            type="text"
            className="crud-search-input"
            placeholder="Buscar por programa, año u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>Buscar</button>
        </div>

        {error && <div className="error-message">Error: {error}</div>}

        <div className="crud-table-container">
          {loading ? (
            <div className="loading-state"><p>Cargando metas...</p></div>
          ) : filteredData.length > 0 ? (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Programa</th>
                  <th>Año</th>
                  <th>Meta (Atenciones)</th>
                  <th>Edad Objetivo</th>
                  <th>Observaciones</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.MetaID}>
                    <td>{item.MetaID}</td>
                    <td><strong>{item.nombre_programa || 'Sin programa'}</strong></td>
                    <td>{item.anio}</td>
                    <td>{item.cantidad_atenciones} atenciones</td>
                    <td>
                      {item.edad_objetivo_base && item.edad_objetivo_limite 
                        ? `${item.edad_objetivo_base} - ${item.edad_objetivo_limite} años`
                        : '-'}
                    </td>
                    <td>{item.observaciones || '-'}</td>
                    <td>
                      <span className={`status-badge ${item.estado ? 'status-activo' : 'status-inactivo'}`}>
                        {item.estado ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <div className="crud-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.MetaID)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No se encontraron metas</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Meta' : 'Nueva Meta'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Programa de Atención *</label>
                <select 
                  value={formData.ProgramaDeAtencionID} 
                  onChange={e => setFormData({...formData, ProgramaDeAtencionID: e.target.value})} 
                  required
                >
                  <option value="">Seleccione un programa...</option>
                  {programas.map(prog => (
                    <option key={prog.ProgramaDeAtencionID} value={prog.ProgramaDeAtencionID}>
                      {prog.nombre_programa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Año *</label>
                  <select 
                    value={formData.anio} 
                    onChange={e => setFormData({...formData, anio: e.target.value})} 
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cantidad de Atenciones (Meta) *</label>
                  <input 
                    type="number" 
                    value={formData.cantidad_atenciones} 
                    onChange={e => setFormData({...formData, cantidad_atenciones: e.target.value})} 
                    required 
                    min="1"
                    placeholder="Ej: 100"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Edad Objetivo Base</label>
                  <input 
                    type="number" 
                    value={formData.edad_objetivo_base} 
                    onChange={e => setFormData({...formData, edad_objetivo_base: e.target.value})} 
                    min="0"
                    max="120"
                    placeholder="Ej: 18"
                  />
                </div>
                <div className="form-group">
                  <label>Edad Objetivo Límite</label>
                  <input 
                    type="number" 
                    value={formData.edad_objetivo_limite} 
                    onChange={e => setFormData({...formData, edad_objetivo_limite: e.target.value})} 
                    min="0"
                    max="120"
                    placeholder="Ej: 65"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Observaciones</label>
                <textarea 
                  value={formData.observaciones} 
                  onChange={e => setFormData({...formData, observaciones: e.target.value})} 
                  rows={3} 
                  maxLength={50}
                  placeholder="Observaciones adicionales..."
                ></textarea>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select 
                  value={formData.estado} 
                  onChange={e => setFormData({...formData, estado: e.target.value === 'true'})}
                >
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudMetas;
