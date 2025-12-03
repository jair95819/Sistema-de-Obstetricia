import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const CrudProgramaAtencion = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipoAtencion: '',
    duracion: '',
    requisitos: '',
    poblacionObjetivo: '',
    frecuencia: '',
    responsable: '',
    estado: 'Activo'
  });

  useEffect(() => {
    const saved = localStorage.getItem('programasAtencion');
    if (saved) {
      setProgramas(JSON.parse(saved));
    } else {
      const datosEjemplo = [
        { id: 1, codigo: 'PA-001', nombre: 'Control Prenatal', descripcion: 'Seguimiento integral de la gestación', tipoAtencion: 'Preventivo', duracion: '9 meses', requisitos: 'Gestante captada', poblacionObjetivo: 'Gestantes', frecuencia: 'Mensual', responsable: 'Dra. María García', estado: 'Activo' },
        { id: 2, codigo: 'PA-002', nombre: 'Atención del Parto', descripcion: 'Atención profesional durante el trabajo de parto', tipoAtencion: 'Recuperativo', duracion: 'Variable', requisitos: 'Gestante en trabajo de parto', poblacionObjetivo: 'Gestantes', frecuencia: 'Por demanda', responsable: 'Dra. Ana López', estado: 'Activo' },
        { id: 3, codigo: 'PA-003', nombre: 'Control Puerperal', descripcion: 'Seguimiento post parto', tipoAtencion: 'Preventivo', duracion: '42 días', requisitos: 'Puérpera', poblacionObjetivo: 'Puérperas', frecuencia: '7 días, 14 días, 42 días', responsable: 'Dra. María García', estado: 'Activo' },
        { id: 4, codigo: 'PA-004', nombre: 'Planificación Familiar', descripcion: 'Orientación y provisión de métodos anticonceptivos', tipoAtencion: 'Preventivo', duracion: 'Continuo', requisitos: 'MEF', poblacionObjetivo: 'Mujeres en edad fértil', frecuencia: 'Según método', responsable: 'Dra. Carmen Ruiz', estado: 'Activo' }
      ];
      setProgramas(datosEjemplo);
      localStorage.setItem('programasAtencion', JSON.stringify(datosEjemplo));
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('programasAtencion', JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ codigo: '', nombre: '', descripcion: '', tipoAtencion: '', duracion: '', requisitos: '', poblacionObjetivo: '', frecuencia: '', responsable: '', estado: 'Activo' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este programa?')) {
      const updated = programas.filter(p => p.id !== id);
      setProgramas(updated);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      const updated = programas.map(p => p.id === editingItem.id ? { ...formData, id: editingItem.id } : p);
      setProgramas(updated);
      saveToStorage(updated);
    } else {
      const newItem = { ...formData, id: Date.now() };
      const updated = [...programas, newItem];
      setProgramas(updated);
      saveToStorage(updated);
    }
    setShowModal(false);
  };

  const filteredData = programas.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tipoAtencion.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar por código, nombre o tipo de atención..."
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
                  <th>Código</th>
                  <th>Programa</th>
                  <th>Tipo Atención</th>
                  <th>Población Objetivo</th>
                  <th>Frecuencia</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td><span className="codigo-badge">{item.codigo}</span></td>
                    <td>
                      <div className="programa-info">
                        <strong>{item.nombre}</strong>
                        <small>{item.descripcion}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`tipo-badge ${item.tipoAtencion === 'Preventivo' ? 'tipo-preventivo' : 'tipo-recuperativo'}`}>
                        {item.tipoAtencion}
                      </span>
                    </td>
                    <td>{item.poblacionObjetivo}</td>
                    <td>{item.frecuencia}</td>
                    <td>{item.responsable}</td>
                    <td>
                      <span className={`status-badge ${item.estado === 'Activo' ? 'status-activo' : 'status-inactivo'}`}>
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
              <div className="form-row">
                <div className="form-group">
                  <label>Código</label>
                  <input type="text" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} placeholder="Ej: PA-001" required />
                </div>
                <div className="form-group">
                  <label>Nombre del Programa</label>
                  <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required rows={3}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Atención</label>
                  <select value={formData.tipoAtencion} onChange={e => setFormData({...formData, tipoAtencion: e.target.value})} required>
                    <option value="">Seleccione...</option>
                    <option value="Preventivo">Preventivo</option>
                    <option value="Recuperativo">Recuperativo</option>
                    <option value="Promocional">Promocional</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duración</label>
                  <input type="text" value={formData.duracion} onChange={e => setFormData({...formData, duracion: e.target.value})} placeholder="Ej: 9 meses, 42 días" required />
                </div>
              </div>
              <div className="form-group">
                <label>Requisitos</label>
                <input type="text" value={formData.requisitos} onChange={e => setFormData({...formData, requisitos: e.target.value})} placeholder="Requisitos para acceder al programa" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Población Objetivo</label>
                  <select value={formData.poblacionObjetivo} onChange={e => setFormData({...formData, poblacionObjetivo: e.target.value})} required>
                    <option value="">Seleccione...</option>
                    <option value="Gestantes">Gestantes</option>
                    <option value="Puérperas">Puérperas</option>
                    <option value="Mujeres en edad fértil">Mujeres en edad fértil</option>
                    <option value="Adolescentes">Adolescentes</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frecuencia</label>
                  <input type="text" value={formData.frecuencia} onChange={e => setFormData({...formData, frecuencia: e.target.value})} placeholder="Ej: Mensual, Semanal" required />
                </div>
              </div>
              <div className="form-group">
                <label>Responsable</label>
                <input type="text" value={formData.responsable} onChange={e => setFormData({...formData, responsable: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En Revisión">En Revisión</option>
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

export default CrudProgramaAtencion;
