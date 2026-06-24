import './App.css'
import { useState } from 'react'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'

export default function App() {
  const [view, setView] = useState('home')

  if (view === 'login') {
    return <Login onBack={() => setView('home')} />
  }

  return <Home onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />
}
