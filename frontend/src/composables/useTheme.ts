import { computed, readonly, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants/auth.constants'

export type ThemeMode = 'light' | 'dark'

const themeState = ref<ThemeMode>('light')
const THEME_PREFERENCE_FLAG_KEY = 'themePreferenceSet'
let isInitialized = false
let hasStorageListener = false

const isThemeMode = (value: unknown): value is ThemeMode => {
  return value === 'light' || value === 'dark'
}

const readStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEYS.THEME)
  return isThemeMode(stored) ? stored : null
}

const hasExplicitUserThemePreference = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(THEME_PREFERENCE_FLAG_KEY) === '1'
}

const applyThemeToDom = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export const setTheme = (theme: ThemeMode) => {
  themeState.value = theme
  applyThemeToDom(theme)

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    localStorage.setItem(THEME_PREFERENCE_FLAG_KEY, '1')
  }
}

export const toggleTheme = () => {
  setTheme(themeState.value === 'dark' ? 'light' : 'dark')
}

export const initializeTheme = () => {
  if (typeof window === 'undefined') return

  if (!isInitialized) {
    const storedTheme = readStoredTheme()
    const initialTheme = hasExplicitUserThemePreference() && storedTheme ? storedTheme : 'light'
    themeState.value = initialTheme
    applyThemeToDom(initialTheme)

    // On persiste le thème actif pour stabiliser le rendu entre sessions.
    // La préférence explicite n'est activée que via setTheme (action utilisateur).
    localStorage.setItem(STORAGE_KEYS.THEME, initialTheme)

    isInitialized = true
  } else {
    applyThemeToDom(themeState.value)
  }

  if (!hasStorageListener) {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key !== STORAGE_KEYS.THEME || !isThemeMode(event.newValue)) return
      themeState.value = event.newValue
      applyThemeToDom(event.newValue)
    })

    hasStorageListener = true
  }
}

export const useTheme = () => {
  return {
    theme: readonly(themeState),
    isDark: computed(() => themeState.value === 'dark'),
    setTheme,
    toggleTheme,
    initializeTheme
  }
}
