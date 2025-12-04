import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AdminCrud.css';

const API_URL = 'http://localhost:4000/api';

const CrudUsuarios = ({ onNavigate, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    NumDoc: '',
    RolID: '',
    username: '',
    password: '',
    email: '',
    is_active: 1,
    // Datos adicionales para obstetra
    nro_colegiatura: '',
    nombres: '',
    apellidos: '',
    titulo_profesional: 'Licenciada en Obstetricia',
    num_telefono: '',
    fecha_nacimiento: ''
  });

  // Cargar usuarios y roles
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`);
      if (!response.ok) throw new Error('Error al cargar roles');
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  // Verificar si el rol seleccionado es Obstetra
  const isRolObstetra = () => {
    const selectedRol = roles.find(r => r.RolID === parseInt(formData.RolID));
    return selectedRol && selectedRol.nombre_rol && selectedRol.nombre_rol.toLowerCase().includes('obstetra');
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      NumDoc: '',
      RolID: roles.length > 0 ? roles[0].RolID : '',
      username: '',
      password: '',
      email: '',
      is_active: 1,
      nro_colegiatura: '',
      nombres: '',
      apellidos: '',
      titulo_profesional: 'Licenciada en Obstetricia',
      num_telefono: '',
      fecha_nacimiento: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      NumDoc: item.NumDoc?.toString() || '',
      RolID: item.RolID || '',
      username: item.username || '',
      password: '',
      email: item.email || '',
      is_active: item.is_active ? 1 : 0,
      nro_colegiatura: '',
      nombres: '',
      apellidos: '',
      titulo_profesional: 'Licenciada en Obstetricia',
      num_telefono: '',
      fecha_nacimiento: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar');
        }
        await fetchUsuarios();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/toggle-status`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cambiar estado');
      }
      await fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        NumDoc: formData.NumDoc || null,
        RolID: parseInt(formData.RolID),
        username: formData.username,
        email: formData.email,
        is_active: formData.is_active
      };

      // Solo incluir password si se proporcionó
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      // Si es obstetra, incluir datos adicionales
      if (isRolObstetra()) {
        payload.datosObstetra = {
          nro_colegiatura: formData.nro_colegiatura ? parseInt(formData.nro_colegiatura) : null,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          titulo_profesional: formData.titulo_profesional,
          num_telefono: formData.num_telefono ? parseInt(formData.num_telefono) : null,
          fecha_nacimiento: formData.fecha_nacimiento || null
        };
      }

      let response;
      if (editingItem) {
        response = await fetch(`${API_URL}/usuarios/${editingItem.UsuarioID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/usuarios`, {
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
      await fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`${API_URL}/usuarios/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    } else {
      fetchUsuarios();
    }
  };

  const filteredData = usuarios.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.NumDoc?.toString().includes(searchTerm) ||
    u.nombre_rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
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
          <h2 className="crud-title">👤 Gestión de Usuarios</h2>
          <button className="btn-add" onClick={handleAdd}>+ Agregar Usuario</button>
        </div>

        <div className="crud-search-bar">
          <input
            type="text"
            className="crud-search-input"
            placeholder="Buscar por username, email, documento o rol..."
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
              <p>Cargando usuarios...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <table className="crud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>N° Documento</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>F. Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.UsuarioID}>
                    <td>{item.UsuarioID}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.NumDoc || '-'}</td>
                    <td>
                      <span className={`tipo-badge ${item.nombre_rol?.toLowerCase().includes('admin') ? 'tipo-preventivo' : item.nombre_rol?.toLowerCase().includes('obstetra') ? 'tipo-recuperativo' : ''}`}>
                        {item.nombre_rol || 'Sin rol'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.is_active ? 'status-activo' : 'status-inactivo'}`}>
                        {item.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{formatDate(item.fecha_creacion)}</td>
                    <td>
                      <div className="crud-actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleToggleStatus(item.UsuarioID)}
                          title={item.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {item.is_active ? '🔒' : '🔓'}
                        </button>
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.UsuarioID)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    required
                    placeholder="Nombre de usuario"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{editingItem ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required={!editingItem}
                    placeholder={editingItem ? 'Dejar vacío para no cambiar' : 'Contraseña segura'}
                  />
                </div>
                <div className="form-group">
                  <label>N° Documento (DNI)</label>
                  <input
                    type="text"
                    value={formData.NumDoc}
                    onChange={e => setFormData({ ...formData, NumDoc: e.target.value })}
                    placeholder="Número de documento"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    value={formData.RolID}
                    onChange={e => setFormData({ ...formData, RolID: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un rol...</option>
                    {roles.map(rol => (
                      <option key={rol.RolID} value={rol.RolID}>
                        {rol.nombre_rol}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Campos adicionales para Obstetra */}
              {isRolObstetra() && !editingItem && (
                <>
                  <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
                  <h4 style={{ color: '#2c5282', marginBottom: '15px' }}>📋 Datos de Obstetra</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombres *</label>
                      <input
                        type="text"
                        value={formData.nombres}
                        onChange={e => setFormData({ ...formData, nombres: e.target.value })}
                        required={isRolObstetra()}
                        placeholder="Nombres completos"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellidos *</label>
                      <input
                        type="text"
                        value={formData.apellidos}
                        onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                        required={isRolObstetra()}
                        placeholder="Apellidos completos"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>N° Colegiatura</label>
                      <input
                        type="number"
                        value={formData.nro_colegiatura}
                        onChange={e => setFormData({ ...formData, nro_colegiatura: e.target.value })}
                        placeholder="Número de colegiatura"
                      />
                    </div>
                    <div className="form-group">
                      <label>Título Profesional</label>
                      <select
                        value={formData.titulo_profesional}
                        onChange={e => setFormData({ ...formData, titulo_profesional: e.target.value })}
                      >
                        <option value="Licenciada en Obstetricia">Licenciada en Obstetricia</option>
                        <option value="Licenciado en Obstetricia">Licenciado en Obstetricia</option>
                        <option value="Magister en Obstetricia">Magister en Obstetricia</option>
                        <option value="Especialista en Alto Riesgo Obstétrico">Especialista en Alto Riesgo Obstétrico</option>
                        <option value="Especialista en Salud Reproductiva">Especialista en Salud Reproductiva</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="number"
                        value={formData.num_telefono}
                        onChange={e => setFormData({ ...formData, num_telefono: e.target.value })}
                        placeholder="Número de teléfono"
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={e => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

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

export default CrudUsuarios;
