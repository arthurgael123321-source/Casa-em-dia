import slideGarden from '../assets/primeira imagem carrosel.png'
import slideRepair from '../assets/Segunda imagem carrosel.png'
import slideCleaning from '../assets/terceira imagem carrosel.png'
import heroImage from '../assets/hero.png'
import extraImage from '../assets/OIP.png'

const services = [
  {
    slug: 'limpeza-residencial',
    title: 'Limpeza residencial',
    description: 'Limpeza completa de salas, quartos, cozinhas e banheiros. Ideal para manter sua casa organizada, cheirosa e livre de sujeira acumulada.',
    details: [
      'Remoção de poeira e sujeira acumulada',
      'Higienização de superfícies e pisos',
      'Limpeza de móveis e bancadas',
      'Organização leve de objetos e utensílios',
    ],
    image: slideCleaning,
  },
  {
    slug: 'limpeza-pos-obra',
    title: 'Limpeza pós-obra',
    description: 'Remoção de resíduos de construção, poeira fina e manchas. Higienização profunda para deixar o imóvel pronto para uso imediato.',
    details: [
      'Retirada de poeira de drywall e cimento',
      'Limpeza de azulejos, pisos e vidros',
      'Rejuntes e superfícies finalizadas',
      'Checagem de acabamentos e áreas comuns',
    ],
    image: slideRepair,
  },
  {
    slug: 'organizacao-de-ambientes',
    title: 'Organização de ambientes',
    description: 'Arrumação de armários, organização de espaços e otimização de cada cômodo. Solução perfeita para quem busca funcionalidade e conforto.',
    details: [
      'Organização de armários e prateleiras',
      'Separação de itens por função e uso',
      'Melhoria de circulação e aproveitamento',
      'Dicas práticas para manutenção diária',
    ],
    image: extraImage,
  },
  {
    slug: 'jardinagem',
    title: 'Jardinagem',
    description: 'Corte de grama, cuidados com o jardim, poda de plantas e manutenção de canteiros. Deixe sua área verde bonita e saudável o ano todo.',
    details: [
      'Corte de grama e acabamento de bordas',
      'Poda de arbustos e plantas ornamentais',
      'Limpeza de canteiros e áreas externas',
      'Verificação de saúde das plantas',
    ],
    image: slideGarden,
  },
  {
    slug: 'assistencia-domestica',
    title: 'Assistência doméstica',
    description: 'Apoio nas tarefas de rotina, acompanhamento de compras e manutenção da casa. Profissionais treinados para ajudar no dia a dia.',
    details: [
      'Auxílio na limpeza diária',
      'Organização de rotina doméstica',
      'Cuidados com roupas e pequenos reparos',
      'Apoio em tarefas de cozinha e compras',
    ],
    image: heroImage,
  },
  {
    slug: 'faxina',
    title: 'Faxina',
    description: 'Limpeza geral com foco em cada detalhe: retirada de pó, lavagem de pisos, limpeza de vidros e higienização completa.',
    details: [
      'Lavagem de pisos e paredes',
      'Limpeza de vidros e espelhos',
      'Desinfecção de bancadas e áreas de toque',
      'Acabamento em rodapés e cantos',
    ],
    image: heroImage,
  },
]

export const serviceMap = services.reduce((map, service) => {
  map[service.slug] = service
  return map
}, {})

export default services
