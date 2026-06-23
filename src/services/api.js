const API_URL = 'http://localhost:3000/api/tarefas';
export async function buscarTarefas() {
 const resposta = await fetch(API_URL);
 return await resposta.json();
}
export async function criarTarefa(descricao) {
 const resposta = await fetch(API_URL, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({ descricao })
 });
 return await resposta.json();
}
export async function atualizarTarefa(id, descricao, status) {
 const resposta = await fetch(`${API_URL}/${id}`, {
 method: 'PUT',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({ descricao, status })
 });
 return await resposta.json();
}
export async function deletarTarefa(id) {
 const resposta = await fetch(`${API_URL}/${id}`, {
 method: 'DELETE'
 });
 return await resposta.json();
}