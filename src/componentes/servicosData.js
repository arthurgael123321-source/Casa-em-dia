import slideGarden from '../assets/primeira imagem carrosel.png'
import slideRepair from '../assets/Segunda imagem carrosel.png'
import slideCleaning from '../assets/terceira imagem carrosel.png'
import organizationImage from '../assets/Organização.png'
import homeAssistanceImage from '../assets/AssistDomestica.png'
import cleaningImage from '../assets/Faxina.jpg'
import tecnicaimage from '../assets/tecnica.png'
import windowCleaningImage from '../assets/Limpeza de vidros.jpg'
import ironingImage from '../assets/Passadoria de roupas.jpg'
import translations from '../i18n/translations.js'

const getStrings = (language) => translations[language]?.services || translations['pt-BR'].services

export const buildServices = (language) => {
  const strings = getStrings(language)

  return [
    { slug: 'limpeza-residencial', image: slideCleaning, ...strings.limpezaResidencial },
    { slug: 'limpeza-pos-obra', image: slideGarden, ...strings.limpezaPosObra },
    { slug: 'organizacao-de-ambientes', image: organizationImage, ...strings.organizacaoDeAmbientes },
    { slug: 'jardinagem', image: slideRepair, ...strings.jardinagem },
    { slug: 'assistencia-domestica', image: homeAssistanceImage, ...strings.assistenciaDomestica },
    { slug: 'faxina', image: cleaningImage, ...strings.faxina },
    { slug: 'arrumar-eletrodomesticos', image: tecnicaimage, ...strings.arrumarEletrodomesticos },
    { slug: 'limpeza-de-vidros', image: windowCleaningImage, ...strings.limpezaDeVidros },
    { slug: 'passadoria-de-roupas', image: ironingImage, ...strings.passadoriaDeRoupas },
  ]
}

const services = buildServices('pt-BR')

export const serviceMap = services.reduce((map, service) => {
  map[service.slug] = service
  return map
}, {})

export default services
