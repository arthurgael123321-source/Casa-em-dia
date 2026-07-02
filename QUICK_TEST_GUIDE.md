# 🧪 Guia Rápido de Testes

## ⚡ Teste Rápido em 5 Minutos

### Passo 1: Abrir o Login
```
Navegue até: http://localhost:5173/login (ou sua URL)
```

### Passo 2: Criar Novo Usuário
```
1. Clicar em "Não tem conta? Crie uma"
2. Preencher:
   - Username: demo_user
   - Email: demo@teste.com
   - Senha: Demo123
   - Confirmar: Demo123
3. ✓ Aceitar termos
4. Clicar "Criar Conta"
5. ✅ Deve entrar automaticamente
```

### Passo 3: Fazer Logout e Testar Google
```
1. Abrir DevTools (F12) → Console
2. Digite: localStorage.removeItem('authToken'); location.reload()
3. Página recarrega, volta para login
4. Clicar "Entrar com Google"
5. Digitar: teste@gmail.com
6. Clicar "Enviar Código"
7. Código aparece na tela (ex: 456789)
8. Copiar e colar no campo
9. Clicar "Verificar Código"
10. ✅ Deve entrar
```

### Passo 4: Testar SMS
```
1. Abrir DevTools → Console
2. Digite: localStorage.removeItem('authToken'); location.reload()
3. Clicar "Entrar com Telefone"
4. Digitar: (51) 98765-4321
5. Clicar "Enviar Código"
6. Código aparece (ex: 123456)
7. Digitar no campo
8. Clicar "Verificar Código"
9. ✅ Deve entrar
```

---

## 🔍 Verificação no localStorage

### Abrir DevTools
```
F12 ou Clique direito → Inspecionar → Application (Chrome/Edge) ou Storage (Firefox)
```

### Ver usuários cadastrados
```
1. Ir para "Local Storage"
2. Clicar na URL do site
3. Procurar por "users"
4. Deve ver um array JSON com todos os usuários
```

### Ver sessão autenticada
```
localStorage.authToken    ← Token de autenticação
localStorage.userEmail    ← Email do logado
localStorage.username     ← Username do logado
```

---

## ❌ Se Algo Não Funcionar

### Problema: Página fica em branco
**Solução:**
```javascript
// No console:
localStorage.clear()
location.reload()
```

### Problema: Código não aparece
**Solução:**
```
1. Verifique se clicou em "Enviar Código"
2. Abra o console (F12) e procure por erros
3. Tente outro método de login
```

### Problema: Botão "Entrar" desabilitado
**Solução:**
```
1. Aceite os termos de serviço (checkbox)
2. Preencha todos os campos obrigatórios
3. Verifique formatação (email, telefone)
```

### Problema: Telefone não aceita
**Solução - Formatos aceitos:**
```
✅ (51) 98765-4321   (com parênteses e hífen)
✅ 51 98765-4321     (com espaço e hífen)
✅ 5198765-4321      (sem espaço, com hífen)
✅ 51987654321       (apenas números - sem formatação)

❌ (51) 34567-8901   (sem 9 na sequência)
❌ (51) 98765-321    (menos de 4 dígitos finais)
❌ 51 98765          (incompleto)
```

---

## 📊 Casos de Teste Sugeridos

### Teste 1: Login Novo Usuário ✅
- [ ] Ir para "Não tem conta?"
- [ ] Preencher todos os campos
- [ ] Aceitar termos
- [ ] Clicar "Criar Conta"
- [ ] Verificar se entrou
- [ ] Ver em localStorage.users

### Teste 2: Login Usuário Existente ✅
- [ ] Voltar para tela de login
- [ ] Preencher email/username e senha
- [ ] Aceitar termos
- [ ] Clicar "Entrar"
- [ ] Verificar se entrou

### Teste 3: Senha Incorreta ❌
- [ ] Preencher email correto
- [ ] Digitar senha errada
- [ ] Clicar "Entrar"
- [ ] Deve mostrar erro: "Senha incorreta"

### Teste 4: Email não registrado ❌
- [ ] Preencher email que não existe
- [ ] Digitar qualquer senha
- [ ] Clicar "Entrar"
- [ ] Deve mostrar erro: "não encontrado"

### Teste 5: Criar conta com email duplicado ❌
- [ ] Ir para "Não tem conta?"
- [ ] Usar email já existente
- [ ] Preencher outros dados
- [ ] Clicar "Criar Conta"
- [ ] Deve mostrar erro: "já cadastrado"

### Teste 6: Google com código certo ✅
- [ ] Clicar "Entrar com Google"
- [ ] Digitar email
- [ ] Clicar "Enviar Código"
- [ ] Copiar código que aparece
- [ ] Digitar código correto
- [ ] Clicar "Verificar"
- [ ] Deve entrar

### Teste 7: Google com código errado ❌
- [ ] Clicar "Entrar com Google"
- [ ] Digitar email
- [ ] Clicar "Enviar Código"
- [ ] Digitar código errado
- [ ] Clicar "Verificar"
- [ ] Deve mostrar: "Código incorreto"

### Teste 8: Facebook ✅
- [ ] Mesmos passos que Google

### Teste 9: SMS com telefone válido ✅
- [ ] Clicar "Entrar com Telefone"
- [ ] Digitar: (51) 98765-4321
- [ ] Clicar "Enviar Código"
- [ ] Código aparece
- [ ] Digitar código
- [ ] Clicar "Verificar"
- [ ] Deve entrar

### Teste 10: SMS com telefone inválido ❌
- [ ] Clicar "Entrar com Telefone"
- [ ] Digitar: (51) 34567-8901 (sem 9)
- [ ] Clicar "Enviar Código"
- [ ] Deve mostrar: "Número inválido"

### Teste 11: Logout ✅
- [ ] Estar logado
- [ ] Abrir console (F12)
- [ ] Digitar: `localStorage.removeItem('authToken'); location.reload()`
- [ ] Deve voltar para tela de login
- [ ] localStorage.authToken deve estar vazio

### Teste 12: Lembrar de Mim ✅
- [ ] Fazer login
- [ ] ✓ Marcar "Lembrar de mim"
- [ ] Fazer logout
- [ ] localStorage.rememberMe deve = "true"

---

## 🛠️ Comandos Úteis para Console

### Ver todos os usuários
```javascript
JSON.parse(localStorage.getItem('users'))
```

### Ver usuário autenticado
```javascript
{
  token: localStorage.getItem('authToken'),
  email: localStorage.getItem('userEmail'),
  username: localStorage.getItem('username')
}
```

### Limpar tudo
```javascript
localStorage.clear()
location.reload()
```

### Autenticar sem login
```javascript
localStorage.setItem('authToken', 'token_teste')
localStorage.setItem('userEmail', 'teste@email.com')
localStorage.setItem('username', 'teste_user')
location.reload()
```

### Gerar código de teste
```javascript
Math.floor(100000 + Math.random() * 900000)
```

### Adicionar usuário de teste
```javascript
const users = JSON.parse(localStorage.getItem('users') || '[]')
users.push({
  id: Date.now(),
  username: 'admin',
  email: 'admin@teste.com',
  password: 'admin123',
  loginMethod: 'traditional',
  createdAt: new Date().toISOString()
})
localStorage.setItem('users', JSON.stringify(users))
```

---

## 📋 Checklist de Funcionalidades

### Login Tradicional
- [ ] Validação de email
- [ ] Validação de senha (mínimo 6)
- [ ] Confirmação de senha no cadastro
- [ ] Erro quando campos vazios
- [ ] Erro quando email duplicado
- [ ] Erro quando senha incorreta
- [ ] Criar novo usuário
- [ ] Fazer login com email
- [ ] Fazer login com username
- [ ] Toggle entre criar/entrar
- [ ] Checkbox termos de serviço
- [ ] Checkbox lembrar de mim

### Login Google
- [ ] Validação de email
- [ ] Botão "Enviar Código"
- [ ] Código aleatório gerado
- [ ] Código exibido na tela
- [ ] Campo para digitar código
- [ ] Validação de código
- [ ] Erro código incorreto
- [ ] Criar usuário automaticamente
- [ ] Fazer login com existente
- [ ] Botão voltar

### Login Facebook
- [ ] Mesmas funcionalidades do Google

### Login SMS
- [ ] Validação de telefone BR
- [ ] Formatação automática de telefone
- [ ] Suporte para DDD
- [ ] Código aleatório gerado
- [ ] Código exibido na tela
- [ ] Campo para digitar código
- [ ] Validação de código
- [ ] Criar usuário automaticamente
- [ ] Fazer login com existente
- [ ] Botão voltar

### localStorage
- [ ] Usuários persistem após reload
- [ ] Autenticação persiste
- [ ] Logout limpa dados
- [ ] Dados estruturados corretamente

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console (F12) para erros
2. Limpe localStorage: `localStorage.clear()`
3. Recarregue a página: `F5`
4. Tente um navegador diferente

**Tudo funcionando? Parabéns! 🎉**
