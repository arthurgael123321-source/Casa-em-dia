import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import configIcon from '../assets/configs.png'
import profileIcon from '../assets/perfil.png'
import plansIcon from '../assets/planos.png'
import { serviceMap } from './servicosData'

function ServicoDetalhe({ serviceSlug, onHomeClick, onContactClick, onPlanosClick, onLoginClick, onServicosClick }) {
  const service = serviceMap[serviceSlug]

  if (!service) {
    return (
      <main className="mockup-page">
        <section className="mockup-card">
          <h1>Serviço não encontrado</h1>
          <p>O serviço solicitado não está disponível no momento.</p>
          <button onClick={() => onServicosClick && onServicosClick()}>Voltar para serviços</button>
        </section>
      </main>
    )
  }

  return (
    <main className="mockup-page">
      <aside className="sidebar" role="complementary" aria-label="Menu lateral">
        <nav className="sidebar-nav" aria-label="Navegação principal">
          <h3 className="sidebar-title">Casa em Dia</h3>
          <ul className="sidebar-menu">
            <li>
              <button onClick={() => onHomeClick && onHomeClick()} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
                Página Inicial
              </button>
            </li>
            <li>
              <button onClick={() => onPlanosClick && onPlanosClick()} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
                Planos
              </button>
            </li>
            <li>
              <button onClick={() => onServicosClick && onServicosClick()} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
                Todos os serviços
              </button>
            </li>
            <li>
              <button onClick={() => onContactClick && onContactClick()} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
                Contato
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-contact">
          <h4 className="sidebar-subtitle">Fale Conosco</h4>
          <a href="tel:11999999999" className="sidebar-contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#21401b" />
            </svg>
            (55) 55 4002-8922
          </a>
          <a href="mailto:contato@casaemdia.com" className="sidebar-contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#21401b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m22 6-10 7L2 6" stroke="#21401b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            contato@casaemdia.com
          </a>
        </div>

        <button className="sidebar-cta" onClick={() => onLoginClick && onLoginClick()}>
          Agende Agora
        </button>
      </aside>

      <section className="mockup-card" role="main" aria-label={`Serviço ${service.title}`}>
        <header className="mockup-header">
          <button className="site-logo-button" onClick={() => onHomeClick ? onHomeClick() : window.location.href = '/'} aria-label="Ir para página inicial">
            <img src={logo} alt="Casa em Dia" className="site-logo" />
          </button>
          <div className="header-actions">
            <button className="header-login" onClick={() => onLoginClick && onLoginClick()} aria-label="Entrar">
              Entrar
            </button>
            <button className="header-create-account" onClick={() => onLoginClick && onLoginClick()} aria-label="Criar conta">
              Criar conta
            </button>
          </div>
          <div className="top-actions" aria-label="Ações rápidas">
            <button type="button" className="top-action-button" aria-label="Configurações">
              <img src={configIcon} alt="Configurações" />
            </button>
            <button type="button" className="top-action-button" aria-label="Perfil">
              <img src={profileIcon} alt="Perfil" />
            </button>
            <button type="button" className="top-action-button" aria-label="Planos" onClick={() => onPlanosClick && onPlanosClick()}>
              <img src={plansIcon} alt="Planos" />
            </button>
          </div>
        </header>

        <div className="service-detail-page">
          <article className="service-detail-hero">
            <div className="hero-copy">
              <p className="eyebrow">Serviço personalizado</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="hero-buttons">
                <button className="hero-cta" onClick={() => onContactClick && onContactClick()}>
                  Agendar agora
                </button>
                <button className="hero-secondary" onClick={() => onServicosClick && onServicosClick()}>
                  Ver todos os serviços
                </button>
              </div>
            </div>
            <div className="hero-image service-detail-image">
              <img src={service.image} alt={service.title} />
            </div>
          </article>

          <article className="service-detail-info">
            <h2>O que está incluso</h2>
            <ul>
              {service.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  )
}

export default ServicoDetalhe
