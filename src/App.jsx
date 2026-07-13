import './App.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isAuthenticated, logout } from './services/authUtils.js'
import { useLanguage } from './i18n/languageStore.js'
import Home from './componentes/Home.jsx'
import Contatos from './componentes/Contatos.jsx'
import { Planos } from './componentes/Planos.jsx'
import Servicos from './componentes/Serviços.jsx'
import ServicoDetalhe from './componentes/ServicoDetalhe.jsx'
import services from './componentes/servicosData.js'
import Perfil from './componentes/Perfil.jsx'
import Configuracoes from './componentes/Configuracoes.jsx'
import Agendamento from './componentes/Agendamento.jsx'
import AuthGate from './componentes/AuthGate.jsx'
import logo from './assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import topbarLogo from './assets/LogoCasa_em_dia.png'
import configIcon from './assets/configs.png'
import profileIcon from './assets/perfil.png'
import plansIcon from './assets/planos.png'

const serviceViews = services.map((service) => service.slug)

const appViews = ['home', 'contatos', 'servicos', 'planos', 'perfil', 'configuracoes', 'agendamento', ...serviceViews]

const protectedViews = ['contatos', 'agendamento', 'perfil', 'configuracoes']

const getViewFromHash = () => {
  const hashView = window.location.hash.replace('#', '')

  if (appViews.includes(hashView)) {
    return hashView
  }

  return 'servicos'
}

function AppShell({ currentView, onNavigate, children }) {
  const { t } = useLanguage()
  const isServiceView = currentView === 'servicos' || serviceViews.includes(currentView)
  const contentRef = useRef(null)

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [currentView])

  return (
    <main className="mockup-page">
      <aside className="sidebar" role="complementary" aria-label="Menu lateral">
        <button className="site-logo-button sidebar-logo-button" onClick={() => onNavigate('home')} aria-label={t('nav.irHome')}>
          <img src={logo} alt="Casa em Dia" className="sidebar-logo" />
        </button>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <ul className="sidebar-menu">
            <li><button onClick={() => onNavigate('servicos')} className={`home-sidebar-btn ${isServiceView ? 'active' : ''}`}>{t('nav.servicos')}</button></li>
            <li><button onClick={() => onNavigate('planos')} className={`home-sidebar-btn ${currentView === 'planos' ? 'active' : ''}`}>{t('nav.planos')}</button></li>
            <li><button onClick={() => onNavigate('agendamento')} className={`home-sidebar-btn ${currentView === 'agendamento' ? 'active' : ''}`}>{t('nav.agendamento')}</button></li>
            <li><button onClick={() => onNavigate('contatos')} className={`home-sidebar-btn ${currentView === 'contatos' ? 'active' : ''}`}>{t('nav.contato')}</button></li>
          </ul>
        </nav>

        <div className="sidebar-contact">
          <h4 className="sidebar-subtitle">{t('nav.faleConosco')}</h4>
          <a href="tel:+551190028922" className="sidebar-contact-link">(11) 9002-8922</a>
          <a href="mailto:contato@casaemdia.com" className="sidebar-contact-link">contato@casaemdia.com</a>
        </div>

        <button className="sidebar-cta" onClick={() => onNavigate('agendamento')}>{t('nav.agendeAgora')}</button>
      </aside>

      <section className="mockup-card" role="main" aria-label="Conteúdo principal">
        <header className="mockup-header">
          <button className="site-logo-button" onClick={() => onNavigate('home')} aria-label={t('nav.irHomeTop')}>
            <img src={topbarLogo} alt="Casa em Dia" className="site-logo" />
          </button>
          <div className="top-actions" aria-label="Ações rápidas">
            <button type="button" className="top-action-button" aria-label={t('nav.configuracoes')} onClick={() => onNavigate('configuracoes')}>
              <img src={configIcon} alt={t('nav.configuracoes')} />
            </button>
            <button type="button" className="top-action-button" aria-label={t('nav.perfil')} onClick={() => onNavigate('perfil')}>
              <img src={profileIcon} alt={t('nav.perfil')} />
            </button>
            <button type="button" className="top-action-button" aria-label={t('nav.planos')} onClick={() => onNavigate('planos')}>
              <img src={plansIcon} alt={t('nav.planos')} />
            </button>
          </div>
        </header>

        <div className="app-content-shell" ref={contentRef}>{children}</div>
      </section>
    </main>
  )
}

const resolveView = (candidateView) => {
  if (protectedViews.includes(candidateView) && !isAuthenticated()) {
    return 'servicos'
  }

  return candidateView
}

export default function App() {
  const { t } = useLanguage()
  const [view, setView] = useState(() => resolveView(getViewFromHash()))

  const goToView = useCallback((nextView) => {
    window.history.pushState({ view: nextView }, '', `#${nextView}`)
    setView(nextView)
  }, [])

  const [authGateRequest, setAuthGateRequest] = useState(() => {
    const initialView = getViewFromHash()

    if (protectedViews.includes(initialView) && !isAuthenticated()) {
      return { message: t(`authGate.${initialView}`), onSuccess: () => goToView(initialView) }
    }

    return null
  })

  const requireAuth = useCallback((message, onSuccess) => {
    setAuthGateRequest({ message, onSuccess })
  }, [])

  useEffect(() => {
    window.history.replaceState({ view }, '', `#${view}`)
  }, [view])

  useEffect(() => {
    const handlePopState = (event) => {
      const previousView = appViews.includes(event.state?.view) ? event.state.view : getViewFromHash()

      if (protectedViews.includes(previousView) && !isAuthenticated()) {
        requireAuth(t(`authGate.${previousView}`), () => setView(previousView))
        return
      }

      setView(previousView)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [requireAuth, t])

  const navigate = useCallback((nextView) => {
    if (!appViews.includes(nextView) || nextView === view) {
      return
    }

    if (protectedViews.includes(nextView) && !isAuthenticated()) {
      requireAuth(t(`authGate.${nextView}`), () => goToView(nextView))
      return
    }

    goToView(nextView)
  }, [view, goToView, requireAuth, t])

  const closeAuthGate = useCallback(() => setAuthGateRequest(null), [])

  const handleAuthGateSuccess = useCallback(() => {
    const request = authGateRequest
    setAuthGateRequest(null)
    request?.onSuccess?.()
  }, [authGateRequest])

  const content = renderContent()

  return (
    <>
      {content}
      {authGateRequest && (
        <AuthGate
          message={authGateRequest.message}
          onClose={closeAuthGate}
          onLoginSuccess={handleAuthGateSuccess}
        />
      )}
    </>
  )

  function renderContent() {
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
          <Planos onHomeClick={() => navigate('home')} onRequireAuth={requireAuth} />
        </AppShell>
      )
    }
  
    if (view === 'perfil') {
      return (
        <AppShell currentView={view} onNavigate={navigate}>
          <Perfil
            onLoginClick={() => {
              logout()
              navigate('servicos')
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
              navigate('servicos')
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
}
