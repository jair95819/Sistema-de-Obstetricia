import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudMetas = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [metas, setMetas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    valor_objetivo: '',
    valor_actual: '',
    unidad_medida: '',
    fecha_inicio: '',
    fecha_fin: '',
    responsable: '',
    estado: 'En Progreso'
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

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ nombre: '', descripcion: '', categoria: '', valor_objetivo: '', valor_actual: '', unidad_medida: '', fecha_inicio: '', fecha_fin: '', responsable: '', estado: 'En Progreso' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      categoria: item.categoria || '',
      valor_objetivo: item.valor_objetivo || '',
      valor_actual: item.valor_actual || '',
      unidad_medida: item.unidad_medida || '',
      fecha_inicio: item.fecha_inicio ? item.fecha_inicio.split('T')[0] : '',
      fecha_fin: item.fecha_fin ? item.fecha_fin.split('T')[0] : '',
      responsable: item.responsable || '',
      estado: item.estado || 'En Progreso'
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

  const calcularProgreso = (valorActual, valorObjetivo) => {
    if (!valorObjetivo) return 0;
    return Math.round((valorActual / valorObjetivo) * 100);
  };

  const filteredData = metas.filter(m => 
    m.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="crud-title">🎯 Gestión de Metas</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Meta</button>
        </div>

        <div className="crud-search-bar">
          <input
            type="text"
            className="crud-search-input"
            placeholder="Buscar por nombre, categoría o responsable..."
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
                  <th>Meta</th>
                  <th>Categoría</th>
                  <th>Progreso</th>
                  <th>Fecha Límite</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.MetaID}>
                    <td>
                      <div className="meta-info">
                        <strong>{item.nombre}</strong>
                        <small>{item.descripcion}</small>
                      </div>
                    </td>
                    <td>{item.categoria}</td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${Math.min(calcularProgreso(item.valor_actual, item.valor_objetivo), 100)}%`,
                              backgroundColor: calcularProgreso(item.valor_actual, item.valor_objetivo) >= 100 ? '#28a745' : '#667eea'
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{item.valor_actual}/{item.valor_objetivo} {item.unidad_medida}</span>
                      </div>
                    </td>
                    <td>{item.fecha_fin ? new Date(item.fecha_fin).toLocaleDateString('es-PE') : '-'}</td>
                    <td>{item.responsable}</td>
                    <td>
                      <span className={`status-badge ${item.estado === 'Completado' ? 'status-activo' : item.estado === 'En Progreso' ? 'status-progreso' : 'status-inactivo'}`}>
                        {item.estado}
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
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Meta' : 'Nueva Meta'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la Meta</label>
                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required maxLength={100} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} rows={3} maxLength={255}></textarea>
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  <option value="Atención Prenatal">Atención Prenatal</option>
                  <option value="Atención del Parto">Atención del Parto</option>
                  <option value="Atención Postnatal">Atención Postnatal</option>
                  <option value="Inmunización">Inmunización</option>
                  <option value="Planificación Familiar">Planificación Familiar</option>
                  <option value="Salud Sexual">Salud Sexual</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Valor Objetivo</label>
                  <input type="number" value={formData.valor_objetivo} onChange={e => setFormData({...formData, valor_objetivo: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Valor Actual</label>
                  <input type="number" value={formData.valor_actual} onChange={e => setFormData({...formData, valor_actual: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Unidad de Medida</label>
                  <input type="text" value={formData.unidad_medida} onChange={e => setFormData({...formData, unidad_medida: e.target.value})} placeholder="Ej: Controles, %, Pacientes" required maxLength={30} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input type="date" value={formData.fecha_inicio} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input type="date" value={formData.fecha_fin} onChange={e => setFormData({...formData, fecha_fin: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Responsable</label>
                <input type="text" value={formData.responsable} onChange={e => setFormData({...formData, responsable: e.target.value})} required maxLength={100} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
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
