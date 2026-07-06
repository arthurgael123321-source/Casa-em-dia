import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { isAuthenticated, logout } from './services/authUtils.js'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'
import Contatos from './componentes/Contatos.jsx'
import { Planos } from './componentes/Planos.jsx'
import Servicos from './componentes/Serviços.jsx'
import ServicoDetalhe from './componentes/ServicoDetalhe.jsx'
import Perfil from './componentes/Perfil.jsx'

const serviceViews = [
  'limpeza-residencial',
  'limpeza-pos-obra',
  'organizacao-de-ambientes',
  'jardinagem',
  'assistencia-domestica',
  'faxina',
]

const appViews = ['login', 'home', 'contatos', 'servicos', 'planos', 'perfil', ...serviceViews]

const getViewFromHash = () => {
  const hashView = window.location.hash.replace('#', '')

  if (appViews.includes(hashView)) {
    return hashView
  }

  return isAuthenticated() ? 'home' : 'login'
}

export default function App() {
  const [view, setView] = useState(getViewFromHash)

  useEffect(() => {
    window.history.replaceState({ view }, '', `#${view}`)

    const handlePopState = (event) => {
      const previousView = event.state?.view

      if (appViews.includes(previousView)) {
        setView(previousView)
        return
      }

      setView(getViewFromHash())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = useCallback((nextView) => {
    if (!appViews.includes(nextView) || nextView === view) {
      return
    }

    window.history.pushState({ view: nextView }, '', `#${nextView}`)
    setView(nextView)
  }, [view])

  if (view === 'login') {
    return <Login onLoginSuccess={() => navigate('home')} />
  }

  if (view === 'contatos') {
    return <Contatos onHomeClick={() => navigate('home')} onLoginClick={() => navigate('login')} />
  }

  if (view === 'servicos') {
    return (
      <Servicos
        onHomeClick={() => navigate('home')}
        onContactClick={() => navigate('contatos')}
        onPlanosClick={() => navigate('planos')}
        onLoginClick={() => navigate('login')}
        onServicePageClick={(slug) => navigate(slug)}
      />
    )
  }

  if (serviceViews.includes(view)) {
    return (
      <ServicoDetalhe
        serviceSlug={view}
        onHomeClick={() => navigate('home')}
        onContactClick={() => navigate('contatos')}
        onPlanosClick={() => navigate('planos')}
        onLoginClick={() => navigate('login')}
        onServicosClick={() => navigate('servicos')}
      />
    )
  }

  if (view === 'planos') {
    return <Planos onHomeClick={() => navigate('home')} />
  }

  if (view === 'perfil') {
    return (
      <Perfil
        onHomeClick={() => navigate('home')}
        onLoginClick={() => {
          logout()
          navigate('login')
        }}
      />
    )
  }

  return (
    <Home
      onLoginClick={() => navigate('login')}
      onHomeClick={() => navigate('home')}
      onContactClick={() => navigate('contatos')}
      onPlanosClick={() => navigate('planos')}
      onServicosClick={() => navigate('servicos')}
      onProfileClick={() => navigate('perfil')}
      onServicePageClick={(slug) => navigate(slug)}
    />
  )
}
