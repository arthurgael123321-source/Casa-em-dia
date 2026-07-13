const THEME_KEY = 'appTheme'

const getSystemPrefersDark = () => (
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
)

export const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'claro'

const resolveEffectiveTheme = (theme) => {
  if (theme === 'auto') {
    return getSystemPrefersDark() ? 'escuro' : 'claro'
  }

  return theme
}

export const applyTheme = (theme) => {
  const effective = resolveEffectiveTheme(theme)
  document.documentElement.setAttribute('data-theme', effective === 'escuro' ? 'dark' : 'light')
}

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme)
  applyTheme(theme)
}

export const initTheme = () => {
  const stored = getStoredTheme()
  applyTheme(stored)

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getStoredTheme() === 'auto') {
        applyTheme('auto')
      }
    })
  }
}
