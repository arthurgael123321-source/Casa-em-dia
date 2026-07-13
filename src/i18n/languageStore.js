import { createContext, useContext } from 'react'

export const LANGUAGE_KEY = 'appLanguage'
export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US']
export const DEFAULT_LANGUAGE = 'pt-BR'

export const getStoredLanguage = () => {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE
}

export const LanguageContext = createContext(null)

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
