import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudPacientes = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    NumDoc: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    tipo_seguro: '',
    estado: 'Activo'
  });

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pacientes`);
      if (!response.ok) throw new Error('Error al cargar pacientes');
      const data = await response.json();
      setPacientes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ NumDoc: '', nombres: '', apellidos: '', fecha_nacimiento: '', telefono: '', direccion: '', tipo_seguro: '', estado: 'Activo' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      NumDoc: item.NumDoc || '',
      nombres: item.nombres || '',
      apellidos: item.apellidos || '',
      fecha_nacimiento: item.fecha_nacimiento ? item.fecha_nacimiento.split('T')[0] : '',
      telefono: item.telefono || '',
      direccion: item.direccion || '',
      tipo_seguro: item.tipo_seguro || '',
      estado: item.estado || 'Activo'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      try {
        const response = await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar');
        }
        await fetchPacientes();
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
        response = await fetch(`${API_URL}/pacientes/${editingItem.PacienteID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/pacientes`, {
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
      await fetchPacientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`${API_URL}/pacientes/search/${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setPacientes(data);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    } else {
      fetchPacientes();
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-';
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
    p.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.NumDoc?.includes(searchTerm)
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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>Buscar</button>
        </div>

        {error && <div className="error-message">Error: {error}</div>}

        <div className="crud-table-container">
          {loading ? (
            <div className="loading-state"><p>Cargando pacientes...</p></div>
          ) : filteredData.length > 0 ? (
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
                  <tr key={item.PacienteID}>
                    <td>{item.NumDoc}</td>
                    <td>{item.nombres} {item.apellidos}</td>
                    <td>{calcularEdad(item.fecha_nacimiento)} años</td>
                    <td>{item.telefono || '-'}</td>
                    <td>{item.tipo_seguro || '-'}</td>
                    <td>
                      <span className={`status-badge ${item.estado === 'Activo' ? 'status-activo' : 'status-inactivo'}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td>
                      <div className="crud-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.PacienteID)}>Eliminar</button>
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
                <input type="text" value={formData.NumDoc} onChange={e => setFormData({...formData, NumDoc: e.target.value})} required maxLength={8} />
              </div>
              <div className="form-group">
                <label>Nombres</label>
                <input type="text" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} required maxLength={50} />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input type="text" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} required maxLength={75} />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} maxLength={15} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} maxLength={150} />
              </div>
              <div className="form-group">
                <label>Tipo de Seguro</label>
                <select value={formData.tipo_seguro} onChange={e => setFormData({...formData, tipo_seguro: e.target.value})} required>
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
