import { useState } from 'react'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'
import configIcon from '../assets/configs.png'
import profileIcon from '../assets/perfil.png'
import plansIcon from '../assets/planos.png'
import slideGarden from '../assets/primeira imagem carrosel.png'
import slideRepair from '../assets/Segunda imagem carrosel.png'
import slideCleaning from '../assets/terceira imagem carrosel.png'

const slides = [
  { image: slideGarden, alt: 'Jardinagem' },
  { image: slideRepair, alt: 'Reparo elétrico' },
  { image: slideCleaning, alt: 'Limpeza' },
]

function Home({ onLoginClick, onHomeClick, onContactClick, onPlanosClick, onServicosClick, onServicePageClick }) {
  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)
  const go = (i) => setIndex(i)

  return (
    <main className="mockup-page">
      <aside className="sidebar" role="complementary" aria-label="Menu lateral">
        <nav className="sidebar-nav" aria-label="Navegação principal">
          <h3 className="sidebar-title">Casa em Dia</h3>
          <ul className="sidebar-menu">
            <li><a href="#servicos" className="sidebar-link">Serviços</a></li>
            <li>
              <button onClick={() => onPlanosClick && onPlanosClick()} className="sidebar-link" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit'}}>Planos</button>
            </li>
            <li>
              <button onClick={() => onServicosClick && onServicosClick()} className="sidebar-link" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit'}}>Serviços completos</button>
            </li>
            <li><a href="#sobre" className="sidebar-link">Sobre Nós</a></li>
            <li><button onClick={() => onContactClick && onContactClick()} className="sidebar-link" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit'}}>Contato</button></li>
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

      <section className="mockup-card" role="region" aria-label="Casa em Dia - Apresentação">
        <header className="mockup-header">
          <button className="site-logo-button" onClick={() => (onHomeClick ? onHomeClick() : window.location.href = '/')} aria-label="Ir para página inicial">
            <img src={logo} alt="Casa em Dia" className="site-logo" />
          </button>
          <form className="search-box" role="search" aria-label="Pesquisar" onSubmit={(e) => e.preventDefault()}>
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M21 21l-4.35-4.35" stroke="#21401b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="#21401b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <label className="visually-hidden" htmlFor="site-search">Pesquisar</label>
            <input
              id="site-search"
              className="search-input"
              type="search"
              placeholder="Buscar serviços, planos ou contatos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="search-clear" aria-label="Limpar pesquisa" onClick={() => setQuery('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#21401b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </form>

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

        <div className="carousel-wrapper">
          <div className="carousel-area">
            <div className="carousel-card" aria-live="polite">
              <img key={slides[index].image} src={slides[index].image} alt={slides[index].alt} className="carousel-image" />

              <button onClick={prev} className="carousel-arrow left" aria-label="Anterior">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button onClick={next} className="carousel-arrow right" aria-label="Próximo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#21401b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="carousel-indicators" role="tablist" aria-label="Indicadores do carrossel">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    className={`indicator ${i === index ? 'active' : ''}`}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="carousel-info-panel">
            <div className="carousel-info">
              <p className="carousel-info-text">
                <strong>Se você não conhece nossos serviços, venha conhecer agora! Somos a empresa de limpeza básica e de serviços domésticos mais completa da região sul. Contamos com serviços e planos de assinatura de diversos níveis, desde limpezas básicas até limpezas completas, além de organização e muito mais.</strong>
              </p>
            </div>

            <div className="services-card" aria-label="Tipos de serviço">
              <h3 className="services-title">Tipos de serviço</h3>
              <div className="services-list" role="list">
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-residencial')}>
                  <span>Limpeza residencial</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('limpeza-pos-obra')}>
                  <span>Limpeza pós-obra</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('organizacao-de-ambientes')}>
                  <span>Organização de ambientes</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('jardinagem')}>
                  <span>Jardinagem</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('assistencia-domestica')}>
                  <span>Assistência doméstica</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
                <button type="button" className="service-item" onClick={() => onServicePageClick && onServicePageClick('faxina')}>
                  <span>Faxina</span>
                  <span className="service-arrow" aria-hidden="true">›</span>
                </button>
              </div>
              <button type="button" className="service-page-button" onClick={() => onServicosClick && onServicosClick()}>
                Ver todos os serviços de limpeza geral
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
