import { useState } from 'react'
import logo from '../assets/WhatsApp Image 2026-06-23 at 7.39.28 PM.png'

const slides = [
  { bg: 'linear-gradient(180deg,#dff3df,#bfe6c1)', alt: 'Verde claro' },
  { bg: 'linear-gradient(180deg,#9fb897,#6f9f6a)', alt: 'Verde médio' },
  { bg: 'linear-gradient(180deg,#21401b,#2f5a30)', alt: 'Verde escuro' },
]

function Home({ onLoginClick, onHomeClick }) {
  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)
  const go = (i) => setIndex(i)

  return (
    <main className="mockup-page">
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
            <label className="visually-hidden" htmlFor="site-search">Pesquisar serviços</label>
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

          <button className="header-login" onClick={() => onLoginClick && onLoginClick()} aria-label="Entrar">
            Entrar
          </button>

          <div className="top-dots" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </header>

        <div className="carousel-area">
          <div className="carousel-card" aria-live="polite">
            <div className="carousel-image" style={{ background: slides[index].bg }} role="img" aria-label={slides[index].alt} />

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

        <footer className="wave-footer">
          <div className="footer-content">
            <div className="footer-left">
              <h3 className="footer-title">Casa em Dia</h3>
              <p className="footer-sub">Limpeza profissional, confiança e cuidado para o seu lar.</p>
            </div>

            <nav className="footer-links" aria-label="Links de rodapé">
              <a href="#servicos">Serviços</a>
              <a href="#planos">Planos</a>
              <a href="#contato">Contato</a>
            </nav>
          </div>

          <div className="wave-wrapper">
            <div className="wave wave-back" />
            <div className="wave wave-front" />
            <div className="wave-text">Quer saber como a Casa em Dia opera?</div>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default Home
