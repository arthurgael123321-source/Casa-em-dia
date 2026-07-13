import { useCallback, useMemo, useState } from 'react'
import translations from './translations.js'
import { LanguageContext, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_KEY, getStoredLanguage } from './languageStore.js'

const readByPath = (dictionary, path) => (
  path.split('.').reduce((value, segment) => (value == null ? value : value[segment]), dictionary)
)

const interpolate = (text, vars) => {
  if (!vars) return text
  return Object.keys(vars).reduce((result, key) => (
    result.replaceAll(`{{${key}}}`, vars[key])
  ), text)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getStoredLanguage())

  const setLanguage = useCallback((nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return
    localStorage.setItem(LANGUAGE_KEY, nextLanguage)
    setLanguageState(nextLanguage)
  }, [])

  const t = useCallback((key, vars) => {
    const value = readByPath(translations[language], key)
    const fallback = readByPath(translations[DEFAULT_LANGUAGE], key)
    const resolved = value ?? fallback ?? key

    if (typeof resolved === 'string') {
      return interpolate(resolved, vars)
    }

    return resolved
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
