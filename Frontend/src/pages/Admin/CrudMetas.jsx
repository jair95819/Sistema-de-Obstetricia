import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const CrudMetas = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [metas, setMetas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    valorObjetivo: '',
    valorActual: '',
    unidadMedida: '',
    fechaInicio: '',
    fechaFin: '',
    responsable: '',
    estado: 'En Progreso'
  });

  useEffect(() => {
    const saved = localStorage.getItem('metas');
    if (saved) {
      setMetas(JSON.parse(saved));
    } else {
      const datosEjemplo = [
        { id: 1, nombre: 'Control Prenatal', descripcion: 'Alcanzar 100 controles prenatales mensuales', categoria: 'Atención Prenatal', valorObjetivo: 100, valorActual: 75, unidadMedida: 'Controles', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', responsable: 'Dra. María García', estado: 'En Progreso' },
        { id: 2, nombre: 'Partos Atendidos', descripcion: 'Atender 50 partos mensuales', categoria: 'Atención del Parto', valorObjetivo: 50, valorActual: 42, unidadMedida: 'Partos', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', responsable: 'Dra. Ana López', estado: 'En Progreso' },
        { id: 3, nombre: 'Vacunación Gestantes', descripcion: 'Vacunar al 95% de gestantes', categoria: 'Inmunización', valorObjetivo: 95, valorActual: 98, unidadMedida: '%', fechaInicio: '2025-01-01', fechaFin: '2025-06-30', responsable: 'Dra. María García', estado: 'Completado' }
      ];
      setMetas(datosEjemplo);
      localStorage.setItem('metas', JSON.stringify(datosEjemplo));
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('metas', JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ nombre: '', descripcion: '', categoria: '', valorObjetivo: '', valorActual: '', unidadMedida: '', fechaInicio: '', fechaFin: '', responsable: '', estado: 'En Progreso' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar esta meta?')) {
      const updated = metas.filter(m => m.id !== id);
      setMetas(updated);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      const updated = metas.map(m => m.id === editingItem.id ? { ...formData, id: editingItem.id } : m);
      setMetas(updated);
      saveToStorage(updated);
    } else {
      const newItem = { ...formData, id: Date.now() };
      const updated = [...metas, newItem];
      setMetas(updated);
      saveToStorage(updated);
    }
    setShowModal(false);
  };

  const calcularProgreso = (valorActual, valorObjetivo) => {
    return Math.round((valorActual / valorObjetivo) * 100);
  };

  const filteredData = metas.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.responsable.toLowerCase().includes(searchTerm.toLowerCase())
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
          />
          <button className="btn-search">Buscar</button>
        </div>

        <div className="crud-table-container">
          {filteredData.length > 0 ? (
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
                  <tr key={item.id}>
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
                              width: `${Math.min(calcularProgreso(item.valorActual, item.valorObjetivo), 100)}%`,
                              backgroundColor: calcularProgreso(item.valorActual, item.valorObjetivo) >= 100 ? '#28a745' : '#667eea'
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{item.valorActual}/{item.valorObjetivo} {item.unidadMedida}</span>
                      </div>
                    </td>
                    <td>{new Date(item.fechaFin).toLocaleDateString('es-PE')}</td>
                    <td>{item.responsable}</td>
                    <td>
                      <span className={`status-badge ${item.estado === 'Completado' ? 'status-activo' : item.estado === 'En Progreso' ? 'status-progreso' : 'status-inactivo'}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td>
                      <div className="crud-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
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
                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required rows={3}></textarea>
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
                  <input type="number" value={formData.valorObjetivo} onChange={e => setFormData({...formData, valorObjetivo: parseInt(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Valor Actual</label>
                  <input type="number" value={formData.valorActual} onChange={e => setFormData({...formData, valorActual: parseInt(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Unidad de Medida</label>
                  <input type="text" value={formData.unidadMedida} onChange={e => setFormData({...formData, unidadMedida: e.target.value})} placeholder="Ej: Controles, %, Pacientes" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio</label>
                  <input type="date" value={formData.fechaInicio} onChange={e => setFormData({...formData, fechaInicio: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Fecha Fin</label>
                  <input type="date" value={formData.fechaFin} onChange={e => setFormData({...formData, fechaFin: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Responsable</label>
                <input type="text" value={formData.responsable} onChange={e => setFormData({...formData, responsable: e.target.value})} required />
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
