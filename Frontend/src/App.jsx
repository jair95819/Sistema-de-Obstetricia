
import { useState, useEffect } from 'react'
import Login from './pages/Login/Login'
import IdentityValidation from './pages/Login/IdentityValidation'
import Dashboard from './pages/Home/Dashboard'
import Profile from './pages/Profile/Profile'
import HealthCenter from './pages/HealthCenter'
import Settings from './pages/Settings/Settings'
import Metas from './pages/Metas/Metas'
import Atenciones from './pages/Atenciones/Atenciones'
import RegistrarAtenciones from './pages/Atenciones/RegistrarAtenciones'
import VisualizarAtenciones from './pages/Atenciones/VisualizarAtenciones'
import RegistroReprogramacion from './pages/Atenciones/RegistroReprogramacion'
import GenerarReferencia from './pages/Atenciones/GenerarReferencia'
import AdminDashboard from './pages/Admin/AdminDashboard'
import CrudObstetras from './pages/Admin/CrudObstetras'
import CrudPacientes from './pages/Admin/CrudPacientes'
import CrudMetas from './pages/Admin/CrudMetas'
import CrudProgramaAtencion from './pages/Admin/CrudProgramaAtencion'
import CrudUsuarios from './pages/Admin/CrudUsuarios'
import './App.css'
import PasswordChange from './pages/Login/PasswordChange'

function App() {
  const [history, setHistory] = useState(['login'])
  const [loading, setLoading] = useState(true)
  const currentPage = history[history.length - 1]

  // Verificar sesión al cargar la app
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Sesión válida, ir al dashboard
          setHistory(['dashboard']);
        } else {
          // Token inválido, limpiar y quedarse en login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Navega a una nueva página (adelante)
  const handleNavigate = (page) => {
    setHistory(prev => [...prev, page])
  }

  // Vuelve a la página anterior (atrás)
  const handleBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1))
    }
  }

  // Vuelve a la página inicial (logout)
  const handleHome = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHistory(['login']);
  }

  // Mostrar loading mientras verifica sesión
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(180deg, #E8F4FD 0%, #D1E8F8 100%)'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'login' && (
        <Login 
          onLogin={() => handleNavigate('validation')}
          onPasswordChange={() => handleNavigate('password-change')}
        />
      )}
      {currentPage === 'password-change' && (
        <PasswordChange onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'validation' && (
        <IdentityValidation 
          onBack={handleBack}
          onNext={() => handleNavigate('dashboard')}
          onHome={handleHome}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'profile' && (
        <Profile onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'health-center' && (
        <HealthCenter onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'config' && (
        <Settings onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'metas' && (
        <Metas onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'atenciones' && (
        <Atenciones onNavigate={handleNavigate} onBack={handleBack} onHome={handleHome} />
      )}
      {currentPage === 'registrar-atenciones' && (
        <RegistrarAtenciones onNavigate={handleNavigate} onBack={handleBack} onNext={() => handleNavigate('detalle-atencion')} />
      )}
      {currentPage === 'visualizar-atenciones' && (
        <VisualizarAtenciones onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'registro-reprogramacion' && (
        <RegistroReprogramacion onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'generar-referencia' && (
        <GenerarReferencia onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'admin-dashboard' && (
        <AdminDashboard onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'crud-obstetras' && (
        <CrudObstetras onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'crud-pacientes' && (
        <CrudPacientes onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'crud-metas' && (
        <CrudMetas onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'crud-programas' && (
        <CrudProgramaAtencion onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentPage === 'crud-usuarios' && (
        <CrudUsuarios onNavigate={handleNavigate} onBack={handleBack} />
      )}
    </>
  )
}

export default App
