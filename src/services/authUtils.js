const getStorageWithAuth = () => {
  const storages = [window.localStorage, window.sessionStorage]

<<<<<<< HEAD
/**
 * Obter usuário autenticado atual
 * @returns {Object|null} Dados do usuário ou null se não autenticado
 */
export const getCurrentUser = () => {
  const storage = getSessionStorage();
  const token = storage.getItem('authToken');
  const email = storage.getItem('userEmail');
  const username = storage.getItem('username');

  if (!token || !email) {
    return null;
=======
  for (const storage of storages) {
    if (storage.getItem('authToken') && storage.getItem('userEmail')) {
      return storage
    }
>>>>>>> 4c4c20b (Commit modificações página principal(remoção dos botoes))
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

  const existingIndex = users.findIndex((entry) => entry.email === normalizedUser.email || entry.id === normalizedUser.id)
  if (existingIndex >= 0) {
    users[existingIndex] = normalizedUser
  } else {
    users.push(normalizedUser)
  }

  window.localStorage.setItem('users', JSON.stringify(users))
  return normalizedUser
}

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

  if (storage) {
    storage.setItem('currentUser', JSON.stringify(fallbackUser))
  }

  return fallbackUser
}

export const isAuthenticated = () => {
<<<<<<< HEAD
  return !!getSessionStorage().getItem('authToken');
};

/**
 * Obter o storage que tem a sessao atual.
 * localStorage e usado quando "Lembre de mim" esta ativo.
 * sessionStorage e usado para manter login apenas na aba atual.
 */
export const getSessionStorage = () => {
  if (localStorage.getItem('authToken')) {
    return localStorage;
  }

  return sessionStorage;
};

/**
 * Salvar sessao do usuario.
 * @param {Object} user - Usuario autenticado
 * @param {boolean} rememberMe - Se true, persiste mesmo apos fechar o navegador
 */
export const saveSession = (user, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  otherStorage.removeItem('authToken');
  otherStorage.removeItem('userEmail');
  otherStorage.removeItem('username');

  storage.setItem('authToken', `token_${Date.now()}`);
  storage.setItem('userEmail', user.email);
  storage.setItem('username', user.username || user.email);

  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('rememberMe');
  }
};
=======
  return !!getCurrentUser()
}

export const persistAuthSession = (user, rememberMe = false) => {
  const normalizedUser = persistUserInRegistry(user)
  const token = `token_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const authData = {
    token,
    email: normalizedUser.email,
    username: normalizedUser.username || normalizedUser.email,
  }

  const targetStorage = rememberMe ? window.localStorage : window.sessionStorage
  const fallbackStorage = rememberMe ? window.sessionStorage : window.localStorage

  targetStorage.setItem('authToken', authData.token)
  targetStorage.setItem('userEmail', authData.email)
  targetStorage.setItem('username', authData.username)
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
>>>>>>> 4c4c20b (Commit modificações página principal(remoção dos botoes))

export const logout = () => {
<<<<<<< HEAD
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('username');
  window.location.href = '/login';
};
=======
  clearAuthSession()
}
>>>>>>> 4c4c20b (Commit modificações página principal(remoção dos botoes))

/**
 * Obter todos os usuários registrados
 * @returns {Array} Lista de usuários
 */
export const getAllUsers = () => {
  const usersJSON = localStorage.getItem('users');
  return usersJSON ? JSON.parse(usersJSON) : [];
};

/**
 * Encontrar usuário por email ou username
 * @param {string} emailOrUsername - Email ou nome de usuário
 * @returns {Object|null} Dados do usuário ou null
 */
export const findUserByEmailOrUsername = (emailOrUsername) => {
  const users = getAllUsers();
  return users.find(u => u.email === emailOrUsername || u.username === emailOrUsername) || null;
};

/**
 * Atualizar dados do usuário no localStorage
 * @param {string} field - Campo a atualizar (email, username, etc)
 * @param {any} value - Novo valor
 */
export const updateCurrentUserField = (field, value) => {
  const storage = getSessionStorage();

  if (field === 'email') {
    storage.setItem('userEmail', value);
  } else if (field === 'username') {
    storage.setItem('username', value);
  }
};

/**
 * Formatar telefone brasileiro
 * @param {string} phone - Número de telefone
 * @returns {string} Número formatado
 */
export const formatPhoneBR = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
};

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} true se válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar telefone brasileiro
 * @param {string} phone - Número de telefone
 * @returns {boolean} true se válido
 */
export const validatePhoneBR = (phone) => {
  const phoneRegex = /^\(?[0-9]{2}\)?[\s-]?9[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Gerar código aleatório
 * @param {number} length - Comprimento do código (padrão: 6)
 * @returns {string} Código aleatório
 */
export const generateRandomCode = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};
