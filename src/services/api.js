const RAW_BASE = import.meta.env.VITE_API_URL || 'https://casa-em-dia.onrender.com/api'
const BASE = (() => {
	const sanitizedBase = RAW_BASE.replace(/\/+$/, '')
	return /\/api$/i.test(sanitizedBase) ? sanitizedBase : `${sanitizedBase}/api`
})()

const readAuthToken = () => (
	window.localStorage.getItem('authToken') || window.sessionStorage.getItem('authToken') || ''
)

const parseResponse = async (response, fallbackMessage) => {
	const body = await response.json().catch(() => ({}))

	if (!response.ok) {
		const errorText = body.erro || fallbackMessage
		const detailsText = body.detalhes ? ` (${body.detalhes})` : ''
		throw new Error(`${errorText}${detailsText}`)
	}

	return body
}

const buildAuthHeaders = () => {
	const token = readAuthToken()

	if (!token) {
		return { 'Content-Type': 'application/json' }
	}

	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
}

export async function login(identifier, password) {
	const response = await fetch(`${BASE}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password }),
	})

	return parseResponse(response, 'Erro ao autenticar')
}

export async function loginWithGoogle(credential) {
	const response = await fetch(`${BASE}/auth/google`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ credential }),
	})

	return parseResponse(response, 'Erro ao autenticar com Google')
}

export async function register({ username, fullName, email, password }) {
	const response = await fetch(`${BASE}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, fullName, email, password }),
	})

	return parseResponse(response, 'Erro ao cadastrar usuario')
}

export async function atualizarPerfil(payload) {
	const response = await fetch(`${BASE}/auth/me`, {
		method: 'PUT',
		headers: buildAuthHeaders(),
		body: JSON.stringify(payload),
	})

	return parseResponse(response, 'Erro ao atualizar perfil')
}

export async function atualizarPlano(plano) {
	const response = await fetch(`${BASE}/clientes/me/plano`, {
		method: 'PATCH',
		headers: buildAuthHeaders(),
		body: JSON.stringify({ plano }),
	})

	return parseResponse(response, 'Erro ao atualizar plano')
}

const API_URL = `${BASE}/tarefas`

export async function buscarTarefas() {
	const response = await fetch(API_URL, {
		headers: buildAuthHeaders(),
	})

	return parseResponse(response, 'Erro ao buscar tarefas')
}

export async function criarTarefa(descricao) {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: buildAuthHeaders(),
		body: JSON.stringify({ descricao }),
	})

	return parseResponse(response, 'Erro ao criar tarefa')
}

export async function atualizarTarefa(id, descricao, status) {
	const response = await fetch(`${API_URL}/${id}`, {
		method: 'PUT',
		headers: buildAuthHeaders(),
		body: JSON.stringify({ descricao, status }),
	})

	return parseResponse(response, 'Erro ao atualizar tarefa')
}

export async function deletarTarefa(id) {
	const response = await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
		headers: buildAuthHeaders(),
	})

	return parseResponse(response, 'Erro ao deletar tarefa')
}

export async function criarAgendamento(dadosAgendamento) {
	const response = await fetch(`${BASE}/agendamentos`, {
		method: 'POST',
		headers: buildAuthHeaders(),
		body: JSON.stringify(dadosAgendamento),
	})

	return parseResponse(response, 'Erro ao criar agendamento')
}