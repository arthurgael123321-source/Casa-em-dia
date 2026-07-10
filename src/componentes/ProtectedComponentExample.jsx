/**
 * Exemplo de Componente Protegido
 * Mostra como usar autenticação em outros componentes
 */

import { useState, useEffect } from 'react'
import {
  getCurrentUser,
  isAuthenticated,
  logout,
  getAllUsers
} from '../services/authUtils'

/**
 * Hook para proteger componentes que requerem autenticação
 */
export const useAuth = () => {
  return getCurrentUser()
}

/**
 * Componente de exemplo: Dashboard do usuário
 * Este componente é protegido e só aparece se o usuário estiver autenticado
 */
export function ProtectedExample() {
  const user = useAuth()

  if (!user) {
    return <div>Carregando...</div>
  }

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja fazer logout?')) {
      logout()
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Bem-vindo, {user.username}!</h1>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section>
        <h2>Seus dados</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </section>

      <AdminSection />
    </div>
  )
}

/**
 * Componente para listar todos os usuários (apenas admin)
 */
function AdminSection() {
  const users = getAllUsers()

  return (
    <section>
      <h2>Usuários Registrados ({users.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Método de Login</th>
            <th>Data de Criação</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.loginMethod || 'traditional'}</td>
              <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

/**
 * Componente condicional: mostra conteúdo diferentes baseado em autenticação
 */
export function ConditionalContent() {
  const isLoggedIn = isAuthenticated()
  const user = getCurrentUser()

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Você está logado como: <strong>{user.username}</strong></p>
          <button onClick={logout}>Fazer Logout</button>
        </div>
      ) : (
        <div>
          <p>Você não está autenticado</p>
          <a href="/login">Ir para Login</a>
        </div>
      )}
    </div>
  )
}

/**
 * Componente para atualizar perfil (exemplo)
 */
export function UpdateProfileExample() {
  const user = useAuth()
  const [username, setUsername] = useState(user.username)

  const handleUpdate = () => {
    // Simulado - em produção, chamar API
    console.log(`Atualizando username para: ${username}`)
    // updateCurrentUserField('username', username)
    alert('Perfil atualizado! (simulado)')
  }

  return (
    <form>
      <h2>Atualizar Perfil</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Novo username"
      />
      <button type="button" onClick={handleUpdate}>
        Atualizar
      </button>
    </form>
  )
}

/**
 * Componente: Verificar permissões
 */
export function PermissionExample() {
  const user = getCurrentUser()

  const hasPermission = () => {
    // Exemplo: checar se usuário tem certas permissões
    // Em produção, isso viria do servidor
    return true
  }

  if (!user) return null

  return (
    <div>
      {hasPermission('admin') && (
        <div>
          <h3>Painel de Admin</h3>
          <p>Você tem acesso ao painel administrativo</p>
        </div>
      )}
    </div>
  )
}

/**
 * Exemplo de uso em useEffect
 */
export function ExampleUseEffect() {
  useEffect(() => {
    // Verificar autenticação ao montar
    if (!isAuthenticated()) {
      console.log('Usuário não autenticado')
      return
    }

    const user = getCurrentUser()
    console.log('Usuário autenticado:', user.email)

    // Buscar dados específicos do usuário
    // fetch(`/api/user/${user.email}`)
  }, [])

  return <div>Componente com verificação de autenticação</div>
}

/**
 * Wrapper para rotas protegidas
 */
export function PrivateRoute({ Component, ...props }) {
  if (!isAuthenticated()) {
    return <a href="#login">Ir para login</a>
  }

  return <Component {...props} />
}

// ==========================================
// EXEMPLOS DE USO
// ==========================================

/*
 * 1. Importar utilitários de auth em qualquer componente:
 * 
 *    import { isAuthenticated, getCurrentUser, logout } from '../services/authUtils'
 * 
 * 2. Usar em um componente funcional:
 * 
 *    function MyComponent() {
 *      const user = useAuth() // Protege o componente
 *      
 *      if (!user) return <Loading />
 *      
 *      return <div>Bem-vindo, {user.username}!</div>
 *    }
 * 
 * 3. Usar em rotas (em seu arquivo de rotas):
 * 
 *    import { PrivateRoute } from './PrivateRoute'
 *    import Dashboard from './pages/Dashboard'
 *    
 *    <Route 
 *      path="/dashboard" 
 *      element={<PrivateRoute Component={Dashboard} />} 
 *    />
 * 
 * 4. Fazer logout:
 * 
 *    import { logout } from '../services/authUtils'
 *    
 *    const handleLogout = () => {
 *      logout() // Limpa dados e redireciona para /login
 *    }
 * 
 * 5. Listar usuários (para admin):
 * 
 *    import { getAllUsers } from '../services/authUtils'
 *    
 *    const users = getAllUsers()
 *    users.forEach(user => console.log(user.email))
 */
