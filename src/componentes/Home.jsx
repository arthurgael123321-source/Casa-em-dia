import { useState } from 'react'

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200',
    alt: 'Profissional com equipamentos de limpeza',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607689484-7e8b6d9f9c9b?auto=format&fit=crop&q=80&w=1200',
    alt: 'Equipe feliz após limpeza',
  },
  {
    src: 'https://images.unsplash.com/photo-1581574203058-0a7f1b4d5c6e?auto=format&fit=crop&q=80&w=1200',
    alt: 'Casa organizada e limpa',
  },
]

function Home() {
  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)
  const go = (i) => setIndex(i)

  return (
    <main className="mockup-page">
      <section className="mockup-card" role="region" aria-label="Casa em Dia - Apresentação">
        <header className="mockup-header">
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

          <div className="top-dots" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </header>

        <div className="carousel-area">
          <div className="carousel-card" aria-live="polite">
            <img className="carousel-image" src={slides[index].src} alt={slides[index].alt} />

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
