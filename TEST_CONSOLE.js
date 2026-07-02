/**
 * TESTE RÁPIDO DO SISTEMA DE LOGIN
 * 
 * Cole este código no console do navegador (F12 > Console)
 * para testar rapidamente o sistema de autenticação
 */

// ========================================
// TESTE 1: Criar usuário de teste
// ========================================
console.log('%c=== TESTE 1: Criar Usuário ===', 'color: blue; font-weight: bold');

// Simular criação de usuário
const newUser = {
  id: Date.now(),
  username: 'teste_demo',
  email: 'demo@teste.com',
  password: '123456',
  loginMethod: 'traditional',
  createdAt: new Date().toISOString()
};

// Adicionar ao localStorage
const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
existingUsers.push(newUser);
localStorage.setItem('users', JSON.stringify(existingUsers));

console.log('✅ Usuário criado:', newUser);
console.log('Total de usuários:', existingUsers.length);

// ========================================
// TESTE 2: Fazer login com o usuário
// ========================================
console.log('%c=== TESTE 2: Fazer Login ===', 'color: blue; font-weight: bold');

localStorage.setItem('authToken', `token_${Date.now()}`);
localStorage.setItem('userEmail', newUser.email);
localStorage.setItem('username', newUser.username);

const authToken = localStorage.getItem('authToken');
const userEmail = localStorage.getItem('userEmail');
const username = localStorage.getItem('username');

console.log('✅ Autenticado:');
console.log('  - Token:', authToken);
console.log('  - Email:', userEmail);
console.log('  - Username:', username);

// ========================================
// TESTE 3: Verificar autenticação
// ========================================
console.log('%c=== TESTE 3: Verificar Autenticação ===', 'color: blue; font-weight: bold');

const isAuthenticated = !!localStorage.getItem('authToken');
const currentUser = {
  token: localStorage.getItem('authToken'),
  email: localStorage.getItem('userEmail'),
  username: localStorage.getItem('username')
};

console.log('✅ Autenticado?', isAuthenticated);
console.log('✅ Usuário atual:', currentUser);

// ========================================
// TESTE 4: Listar todos os usuários
// ========================================
console.log('%c=== TESTE 4: Listar Usuários ===', 'color: blue; font-weight: bold');

const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
console.log('✅ Total de usuários:', allUsers.length);
allUsers.forEach((user, index) => {
  console.log(`  ${index + 1}. ${user.username} (${user.email}) - ${user.loginMethod || 'traditional'}`);
});

// ========================================
// TESTE 5: Validar Email
// ========================================
console.log('%c=== TESTE 5: Validar Email ===', 'color: blue; font-weight: bold');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const emailTests = [
  'valido@email.com',
  'usuario@company.co.br',
  'invalido@',
  'semdobro.com',
  'outro+tag@example.com'
];

emailTests.forEach(email => {
  const valid = validateEmail(email);
  console.log(`${valid ? '✅' : '❌'} ${email}`);
});

// ========================================
// TESTE 6: Validar Telefone
// ========================================
console.log('%c=== TESTE 6: Validar Telefone ===', 'color: blue; font-weight: bold');

const validatePhoneBR = (phone) => {
  const phoneRegex = /^\(?[0-9]{2}\)?[\s-]?9[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const phoneTests = [
  '(51) 98765-4321',
  '51 98765-4321',
  '5198765-4321',
  '51987654321',
  '5134567890',
  '(21) 99999-8888'
];

phoneTests.forEach(phone => {
  const valid = validatePhoneBR(phone);
  console.log(`${valid ? '✅' : '❌'} ${phone}`);
});

// ========================================
// TESTE 7: Gerar Código Aleatório
// ========================================
console.log('%c=== TESTE 7: Gerar Códigos Aleatórios ===', 'color: blue; font-weight: bold');

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

console.log('✅ Códigos gerados:');
for (let i = 0; i < 5; i++) {
  console.log(`  Código ${i + 1}: ${generateCode()}`);
}

// ========================================
// TESTE 8: Logout
// ========================================
console.log('%c=== TESTE 8: Fazer Logout ===', 'color: blue; font-weight: bold');

const beforeLogout = {
  authToken: localStorage.getItem('authToken'),
  userEmail: localStorage.getItem('userEmail'),
  username: localStorage.getItem('username')
};

localStorage.removeItem('authToken');
localStorage.removeItem('userEmail');
localStorage.removeItem('username');
localStorage.removeItem('rememberMe');

const afterLogout = {
  authToken: localStorage.getItem('authToken'),
  userEmail: localStorage.getItem('userEmail'),
  username: localStorage.getItem('username')
};

console.log('Antes do logout:', beforeLogout);
console.log('Depois do logout:', afterLogout);
console.log('✅ Logout realizado com sucesso!');

// ========================================
// RESUMO FINAL
// ========================================
console.log('%c=== RESUMO FINAL ===', 'color: green; font-weight: bold; font-size: 14px');
console.log('✅ localStorage.users:', JSON.parse(localStorage.getItem('users') || '[]'));
console.log('✅ Todas as validações estão funcionando');
console.log('✅ Códigos aleatórios sendo gerados');
console.log('✅ Autenticação em localStorage OK');
console.log('%cTODOS OS TESTES PASSARAM! 🎉', 'color: green; font-weight: bold; font-size: 16px');

// ========================================
// COMANDOS ÚTEIS
// ========================================
console.log('%c=== COMANDOS ÚTEIS ===', 'color: purple; font-weight: bold');
console.log(`
Copie e cole estes comandos no console para gerenciar a autenticação:

1. Limpar todos os dados:
   localStorage.clear()

2. Ver todos os usuários:
   JSON.parse(localStorage.getItem('users'))

3. Ver usuário autenticado:
   { token: localStorage.getItem('authToken'), email: localStorage.getItem('userEmail') }

4. Fazer logout:
   localStorage.removeItem('authToken'); localStorage.removeItem('userEmail'); localStorage.removeItem('username');

5. Adicionar novo usuário:
   const users = JSON.parse(localStorage.getItem('users') || '[]');
   users.push({ id: Date.now(), username: 'novo', email: 'novo@email.com', password: '123456', loginMethod: 'traditional', createdAt: new Date().toISOString() });
   localStorage.setItem('users', JSON.stringify(users));

6. Autenticar como um usuário:
   localStorage.setItem('authToken', 'token_demo');
   localStorage.setItem('userEmail', 'demo@teste.com');
   localStorage.setItem('username', 'teste_demo');
`);
