import './App.css'
import { useState } from 'react'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'
import Contatos from './componentes/Contatos.jsx'

export default function App() {
  const [view, setView] = useState('login')

  if (view === 'login') {
    return <Login onGuestAccess={() => setView('home')} />
  }

  if (view === 'contatos') {
    return <Contatos onHomeClick={() => setView('home')} onLoginClick={() => setView('login')} />
  }

  return <Home onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} onContactClick={() => setView('contatos')} />
}
