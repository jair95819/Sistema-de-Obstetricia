
import { useState } from 'react'
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
import './App.css'
import PasswordChange from './pages/Login/PasswordChange'

function App() {
  const [history, setHistory] = useState(['login'])
  const currentPage = history[history.length - 1]

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

  // Vuelve a la página inicial
  const handleHome = () => {
    setHistory(['login'])
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
    </>
  )
}

export default App
