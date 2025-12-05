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
    nro_documento: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    nacionalidad: 'Peruana',
    direccion: '',
    telefono: '',
    email: '',
    tipo_sangre: '',
    tiene_sis: true,
    is_active: true
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
    setFormData({ nro_documento: '', nombres: '', apellidos: '', fecha_nacimiento: '', nacionalidad: 'Peruana', direccion: '', telefono: '', email: '', tipo_sangre: '', tiene_sis: true, is_active: true });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nro_documento: item.nro_documento || '',
      nombres: item.nombres || '',
      apellidos: item.apellidos || '',
      fecha_nacimiento: item.fecha_nacimiento ? item.fecha_nacimiento.split('T')[0] : '',
      nacionalidad: item.nacionalidad || 'Peruana',
      direccion: item.direccion || '',
      telefono: item.telefono || '',
      email: item.email || '',
      tipo_sangre: item.tipo_sangre || '',
      tiene_sis: item.tiene_sis ?? true,
      is_active: item.is_active ?? true
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
    String(p.nro_documento)?.includes(searchTerm)
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
                  <th>Tiene SIS</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.PacienteID}>
                    <td>{item.nro_documento}</td>
                    <td>{item.nombres} {item.apellidos}</td>
                    <td>{calcularEdad(item.fecha_nacimiento)} años</td>
                    <td>{item.telefono || '-'}</td>
                    <td>{item.tiene_sis ? 'Sí' : 'No'}</td>
                    <td>
                      <span className={`status-badge ${item.is_active ? 'status-activo' : 'status-inactivo'}`}>
                        {item.is_active ? 'Activo' : 'Inactivo'}
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
                <label>Nro. Documento (DNI)</label>
                <input type="number" value={formData.nro_documento} onChange={e => setFormData({...formData, nro_documento: parseInt(e.target.value) || ''})} required />
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
                <input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nacionalidad</label>
                <input type="text" value={formData.nacionalidad} onChange={e => setFormData({...formData, nacionalidad: e.target.value})} maxLength={50} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} maxLength={50} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="number" value={formData.telefono} onChange={e => setFormData({...formData, telefono: parseInt(e.target.value) || ''})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} maxLength={50} />
              </div>
              <div className="form-group">
                <label>Tipo de Sangre</label>
                <select value={formData.tipo_sangre} onChange={e => setFormData({...formData, tipo_sangre: e.target.value})}>
                  <option value="">Seleccione...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>¿Tiene SIS?</label>
                <select value={formData.tiene_sis ? 'true' : 'false'} onChange={e => setFormData({...formData, tiene_sis: e.target.value === 'true'})}>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={formData.is_active ? 'true' : 'false'} onChange={e => setFormData({...formData, is_active: e.target.value === 'true'})}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
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
