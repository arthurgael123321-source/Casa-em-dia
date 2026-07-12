import { useState } from 'react';
import { getCurrentUser, updateCurrentUserProfile } from '../services/authUtils.js';
import { atualizarPlano } from '../services/api.js';

const PLANO_PADRAO = 'basico';

const getChavePlanoUsuario = (user) => (
  user?.email ? `planoAtual:${user.email}` : 'planoAtual'
);

const carregarPlanoAtual = (user) => {
  const planoDoUsuario = user?.planoAtual;

  if (planoDoUsuario) {
    return planoDoUsuario;
  }

  return localStorage.getItem(getChavePlanoUsuario(user))
    || localStorage.getItem('planoAtual')
    || PLANO_PADRAO;
};

export function Planos({ onHomeClick }) {
  const usuarioAtual = getCurrentUser();
  // Novo estado: define qual plano o usuário possui atualmente cadastrado
  const [planoAtual, setPlanoAtual] = useState(() => carregarPlanoAtual(usuarioAtual)); 
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagemPlano, setMensagemPlano] = useState('');

  const planosAssinatura = [
    {
      id: 'basico',
      nome: 'Básico',
      preco: 'Grátis',
      nivel: 1, // Nível para cálculo de upgrade/downgrade
      descricao: 'Encontre profissionais qualificados para serviços pontuais.',
      beneficios: [
        'Até 3 orçamentos por pedido',
        'Contato direto com profissionais',
        'Avaliações públicas visíveis',
      ],
      textoBotao: 'Plano Gratuito',
      destaque: false,
    },
    {
      id: 'premium',
      nome: 'Premium',
      preco: 'R$ 24,99',
      nivel: 2,
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
      nivel: 3,
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
  ];

  // Encontra o objeto do plano atual do usuário para exibir no topo
  const dadosPlanoAtual = planosAssinatura.find(p => p.id === planoAtual);

  const handleCliqueAssinar = (plano) => {
    setPlanoSelecionado(plano);
    document.getElementById('area-assinatura')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviarAssinatura = async (e) => {
    e.preventDefault();
    if (!planoSelecionado) {
      return;
    }

    try {
      const novoPlano = planoSelecionado.id;
      const response = await atualizarPlano(novoPlano);

      setPlanoAtual(novoPlano);
      localStorage.setItem(getChavePlanoUsuario(usuarioAtual), novoPlano);
      localStorage.setItem('planoAtual', novoPlano);

      if (response?.user) {
        updateCurrentUserProfile({ ...response.user, planoAtual: response.user.plan });
      } else if (usuarioAtual) {
        updateCurrentUserProfile({ planoAtual: novoPlano });
      }

      setMensagemPlano(`Sucesso! Seu plano foi atualizado para ${planoSelecionado.nome}.`);
      setPlanoSelecionado(null);
    } catch (error) {
      setMensagemPlano(error.message || 'Nao foi possivel atualizar seu plano agora.');
    }
  };

  // Função para descobrir se a troca é um Upgrade ou Downgrade
  const obterTipoMudanca = () => {
    if (!planoSelecionado) return '';
    if (planoSelecionado.nivel > dadosPlanoAtual.nivel) return 'Fazer Upgrade';
    if (planoSelecionado.nivel < dadosPlanoAtual.nivel) return 'Fazer Downgrade';
    return 'Seu Plano Atual';
  };

  return (
    <div style={styles.container}>
      {/* Topo de Navegação Premium — Casa em Dia */}
      <header style={styles.headerNav}>
        <button onClick={() => onHomeClick && onHomeClick()} style={styles.botaoVoltarHome}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </button>
        
        <h1 style={styles.marcaHeader}>Casa em Dia</h1>
        <div style={{ width: '90px' }}></div>
      </header>

      {/* Seção de Introdução dos Planos */}
      <section style={styles.secaoIntroducao}>
        <h2 style={styles.titulo}>Planos de Assinatura</h2>
        <p style={styles.subtitulo}>
          Contrate os melhores profissionais do mercado com segurança, rapidez e garantias exclusivas.
        </p>
      </section>

      {/* ÁREA NOVA: Gerenciamento do Plano Atual */}
      <div style={styles.painelPlanoAtual}>
        <div style={styles.infoPlanoAtual}>
          <span style={styles.tagStatus}>Plano Ativo</span>
          <h3 style={styles.nomePlanoAtual}>
            Você está usando o Plano: <span style={{ color: '#059669' }}>{dadosPlanoAtual?.nome}</span>
          </h3>
          <p style={styles.precoPlanoAtual}>Investimento: {dadosPlanoAtual?.preco}{dadosPlanoAtual?.periodo}</p>
        </div>
        <div style={styles.statusTextoPainel}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            Precisa de mais recursos ou quer economizar? Escolha um plano abaixo para realizar um <strong>Upgrade</strong> ou <strong>Downgrade</strong> instantâneo.
          </p>
        </div>
      </div>

      {/* Grid de Planos */}
      <div style={styles.gridPlanos}>
        {planosAssinatura.map((plano) => {
          const ehOPlanoAtual = plano.id === planoAtual;

          return (
            <div 
              key={plano.id} 
              style={{
                ...styles.cardPlano,
                ...(plano.destaque ? styles.cardDestaque : {}),
                ...(ehOPlanoAtual ? styles.cardPlanoAtualAtivo : {}),
              }}
            >
              {plano.destaque && !ehOPlanoAtual && <span style={styles.tagDestaque}>Mais Recomendado</span>}
              {ehOPlanoAtual && <span style={styles.tagCardAtivo}>Seu Plano</span>}
              
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
                onClick={() => handleCliqueAssinar(plano)}
                disabled={ehOPlanoAtual}
                style={{
                  ...styles.botao,
                  ...(plano.destaque ? styles.botaoDestaque : {}),
                  ...(ehOPlanoAtual ? styles.botaoDesabilitado : {}),
                }}
              >
                {ehOPlanoAtual ? 'Plano Já Ativo' : plano.textoBotao}
              </button>
            </div>
          );
        })}
      </div>

      {/* Formulário de Alteração de Plano */}
      <div id="area-assinatura" style={styles.secaoAssinatura}>
        {mensagemPlano && <p style={styles.mensagemPlano}>{mensagemPlano}</p>}
        {planoSelecionado ? (
          <div style={styles.caixaFormulario}>
            {/* O Título muda dinamicamente indicando se é Upgrade ou Downgrade */}
            <span style={{
              ...styles.tagMudanca,
              backgroundColor: planoSelecionado.nivel > dadosPlanoAtual.nivel ? '#d1faf0' : '#fee2e2',
              color: planoSelecionado.nivel > dadosPlanoAtual.nivel ? '#065f46' : '#991b1b'
            }}>
              {obterTipoMudanca()}
            </span>
            
            <h2 style={styles.tituloForm}>Mudando para: <span style={styles.textoVerde}>{planoSelecionado.nome}</span></h2>
            <p style={styles.subForm}>Confirme seus dados para efetuar a transição de plano no Casa em Dia.</p>
            
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
                Confirmar Alteração ({planoSelecionado.preco})
              </button>
            </form>
          </div>
        ) : (
          <p style={styles.avisoSelecione}>💡 Selecione um plano diferente do seu atual acima para gerenciar sua assinatura.</p>
        )}
      </div>
    </div>
  );
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
    padding: '0 10px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '20px',
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
    marginBottom: '30px',
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
  // ESTILOS DO PAINEL DE PLANO ATUAL
  painelPlanoAtual: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px 30px',
    maxWidth: '1020px',
    margin: '0 auto 45px auto',
    flexWrap: 'wrap',
    gap: '20px',
  },
  infoPlanoAtual: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tagStatus: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '3px 8px',
    borderRadius: '4px',
    width: 'fit-content',
    textTransform: 'uppercase',
  },
  nomePlanoAtual: {
    fontSize: '1.3rem',
    margin: '4px 0 0 0',
    color: '#1e293b',
  },
  precoPlanoAtual: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#475569',
    fontWeight: '500',
  },
  statusTextoPainel: {
    maxWidth: '450px',
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
  cardPlanoAtualAtivo: {
    borderColor: '#0284c7',
    borderWidth: '2px',
    backgroundColor: '#f0f9ff',
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
  tagCardAtivo: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#0284c7',
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
    transition: 'all 0.2s',
  },
  botaoDestaque: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: '2px solid #059669',
  },
  botaoDesabilitado: {
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    borderColor: '#cbd5e1',
    cursor: 'not-allowed',
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
  tagMudanca: {
    display: 'inline-block',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '6px',
    marginBottom: '12px',
    textTransform: 'uppercase',
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
  mensagemPlano: {
    margin: '0 0 16px 0',
    color: '#14532d',
    fontWeight: '700',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '10px 12px',
  }
};
