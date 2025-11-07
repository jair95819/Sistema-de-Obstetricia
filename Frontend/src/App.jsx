import { useState } from 'react'
import Login from './pages/Login/Login'
import IdentityValidation from './pages/Login/IdentityValidation'
import Dashboard from './pages/Home/Dashboard'
import Profile from './pages/Profile/Profile'
import HealthCenter from './pages/HealthCenter'
import Settings from './pages/Settings/Settings'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {currentPage === 'login' && (
        <Login onLogin={() => handleNavigate('validation')} />
      )}
      {currentPage === 'validation' && (
        <IdentityValidation 
          onBack={() => handleNavigate('login')}
          onNext={() => handleNavigate('dashboard')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} />
      )}
      {currentPage === 'profile' && (
        <Profile onNavigate={handleNavigate} />
      )}
      {currentPage === 'health-center' && (
        <HealthCenter onNavigate={handleNavigate} />
      )}
      {currentPage === 'config' && (
        <Settings onNavigate={handleNavigate} />
      )}
    </>
  )
}

export default App
