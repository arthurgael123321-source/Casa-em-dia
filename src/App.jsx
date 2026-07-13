import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { isAuthenticated, logout } from './services/authUtils.js'
import Home from './componentes/Home.jsx'
import Login from './componentes/Login.jsx'
import Contatos from './componentes/Contatos.jsx'
import { Planos } from './componentes/Planos.jsx'
import Servicos from './componentes/Serviços.jsx'
import ServicoDetalhe from './componentes/ServicoDetalhe.jsx'
import services from './componentes/servicosData.js'
import Perfil from './componentes/Perfil.jsx'
import Configuracoes from './componentes/Configuracoes.jsx'
import Agendamento from './componentes/Agendamento.jsx'
import logo from './assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import configIcon from './assets/configs.png'
import profileIcon from './assets/perfil.png'
import plansIcon from './assets/planos.png'

const serviceViews = services.map((service) => service.slug)

const appViews = ['login', 'home', 'contatos', 'servicos', 'planos', 'perfil', 'configuracoes', 'agendamento', ...serviceViews]

const getViewFromHash = () => {
  const hashView = window.location.hash.replace('#', '')

  if (appViews.includes(hashView)) {
    return hashView
  }

  return isAuthenticated() ? 'servicos' : 'login'
}

function AppShell({ currentView, onNavigate, children }) {
  const isServiceView = currentView === 'servicos' || serviceViews.includes(currentView)

  return (
    <main className="mockup-page">
      <aside className="sidebar" role="complementary" aria-label="Menu lateral">
        <button className="site-logo-button sidebar-logo-button" onClick={() => onNavigate('home')} aria-label="Ir para a página inicial">
          <img src={logo} alt="Casa em Dia" className="sidebar-logo" />
        </button>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <ul className="sidebar-menu">
            <li><button onClick={() => onNavigate('servicos')} className={`home-sidebar-btn ${isServiceView ? 'active' : ''}`}>Serviços</button></li>
            <li><button onClick={() => onNavigate('planos')} className={`home-sidebar-btn ${currentView === 'planos' ? 'active' : ''}`}>Planos</button></li>
            <li><button onClick={() => onNavigate('agendamento')} className={`home-sidebar-btn ${currentView === 'agendamento' ? 'active' : ''}`}>Agendamento</button></li>
            <li><button onClick={() => onNavigate('contatos')} className={`home-sidebar-btn ${currentView === 'contatos' ? 'active' : ''}`}>Contato</button></li>
          </ul>
        </nav>

        <div className="sidebar-contact">
          <h4 className="sidebar-subtitle">Fale Conosco</h4>
          <a href="tel:+551190028922" className="sidebar-contact-link">(11) 9002-8922</a>
          <a href="mailto:contato@casaemdia.com" className="sidebar-contact-link">contato@casaemdia.com</a>
        </div>

        <button className="sidebar-cta" onClick={() => onNavigate('agendamento')}>Agende Agora</button>
      </aside>

      <section className="mockup-card" role="main" aria-label="Conteúdo principal">
        <header className="mockup-header">
          <button className="site-logo-button" onClick={() => onNavigate('home')} aria-label="Ir para página inicial">
            <img src={logo} alt="Casa em Dia" className="site-logo" />
          </button>
          <div className="top-actions" aria-label="Ações rápidas">
            <button type="button" className="top-action-button" aria-label="Configurações" onClick={() => onNavigate('configuracoes')}>
              <img src={configIcon} alt="Configurações" />
            </button>
            <button type="button" className="top-action-button" aria-label="Perfil" onClick={() => onNavigate('perfil')}>
              <img src={profileIcon} alt="Perfil" />
            </button>
            <button type="button" className="top-action-button" aria-label="Planos" onClick={() => onNavigate('planos')}>
              <img src={plansIcon} alt="Planos" />
            </button>
          </div>
        </header>

        <div className="app-content-shell">{children}</div>
      </section>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState(getViewFromHash)

  useEffect(() => {
    window.history.replaceState({ view }, '', `#${view}`)
  }, [view])

  useEffect(() => {
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
    return <Login onLoginSuccess={() => navigate('servicos')} />
  }

  if (view === 'contatos') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Contatos onHomeClick={() => navigate('home')} />
      </AppShell>
    )
  }

  if (view === 'agendamento') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Agendamento />
      </AppShell>
    )
  }

  if (view === 'servicos') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Servicos
          onContactClick={() => navigate('contatos')}
          onPlanosClick={() => navigate('planos')}
          onServicePageClick={(slug) => navigate(slug)}
        />
      </AppShell>
    )
  }

  if (serviceViews.includes(view)) {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <ServicoDetalhe
          serviceSlug={view}
          onScheduleClick={() => navigate('agendamento')}
          onServicosClick={() => navigate('servicos')}
        />
      </AppShell>
    )
  }

  if (view === 'planos') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Planos onHomeClick={() => navigate('home')} />
      </AppShell>
    )
  }

  if (view === 'perfil') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Perfil
          onLoginClick={() => {
            logout()
            navigate('login')
          }}
        />
      </AppShell>
    )
  }

  if (view === 'configuracoes') {
    return (
      <AppShell currentView={view} onNavigate={navigate}>
        <Configuracoes
          onHomeClick={() => navigate('home')}
          onLoginClick={() => {
            logout()
            navigate('login')
          }}
        />
      </AppShell>
    )
  }

  return (
    <AppShell currentView={view} onNavigate={navigate}>
      <Home
        onServicosClick={() => navigate('servicos')}
        onServicePageClick={(slug) => navigate(slug)}
      />
    </AppShell>
  )
}
