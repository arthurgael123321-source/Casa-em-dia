import { useState } from 'react'

export function Planos({ onHomeClick }) {
  const [planoSelecionado, setPlanoSelecionado] = useState(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  const planosAssinatura = [
    {
      id: 'basico',
      nome: 'Básico',
      preco: 'Grátis',
      descricao: 'Encontre profissionais qualificados para serviços pontuais.',
      beneficios: [
        'Até 3 orçamentos por pedido',
        'Contato direto com profissionais',
        'Avaliações públicas visíveis',
      ],
      textoBotao: 'Começar Grátis',
      destaque: false,
    },
    {
      id: 'premium',
      nome: 'Premium',
      preco: 'R$ 24,99',
      periodo: '/mês',
      descricao: 'A melhor escolha para quem precisa de manutenção frequente com segurança total.',
      beneficios: [
        'Orçamentos ilimitados',
        'Garantia Casa em Dia contra danos de até R$ 5.000',
        'Atendimento e agendamento prioritários',
        'Profissionais com selo de verificação de antecedentes',
        'Desconto de 5% direto na mão de obra',
      ],
      textoBotao: 'Assinar Premium',
      destaque: true,
    },
    {
      id: 'pro',
      nome: 'Pro',
      preco: 'R$ 69,99',
      periodo: '/mês',
      descricao: 'Ideal para proprietários de imóveis, repúblicas ou gerenciamento de reformas.',
      beneficios: [
        'Tudo do plano Premium',
        'Garantia estendida contra danos de até R$ 20.000',
        'Concierge exclusivo para buscar e negociar com profissionais',
        'Pagamento centralizado via faturamento mensal',
        'Histórico detalhado com relatórios de vistorias',
      ],
      textoBotao: 'Seja Pro',
      destaque: false,
    },
  ]

  const handleCliqueAssinar = (plano) => {
    setPlanoSelecionado(plano)
    document.getElementById('area-assinatura')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleEnviarAssinatura = (e) => {
    e.preventDefault()
    alert(`Sucesso! Você assinou o plano ${planoSelecionado.nome} para o Casa em Dia.`)
  }

  return (
    <div style={styles.container}>
      <header style={styles.headerNav}>
        <button type="button" onClick={() => onHomeClick && onHomeClick()} style={styles.botaoVoltarHome}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar
        </button>
        <h1 style={styles.marcaHeader}>Casa em Dia</h1>
        <div style={{ width: '90px' }} />
      </header>

      <section style={styles.secaoIntroducao}>
        <h2 style={styles.titulo}>Planos de Assinatura</h2>
        <p style={styles.subtitulo}>
          Contrate os melhores profissionais do mercado com segurança, rapidez e garantias exclusivas.
        </p>
      </section>

      <div style={styles.gridPlanos}>
        {planosAssinatura.map((plano) => (
          <div
            key={plano.id}
            style={{
              ...styles.cardPlano,
              ...(plano.destaque ? styles.cardDestaque : {}),
              ...(planoSelecionado?.id === plano.id ? styles.cardSelecionado : {}),
            }}
          >
            {plano.destaque && <span style={styles.tagDestaque}>Mais Recomendado</span>}

            <h2 style={styles.nomePlano}>{plano.nome}</h2>
            <p style={styles.descricaoPlano}>{plano.descricao}</p>

            <div style={styles.containerPreco}>
              <span style={styles.preco}>{plano.preco}</span>
              {plano.periodo && <span style={styles.periodo}>{plano.periodo}</span>}
            </div>

            <ul style={styles.listaBeneficios}>
              {plano.beneficios.map((beneficio, idx) => (
                <li key={idx} style={styles.itemBeneficio}>
                  <span style={styles.checkIcon}>✓</span> {beneficio}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCliqueAssinar(plano)}
              style={{
                ...styles.botao,
                ...(plano.destaque ? styles.botaoDestaque : {}),
              }}
            >
              {plano.textoBotao}
            </button>
          </div>
        ))}
      </div>

      <div id="area-assinatura" style={styles.secaoAssinatura}>
        {planoSelecionado ? (
          <div style={styles.caixaFormulario}>
            <h2 style={styles.tituloForm}>
              Você escolheu o plano: <span style={styles.textoVerde}>{planoSelecionado.nome}</span>
            </h2>
            <p style={styles.subForm}>Preencha os dados abaixo para concluir sua assinatura no Casa em Dia.</p>

            <form onSubmit={handleEnviarAssinatura} style={styles.form}>
              <label style={styles.label}>Nome Completo</label>
              <input
                type="text"
                required
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>E-mail de Cadastro</label>
              <input
                type="email"
                required
                placeholder="seuemail@casaemdia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              {planoSelecionado.id !== 'basico' && (
                <>
                  <label style={styles.label}>Número do Cartão de Crédito</label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    style={styles.input}
                  />
                </>
              )}

              <button type="submit" style={styles.botaoConfirmar}>
                Finalizar Contratação ({planoSelecionado.preco})
              </button>
            </form>
          </div>
        ) : (
          <p style={styles.avisoSelecione}>Clique em um dos botões acima para selecionar seu plano e abrir a área de pagamento.</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  headerNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    padding: '0 10px 20px',
    borderBottom: '1px solid #f3f4f6',
    width: '100%',
  },
  botaoVoltarHome: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  },
  marcaHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#059669',
    margin: 0,
  },
  secaoIntroducao: {
    textAlign: 'center',
    marginBottom: '50px',
    position: 'relative',
  },
  titulo: {
    color: '#111827',
    fontSize: '2.4rem',
    fontWeight: '800',
    marginBottom: '12px',
    letterSpacing: '-0.025em',
  },
  subtitulo: {
    color: '#4b5563',
    fontSize: '1.1rem',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  gridPlanos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto 60px auto',
    alignItems: 'stretch',
  },
  cardPlano: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '35px',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardDestaque: {
    borderColor: '#059669',
    borderWidth: '2px',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.1)',
  },
  cardSelecionado: {
    backgroundColor: '#f0fdf4',
    borderColor: '#059669',
    borderWidth: '2px',
  },
  tagDestaque: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#059669',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  nomePlano: {
    fontSize: '1.6rem',
    color: '#111827',
    margin: '0 0 10px 0',
  },
  descricaoPlano: {
    fontSize: '0.9rem',
    color: '#6b7280',
    minHeight: '60px',
    marginBottom: '25px',
    lineHeight: '1.4',
  },
  containerPreco: {
    marginBottom: '25px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '20px',
  },
  preco: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#111827',
  },
  periodo: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  listaBeneficios: {
    listStyleType: 'none',
    padding: 0,
    margin: '0 0 35px 0',
    flexGrow: 1,
  },
  itemBeneficio: {
    fontSize: '0.95rem',
    color: '#374151',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '1.4',
  },
  checkIcon: {
    color: '#059669',
    fontWeight: 'bold',
    marginRight: '10px',
    fontSize: '1.1rem',
  },
  botao: {
    backgroundColor: '#ffffff',
    color: '#059669',
    border: '2px solid #059669',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  botaoDestaque: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: '2px solid #059669',
  },
  secaoAssinatura: {
    maxWidth: '500px',
    margin: '0 auto',
    paddingTop: '20px',
    textAlign: 'center',
  },
  caixaFormulario: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'left',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  tituloForm: {
    fontSize: '1.4rem',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  textoVerde: {
    color: '#059669',
  },
  subForm: {
    color: '#6b7280',
    fontSize: '0.95rem',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '18px',
    outlineColor: '#059669',
  },
  botaoConfirmar: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '10px',
  },
  avisoSelecione: {
    color: '#6b7280',
    fontSize: '1.05rem',
    backgroundColor: '#f3f4f6',
    padding: '20px',
    borderRadius: '12px',
  },
}
