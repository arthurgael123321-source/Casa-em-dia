# Sistema de Login - Casa em Dia 🏠

## 📋 Descrição

Sistema completo de autenticação com suporte a múltiplos métodos de login:

- ✅ **Login Tradicional**: Email/Username + Senha com cadastro de novo usuário
- ✅ **Google**: Email + Código aleatório
- ✅ **Facebook**: Email + Código aleatório  
- ✅ **SMS**: Telefone (formato BR) + Código aleatório

Todos os dados são armazenados em **localStorage** para persistência entre sessões.

---

## 🎯 Funcionalidades

### 1. Login Tradicional
- Criar nova conta com username, email e senha
- Fazer login com email ou username
- Validação de senha (mínimo 6 caracteres)
- Validação de email

### 2. Login com Google
- Digitar email do Google
- Sistema envia código aleatório (6 dígitos)
- Código é exibido na tela para teste
- Usuário digita o código para verificar
- Cria automaticamente usuário na primeira autenticação

### 3. Login com Facebook
- Mesma mecânica do Google
- Digitar email do Facebook
- Receber e validar código

### 4. Login com SMS
- Digitar número de telefone (formato: (XX) 9XXXX-XXXX)
- Suporta DDD de qualquer região (ex: 51 para RS)
- Código aleatório é enviado
- Usuário valida o código

---

## 📱 Formato de Telefone

O sistema valida telefones brasileiros no formato:

```
(DDD) 9XXXX-XXXX
```

**Exemplos válidos:**
- (51) 98765-4321 (Rio Grande do Sul)
- (21) 99876-5432 (Rio de Janeiro)
- (11) 95555-1234 (São Paulo)

**Formatação automática:** Ao digitar, o campo auto-formata o número

---

## 💾 Dados no localStorage

### Usuários (Cadastro)
```javascript
// localStorage.users = Array de objetos
{
  id: timestamp,
  username: "string",
  email: "string",
  password: "string", // null para autenticação social
  phone: "string", // apenas para SMS
  loginMethod: "traditional|google|facebook|sms",
  createdAt: "ISO string"
}
```

### Sessão Autenticada
```javascript
localStorage.authToken    // Token de autenticação
localStorage.userEmail    // Email do usuário logado
localStorage.username     // Username do usuário logado
localStorage.rememberMe   // true/false (lembrar de mim)
```

---

## 🔧 Como Usar em Outros Componentes

### Importar Utilitários
```javascript
import {
  getCurrentUser,
  isAuthenticated,
  logout,
  getAllUsers,
  findUserByEmailOrUsername
} from '../services/authUtils'
```

### Verificar Autenticação
```javascript
import { isAuthenticated, getCurrentUser } from '../services/authUtils'

if (!isAuthenticated()) {
  // Redirecionar para login
  window.location.href = '/login'
}

const user = getCurrentUser()
console.log(user.email, user.username)
```

### Fazer Logout
```javascript
import { logout } from '../services/authUtils'

const handleLogout = () => {
  logout() // Limpa localStorage e redireciona para /login
}
```

### Listar Todos os Usuários
```javascript
import { getAllUsers } from '../services/authUtils'

const users = getAllUsers()
console.log(`Total de usuários: ${users.length}`)
```

---

## 🧪 Testando o Sistema

### Testar Login Tradicional
1. Clicar em "Não tem conta? Crie uma"
2. Preenchê com:
   - **Username**: teste
   - **Email**: teste@email.com
   - **Senha**: 123456
   - **Confirmar Senha**: 123456
3. Aceitar termos de serviço
4. Clicar em "Criar Conta"
5. Será redirecionado automaticamente

### Testar Google/Facebook
1. Clicar no botão "Entrar com Google" ou "Entrar com Facebook"
2. Digitar email: exemplo@gmail.com
3. Clicar "Enviar Código"
4. Código aparecerá na tela (ex: 456789)
5. Digitar o código no campo
6. Clicar "Verificar Código"
7. Será redirecionado automaticamente

### Testar SMS
1. Clicar em "Entrar com Telefone"
2. Digitar telefone: (51) 98765-4321
3. Clicar "Enviar Código"
4. Código aparecerá (ex: 123456)
5. Digitar o código
6. Clicar "Verificar Código"
7. Será redirecionado

---

## 🔐 Segurança & Observações

> ⚠️ **IMPORTANTE**: Este é um sistema de demonstração usando localStorage.
> 
> Para produção:
> - ✅ Implementar backend real com autenticação JWT
> - ✅ Usar APIs reais de Google, Facebook e SMS
> - ✅ Hash de senhas com bcrypt
> - ✅ HTTPS obrigatório
> - ✅ Validação servidor-side

---

## 📝 Mudanças Futuras

Para integração com APIs reais:

```javascript
// Exemplo de integração com Google real
const handleGoogleLogin = async (googleToken) => {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: googleToken })
  })
  // ... processar resposta
}
```

---

## 📂 Arquivos Relacionados

- `src/componentes/Login.jsx` - Componente principal de login
- `src/componentes/Login.css` - Estilos do login
- `src/services/authUtils.js` - Funções utilitárias
- `src/services/api.js` - Serviço de API (integração futura)

---

## 🎨 Customização

### Mudar cores do login
Editar variáveis CSS em `Login.css`:
```css
.login-left { background: var(--accent-dark); }
.login-submit { background: linear-gradient(180deg,var(--accent-2),var(--accent-1)); }
```

### Adicionar novo método de login
1. Adicionar novo estado em `Login.jsx`
2. Criar função `handleNewMethodCodeSend` e `handleNewMethodCodeVerify`
3. Adicionar novo botão social
4. Implementar UI da tela de código

---

## ❓ FAQ

**P: Onde os dados são armazenados?**
R: No `localStorage` do navegador. Limpos ao apagar dados do navegador.

**P: É seguro para produção?**
R: Não. Use para prototipagem apenas. Em produção, implemente backend real.

**P: Como resetar todas as contas?**
R: No console: `localStorage.clear()` e recarregue a página.

**P: Posso usar diferentes formatos de telefone?**
R: O regex aceita (XX) 9XXXX-XXXX, XX 9XXXX-XXXX ou X9XXXXXX.

---

## 📞 Suporte

Para dúvidas ou melhorias, edite este arquivo ou entre em contato com o time de desenvolvimento.

**Última atualização**: 2026-07-02
