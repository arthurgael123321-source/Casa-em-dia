/**
 * Utilitários de Autenticação
 * Funções auxiliares para gerenciar autenticação com localStorage
 */

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
  }

  return {
    token,
    email,
    username: username || email.split('@')[0],
  };
};

/**
 * Verificar se o usuário está autenticado
 * @returns {boolean} true se autenticado, false caso contrário
 */
export const isAuthenticated = () => {
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

/**
 * Fazer logout do usuário
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('username');
  window.location.href = '/login';
};

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
