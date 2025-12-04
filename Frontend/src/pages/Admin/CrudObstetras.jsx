import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudObstetras = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [obstetras, setObstetras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    NumDoc: '',
    nro_colegiatura: '',
    nombres: '',
    apellidos: '',
    titulo_profesional: '',
    num_telefono: '',
    fecha_nacimiento: ''
  });

  // Cargar obstetras desde la API
  const fetchObstetras = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/obstetras`);
      if (!response.ok) throw new Error('Error al cargar obstetras');
      const data = await response.json();
      setObstetras(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObstetras();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      NumDoc: '',
      nro_colegiatura: '',
      nombres: '',
      apellidos: '',
      titulo_profesional: '',
      num_telefono: '',
      fecha_nacimiento: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      NumDoc: item.NumDoc?.toString() || '',
      nro_colegiatura: item.nro_colegiatura?.toString() || '',
      nombres: item.nombres || '',
      apellidos: item.apellidos || '',
      titulo_profesional: item.titulo_profesional || '',
      num_telefono: item.num_telefono?.toString() || '',
      fecha_nacimiento: item.fecha_nacimiento ? item.fecha_nacimiento.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar este obstetra?')) {
      try {
        const response = await fetch(`${API_URL}/obstetras/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar');
        }
        await fetchObstetras();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        NumDoc: parseInt(formData.NumDoc),
        nro_colegiatura: parseInt(formData.nro_colegiatura),
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        titulo_profesional: formData.titulo_profesional,
        num_telefono: formData.num_telefono ? parseInt(formData.num_telefono) : null,
        fecha_nacimiento: formData.fecha_nacimiento
      };

      let response;
      if (editingItem) {
        response = await fetch(`${API_URL}/obstetras/${editingItem.ObstetraID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/obstetras`, {
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
      await fetchObstetras();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`${API_URL}/obstetras/search/${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setObstetras(data);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    } else {
      fetchObstetras();
    }
  };

  const filteredData = obstetras.filter(o => 
    o.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.NumDoc?.toString().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  };

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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>Buscar</button>
        </div>

        {error && <div className="error-message">Error: {error}</div>}

        <div className="crud-table-container">
          {loading ? (
            <div className="loading-state">
              <p>Cargando obstetras...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre Completo</th>
                  <th>N° Colegiatura</th>
                  <th>Título Profesional</th>
                  <th>Teléfono</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.ObstetraID}>
                    <td>{item.NumDoc}</td>
                    <td>{item.nombres} {item.apellidos}</td>
                    <td>{item.nro_colegiatura}</td>
                    <td>{item.titulo_profesional}</td>
                    <td>{item.num_telefono || '-'}</td>
                    <td>
                      {item.tiene_usuario ? (
                        <span className="status-badge status-activo" title={`Email: ${item.usuario_email}`}>
                          🔗 {item.username}
                        </span>
                      ) : (
                        <span className="status-badge status-inactivo">Sin usuario</span>
                      )}
                    </td>
                    <td>
                      <div className="crud-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        {!item.tiene_usuario && (
                          <button className="btn-delete" onClick={() => handleDelete(item.ObstetraID)}>Eliminar</button>
                        )}
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
                <label>N° Documento (DNI)</label>
                <input 
                  type="number" 
                  value={formData.NumDoc} 
                  onChange={e => setFormData({...formData, NumDoc: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>N° Colegiatura</label>
                <input 
                  type="number" 
                  value={formData.nro_colegiatura} 
                  onChange={e => setFormData({...formData, nro_colegiatura: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Nombres</label>
                <input 
                  type="text" 
                  value={formData.nombres} 
                  onChange={e => setFormData({...formData, nombres: e.target.value})} 
                  required 
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input 
                  type="text" 
                  value={formData.apellidos} 
                  onChange={e => setFormData({...formData, apellidos: e.target.value})} 
                  required 
                  maxLength={75}
                />
              </div>
              <div className="form-group">
                <label>Título Profesional</label>
                <select 
                  value={formData.titulo_profesional} 
                  onChange={e => setFormData({...formData, titulo_profesional: e.target.value})} 
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Licenciada en Obstetricia">Licenciada en Obstetricia</option>
                  <option value="Licenciado en Obstetricia">Licenciado en Obstetricia</option>
                  <option value="Magister en Obstetricia">Magister en Obstetricia</option>
                  <option value="Especialista en Alto Riesgo Obstétrico">Especialista en Alto Riesgo Obstétrico</option>
                  <option value="Especialista en Salud Reproductiva">Especialista en Salud Reproductiva</option>
                </select>
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="number" 
                  value={formData.num_telefono} 
                  onChange={e => setFormData({...formData, num_telefono: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  value={formData.fecha_nacimiento} 
                  onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} 
                  required 
                />
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
