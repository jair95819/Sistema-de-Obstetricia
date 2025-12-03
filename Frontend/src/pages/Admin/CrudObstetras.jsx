import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const CrudObstetras = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [obstetras, setObstetras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    especialidad: '',
    telefono: '',
    email: '',
    estado: 'Activo'
  });

  useEffect(() => {
    // Cargar datos de localStorage o usar datos de ejemplo
    const saved = localStorage.getItem('obstetras');
    if (saved) {
      setObstetras(JSON.parse(saved));
    } else {
      const datosEjemplo = [
        { id: 1, nombre: 'María', apellido: 'García López', dni: '12345678', especialidad: 'Obstetricia General', telefono: '987654321', email: 'maria.garcia@minsa.gob.pe', estado: 'Activo' },
        { id: 2, nombre: 'Ana', apellido: 'Rodríguez Pérez', dni: '87654321', especialidad: 'Alto Riesgo Obstétrico', telefono: '912345678', email: 'ana.rodriguez@minsa.gob.pe', estado: 'Activo' },
        { id: 3, nombre: 'Carmen', apellido: 'Flores Vásquez', dni: '11223344', especialidad: 'Obstetricia General', telefono: '998877665', email: 'carmen.flores@minsa.gob.pe', estado: 'Inactivo' }
      ];
      setObstetras(datosEjemplo);
      localStorage.setItem('obstetras', JSON.stringify(datosEjemplo));
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('obstetras', JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ nombre: '', apellido: '', dni: '', especialidad: '', telefono: '', email: '', estado: 'Activo' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este obstetra?')) {
      const updated = obstetras.filter(o => o.id !== id);
      setObstetras(updated);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      const updated = obstetras.map(o => o.id === editingItem.id ? { ...formData, id: editingItem.id } : o);
      setObstetras(updated);
      saveToStorage(updated);
    } else {
      const newItem = { ...formData, id: Date.now() };
      const updated = [...obstetras, newItem];
      setObstetras(updated);
      saveToStorage(updated);
    }
    setShowModal(false);
  };

  const filteredData = obstetras.filter(o => 
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.dni.includes(searchTerm)
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
          <h2 className="crud-title">👩‍⚕️ Gestión de Obstetras</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Obstetra</button>
        </div>

        <div className="crud-search-bar">
          <input
            type="text"
            className="crud-search-input"
            placeholder="Buscar por nombre, apellido o DNI..."
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
                  <th>DNI</th>
                  <th>Nombre Completo</th>
                  <th>Especialidad</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td>{item.dni}</td>
                    <td>{item.nombre} {item.apellido}</td>
                    <td>{item.especialidad}</td>
                    <td>{item.telefono}</td>
                    <td>{item.email}</td>
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
              <p>No se encontraron obstetras</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Obstetra' : 'Nuevo Obstetra'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>DNI</label>
                <input type="text" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} required maxLength={8} />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input type="text" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <select value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  <option value="Obstetricia General">Obstetricia General</option>
                  <option value="Alto Riesgo Obstétrico">Alto Riesgo Obstétrico</option>
                  <option value="Salud Reproductiva">Salud Reproductiva</option>
                  <option value="Educación Prenatal">Educación Prenatal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required maxLength={9} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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

export default CrudObstetras;
