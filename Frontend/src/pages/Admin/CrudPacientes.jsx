import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const CrudPacientes = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoSeguro: '',
    estado: 'Activo'
  });

  useEffect(() => {
    const saved = localStorage.getItem('pacientes');
    if (saved) {
      setPacientes(JSON.parse(saved));
    } else {
      const datosEjemplo = [
        { id: 1, nombre: 'Sofía', apellido: 'Ramírez Torres', dni: '73822138', fechaNacimiento: '1995-03-15', telefono: '912345678', email: 'sofia@email.com', direccion: 'Av. Los Olivos 123', tipoSeguro: 'SIS', estado: 'Activo' },
        { id: 2, nombre: 'Valeria', apellido: 'Castro Flores', dni: '73370017', fechaNacimiento: '1992-08-22', telefono: '912345679', email: 'valeria@email.com', direccion: 'Jr. Las Flores 456', tipoSeguro: 'EsSalud', estado: 'Activo' },
        { id: 3, nombre: 'Lucía', apellido: 'Mendoza Silva', dni: '45678912', fechaNacimiento: '1998-11-10', telefono: '998877665', email: 'lucia@email.com', direccion: 'Calle Los Pinos 789', tipoSeguro: 'Particular', estado: 'Activo' }
      ];
      setPacientes(datosEjemplo);
      localStorage.setItem('pacientes', JSON.stringify(datosEjemplo));
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('pacientes', JSON.stringify(data));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '', email: '', direccion: '', tipoSeguro: '', estado: 'Activo' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      const updated = pacientes.filter(p => p.id !== id);
      setPacientes(updated);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      const updated = pacientes.map(p => p.id === editingItem.id ? { ...formData, id: editingItem.id } : p);
      setPacientes(updated);
      saveToStorage(updated);
    } else {
      const newItem = { ...formData, id: Date.now() };
      const updated = [...pacientes, newItem];
      setPacientes(updated);
      saveToStorage(updated);
    }
    setShowModal(false);
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const filteredData = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
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
          <h2 className="crud-title">🤰 Gestión de Pacientes</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Paciente</button>
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
                  <th>Edad</th>
                  <th>Teléfono</th>
                  <th>Tipo Seguro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td>{item.dni}</td>
                    <td>{item.nombre} {item.apellido}</td>
                    <td>{calcularEdad(item.fechaNacimiento)} años</td>
                    <td>{item.telefono}</td>
                    <td>{item.tipoSeguro}</td>
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
              <p>No se encontraron pacientes</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>
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
                <label>Fecha de Nacimiento</label>
                <input type="date" value={formData.fechaNacimiento} onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required maxLength={9} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tipo de Seguro</label>
                <select value={formData.tipoSeguro} onChange={e => setFormData({...formData, tipoSeguro: e.target.value})} required>
                  <option value="">Seleccione...</option>
                  <option value="SIS">SIS</option>
                  <option value="EsSalud">EsSalud</option>
                  <option value="Particular">Particular</option>
                  <option value="EPS">EPS</option>
                </select>
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

export default CrudPacientes;
