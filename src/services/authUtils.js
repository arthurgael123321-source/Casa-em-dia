const getStorageWithAuth = () => {
  const storages = [window.localStorage, window.sessionStorage]

  for (const storage of storages) {
    if (storage.getItem('authToken') && storage.getItem('userEmail')) {
      return storage
    }
  }

  return null
}

const readStoredUser = (storage) => {
  if (!storage) return null

  try {
    const raw = storage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistUserInRegistry = (user) => {
  const users = JSON.parse(window.localStorage.getItem('users') || '[]')
  const normalizedUser = {
    ...user,
    id: user.id || Date.now(),
    username: user.username || user.email,
    fullName: user.fullName || user.username || user.email,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    createdAt: user.createdAt || new Date().toISOString(),
  }

  const existingIndex = users.findIndex((entry) => (
    entry.email === normalizedUser.email || entry.id === normalizedUser.id
  ))

  if (existingIndex >= 0) {
    users[existingIndex] = normalizedUser
  } else {
    users.push(normalizedUser)
  }

  window.localStorage.setItem('users', JSON.stringify(users))
  return normalizedUser
}

export const getSessionStorage = () => getStorageWithAuth() || window.sessionStorage

export const getCurrentUser = () => {
  const storage = getStorageWithAuth()
  const user = readStoredUser(storage)

  if (user) {
    return user
  }

  const email = storage?.getItem('userEmail')
  const username = storage?.getItem('username')

  if (!email) {
    return null
  }

  const fallbackUser = {
    id: Date.now(),
    username: username || email.split('@')[0],
    fullName: username || email.split('@')[0],
    email,
    phone: '',
    address: '',
    createdAt: new Date().toISOString(),
  }

  storage?.setItem('currentUser', JSON.stringify(fallbackUser))
  return fallbackUser
}

export const isAuthenticated = () => !!getCurrentUser()

export const persistAuthSession = (user, rememberMe = false) => {
  const normalizedUser = persistUserInRegistry(user)
  const token = `token_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const targetStorage = rememberMe ? window.localStorage : window.sessionStorage
  const fallbackStorage = rememberMe ? window.sessionStorage : window.localStorage

  targetStorage.setItem('authToken', token)
  targetStorage.setItem('userEmail', normalizedUser.email)
  targetStorage.setItem('username', normalizedUser.username || normalizedUser.email)
  targetStorage.setItem('currentUser', JSON.stringify(normalizedUser))

  fallbackStorage.removeItem('authToken')
  fallbackStorage.removeItem('userEmail')
  fallbackStorage.removeItem('username')
  fallbackStorage.removeItem('currentUser')

  if (rememberMe) {
    window.localStorage.setItem('rememberMe', 'true')
    window.sessionStorage.removeItem('rememberMe')
  } else {
    window.sessionStorage.setItem('rememberMe', 'false')
    window.localStorage.removeItem('rememberMe')
  }

  return normalizedUser
}

export const saveSession = persistAuthSession

export const clearAuthSession = () => {
  window.localStorage.removeItem('authToken')
  window.localStorage.removeItem('userEmail')
  window.localStorage.removeItem('username')
  window.localStorage.removeItem('currentUser')
  window.localStorage.removeItem('rememberMe')
  window.sessionStorage.removeItem('authToken')
  window.sessionStorage.removeItem('userEmail')
  window.sessionStorage.removeItem('username')
  window.sessionStorage.removeItem('currentUser')
  window.sessionStorage.removeItem('rememberMe')
}

export const logout = () => {
  clearAuthSession()
}

export const updateCurrentUserProfile = (updates) => {
  const currentUser = getCurrentUser()
  const storage = getStorageWithAuth()

  if (!currentUser || !storage) {
    return null
  }

  const nextUser = {
    ...currentUser,
    ...updates,
    id: currentUser.id || Date.now(),
    fullName: updates.fullName || updates.username || currentUser.fullName || currentUser.username || currentUser.email,
    username: updates.username || currentUser.username || currentUser.email,
    email: updates.email || currentUser.email,
    phone: updates.phone || currentUser.phone || '',
    address: updates.address || currentUser.address || '',
  }

  storage.setItem('currentUser', JSON.stringify(nextUser))
  storage.setItem('userEmail', nextUser.email)
  storage.setItem('username', nextUser.username || nextUser.email)

  persistUserInRegistry(nextUser)
  return nextUser
}

export const getAllUsers = () => {
  const usersJSON = window.localStorage.getItem('users')
  return usersJSON ? JSON.parse(usersJSON) : []
}

export const findUserByEmailOrUsername = (emailOrUsername) => {
  const users = getAllUsers()
  return users.find(u => u.email === emailOrUsername || u.username === emailOrUsername) || null
}

export const updateCurrentUserField = (field, value) => {
  const storage = getSessionStorage()
  const currentUser = getCurrentUser()

  if (field === 'email') {
    storage.setItem('userEmail', value)
  } else if (field === 'username') {
    storage.setItem('username', value)
  }

  if (currentUser) {
    updateCurrentUserProfile({ ...currentUser, [field]: value })
  }
}

export const formatPhoneBR = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length <= 2) {
    return cleaned
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneBR = (phone) => {
  const phoneRegex = /^\(?[0-9]{2}\)?[\s-]?9[0-9]{4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const generateRandomCode = (length = 6) => {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return Math.floor(min + Math.random() * (max - min + 1)).toString()
}
