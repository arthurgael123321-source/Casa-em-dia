# ❓ FAQ - Perguntas Frequentes

## 🔐 Autenticação

### P: Como funciona a senha?
**R:** A senha é salva em texto plano no localStorage (apenas para demo). Em produção, use bcrypt para hash.

```javascript
// Atual (demo)
password: "123456" // Salvo em texto plano

// Produção (exemplo)
password: "$2b$10$iUt....." // Hash bcrypt
```

### P: Como faço para recuperar minha senha?
**R:** Atualmente não há sistema de recuperação. Em produção, implemente:
- Email de recuperação
- Token com expiração
- Nova senha temporária

### P: Posso usar um email social em login tradicional?
**R:** Sim, emails podem ser usados em qualquer método. Se já existe em um método, pode logar com outro.

### P: O que é authToken?
**R:** Um identificador simples armazenado em localStorage para indicar que o usuário está autenticado.

```javascript
// Gerado como:
authToken = `token_${Date.now()}`
// Exemplo: "token_1719843456789"
```

---

## 📱 Telefone

### P: Por que o DDD é obrigatório?
**R:** Para garantir que o número seja válido e internacional. Formato: (XX) 9XXXX-XXXX

### P: Qual é o formato correto de telefone?
**R:**
```
Aceito:           Não aceito:
✅ (51) 98765-4321    ❌ (51) 34567-8901 (sem 9)
✅ 51 98765-4321      ❌ (51) 987654321 (sem hífen)
✅ 5198765-4321       ❌ 98765-4321 (sem DDD)
✅ 51987654321        ❌ 5134567890 (sem 9)
```

### P: Por que sempre precisa de 9 no número?
**R:** Padrão brasileiro: números de celular sempre começam com 9 após o DDD.

### P: Como obtenho o DDD da minha região?
**R:** Alguns DDDs brasileiros:
```
São Paulo: 11        Rio de Janeiro: 21
Brasília: 61         Salvador: 71
Minas Gerais: 31     Pará: 91
Rio Grande do Sul: 51    Santa Catarina: 47
```

---

## 🔑 Código de Verificação

### P: Quanto tempo o código dura?
**R:** Atualmente, indefinidamente (é só um número aleatório). Em produção, implemente expiração de 5-15 minutos.

### P: Preciso me preocupar se alguém vir o código na tela?
**R:** Não é seguro em produção. Use SMS/Email real. Para demo, é só para teste.

### P: Como funciona a geração de código?
**R:**
```javascript
Math.floor(100000 + Math.random() * 900000)
// Gera número entre 100000 e 999999
```

### P: Posso reusar um código?
**R:** Sim, o mesmo código funciona enquanto estiver na tela. Para produção, use um uso por código.

---

## 💾 localStorage

### P: Onde os dados são salvos?
**R:** No localStorage do navegador, específico para cada domínio e navegador.

### P: Como limpo os dados?
**R:**
```javascript
// Opção 1: DevTools
// F12 → Application → Local Storage → Limpar todos

// Opção 2: Console
localStorage.clear()

// Opção 3: Apenas autenticação
localStorage.removeItem('authToken')
localStorage.removeItem('userEmail')
localStorage.removeItem('username')
```

### P: Os dados persistem após fechar o navegador?
**R:** Sim, localStorage persiste indefinidamente até ser limpo manualmente.

### P: É seguro armazenar dados em localStorage?
**R:** Não. É vulnerável a XSS. Use apenas para demo/prototipagem.

### P: Qual é o limite de localStorage?
**R:** Geralmente 5-10MB por domínio, dependendo do navegador.

### P: Como vejo todos os usuários cadastrados?
**R:**
```javascript
// No console:
JSON.parse(localStorage.getItem('users'))

// Ou via DevTools:
// F12 → Application → Local Storage → users
```

---

## 🐛 Troubleshooting

### Problema: "Código Incorreto" mesmo com código certo
**Causa:** Você copiou espaços ou pontos.
**Solução:** Copie apenas os números.

### Problema: Telefone não formata automaticamente
**Causa:** Navegador não suporta entrada dinâmica.
**Solução:** Tente em Chrome, Firefox ou Edge.

### Problema: Email duplicado ao criar conta
**Causa:** Email já existe em localStorage.users
**Solução:** Use email diferente ou limpe localStorage: `localStorage.clear()`

### Problema: Botão "Entrar" não funciona
**Causa:** Termos de serviço não aceitos.
**Solução:** ✓ Marque "Aceitar termos de serviço".

### Problema: Senha muito curta (menos de 6 caracteres)
**Causa:** Validação rejeita senhas pequenas.
**Solução:** Use mínimo 6 caracteres.

### Problema: Não consigo voltar da tela do código
**Causa:** Botão "Voltar" está atrasado.
**Solução:** Aguarde 1 segundo ou clique novamente.

### Problema: A página não muda quando clico "Entrar"
**Causa:** Token pode estar vazio ou não setando corretamente.
**Solução:**
```javascript
// Console:
localStorage.authToken    // Deve ter valor
localStorage.userEmail    // Deve ter valor
location.reload()         // Force reload
```

### Problema: Abre /login infinitamente
**Causa:** authToken está vazio mesmo após login.
**Solução:** Verifique o console para erros JavaScript.

---

## 🔒 Segurança

### P: Meu login é seguro?
**R:** ❌ Não. Para demo apenas. Riscos:
- Senhas em texto plano
- localStorage pode ser acessado por qualquer script
- Sem HTTPS
- Sem proteção CSRF
- Sem rate limiting

### P: O que devo fazer para produção?
**R:** Implemente:
```
✅ Backend com autenticação JWT
✅ Hash de senhas (bcrypt/argon2)
✅ HTTPS obrigatório
✅ Proteção contra XSS
✅ CSRF tokens
✅ Rate limiting
✅ Validação server-side
✅ Logs de autenticação
✅ 2FA opcional
```

---

## 🧪 Testes

### P: Como testo sem criar conta real?
**R:**
```javascript
// Console: criar usuário de teste
const users = JSON.parse(localStorage.getItem('users') || '[]')
users.push({
  id: Date.now(),
  username: 'test',
  email: 'test@email.com',
  password: '123456',
  loginMethod: 'traditional',
  createdAt: new Date().toISOString()
})
localStorage.setItem('users', JSON.stringify(users))
```

### P: Como reseto para estado inicial?
**R:**
```javascript
localStorage.clear()
location.reload()
```

### P: Como testo múltiplos usuários?
**R:** Abra em duas abas, ou limpe e crie novo:
```javascript
localStorage.clear()
// Criar novo usuário
// Aba 1: Login como user1
// Aba 2: Limpar localStorage, criar user2
```

---

## 🎨 Customização

### P: Como mudo as cores do login?
**R:** Edite `src/componentes/Login.css`:
```css
.login-left {
  background: #seu-color; /* Mude a cor aqui */
}
```

### P: Como adiciono um novo método de login?
**R:** 
1. Adicione novo estado `authMode`
2. Crie funções `handleNewMethodCodeSend/Verify`
3. Adicione novo botão social
4. Implemente UI

### P: Como mudo o texto dos erros?
**R:** Procure por `setError()` em `Login.jsx` e customize.

### P: Como mudo a URL de redirect após login?
**R:** Procure por `window.location.href = '/'` em `Login.jsx`:
```javascript
// Altere para:
window.location.href = '/dashboard'
```

---

## 🔧 Desenvolvimento

### P: Como adiciono logs de debug?
**R:**
```javascript
// Em authUtils.js ou Login.jsx:
console.log('[AUTH]', 'Tentando autenticar:', email)
console.log('[AUTH]', 'Usuários encontrados:', users)
console.log('[AUTH]', 'Código gerado:', code)
```

### P: Como debugo erros?
**R:**
```javascript
// Console (F12):
try {
  // seu código
} catch (err) {
  console.error('[ERROR]', err)
}
```

### P: Como vejo o estado atual?
**R:**
```javascript
// Console:
console.log('localStorage:', localStorage)
console.log('users:', JSON.parse(localStorage.getItem('users')))
console.log('authenticated:', !!localStorage.getItem('authToken'))
```

---

## 📱 Mobile

### P: Funciona em mobile?
**R:** Sim, mas:
- Teclado virtual pode cobrir campos
- Entrada de SMS é melhor em mobile
- Considere responsividade

### P: Como testo em mobile?
**R:**
```
Chrome: F12 → Ctrl+Shift+M (toggle mobile)
Firefox: F12 → Ctrl+Shift+M
Safari: Menu → Develop → Enter Responsive Design Mode
```

---

## 🚀 Performance

### P: localStorage é rápido?
**R:** Sim, é síncrono e muito rápido.

### P: Causa problemas com muitos usuários?
**R:** Sim, localStorage fica lento com 10,000+ items.

**Solução para produção:** Use banco de dados.

---

## ❌ Erros Comuns

### Erro: "Cannot read property 'split' of undefined"
**Causa:** Email ou telefone undefined
**Solução:** Validar antes de usar

### Erro: "localStorage.setItem is not a function"
**Causa:** localStorage não suportado (incognito?)
**Solução:** Use navegador normal

### Erro: "Cors error"
**Causa:** Não aplicável (localStorage é local)
**Solução:** Verifique console para erros reais

### Erro: "Maximum call stack size exceeded"
**Causa:** Loop infinito ao redirecionar
**Solução:** Verifique condição de autenticação

---

## 📞 Suporte

Não encontrou resposta? 
1. Verifique o `LOGIN_SYSTEM_README.md`
2. Veja o `QUICK_TEST_GUIDE.md`
3. Execute `TEST_CONSOLE.js` para validar
4. Revise `FLOW_DIAGRAM.md` para fluxo

**Última atualização:** 02/07/2026
