import './App.css'
import { useState } from 'react'
import { isAuthenticated } from './services/authUtils.js'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'
import Contatos from './componentes/Contatos.jsx'
import { Planos } from './componentes/Planos.jsx'
import Servicos from './componentes/Serviços.jsx'
import ServicoDetalhe from './componentes/ServicoDetalhe.jsx'

const serviceViews = [
  'limpeza-residencial',
  'limpeza-pos-obra',
  'organizacao-de-ambientes',
  'jardinagem',
  'assistencia-domestica',
  'faxina',
]

export default function App() {
  const [view, setView] = useState(() => (isAuthenticated() ? 'home' : 'login'))

  if (view === 'login') {
    return <Login onLoginSuccess={() => setView('home')} />
  }

  if (view === 'contatos') {
    return <Contatos onHomeClick={() => setView('home')} onLoginClick={() => setView('login')} />
  }

  if (view === 'servicos') {
    return (
      <Servicos
        onHomeClick={() => setView('home')}
        onContactClick={() => setView('contatos')}
        onPlanosClick={() => setView('planos')}
        onLoginClick={() => setView('login')}
        onServicePageClick={(slug) => setView(slug)}
      />
    )
  }

  if (serviceViews.includes(view)) {
    return (
      <ServicoDetalhe
        serviceSlug={view}
        onHomeClick={() => setView('home')}
        onContactClick={() => setView('contatos')}
        onPlanosClick={() => setView('planos')}
        onLoginClick={() => setView('login')}
        onServicosClick={() => setView('servicos')}
      />
    )
  }

  if (view === 'planos') {
    // CORRIGIDO AQUI: Agora ele sabe que clicar em voltar deve mudar o estado para 'home'
    return <Planos onHomeClick={() => setView('home')} />
  }

  return (
    <Home
      onLoginClick={() => setView('login')}
      onHomeClick={() => setView('home')}
      onContactClick={() => setView('contatos')}
      onPlanosClick={() => setView('planos')}
      onServicosClick={() => setView('servicos')}
      onServicePageClick={(slug) => setView(slug)}
    />
  )
}