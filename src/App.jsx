import './App.css'
import { useState } from 'react'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'

export default function App() {
  const [view, setView] = useState('login')

  if (view === 'login') {
    return <Login onGuestAccess={() => setView('home')} />
  }

  return <Home onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />
}
