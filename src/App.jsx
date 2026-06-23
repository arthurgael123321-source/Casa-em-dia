import { useEffect, useState } from 'react';
import {
 buscarTarefas,
 criarTarefa,
 atualizarTarefa,
 deletarTarefa
} from './services/api';
function App() {
 const [tarefas, setTarefas] = useState([]);
 const [descricao, setDescricao] = useState('');
 useEffect(() => {
 carregarTarefas();
 }, []);
 async function carregarTarefas() {
 const dados = await buscarTarefas();
 setTarefas(dados);
 }
 async function adicionarTarefa(event) {
 event.preventDefault();
 if (!descricao.trim()) return;
 await criarTarefa(descricao);
 setDescricao('');
 carregarTarefas();
 }
 async function alternarStatus(tarefa) {
 await atualizarTarefa(
 tarefa.id,
 tarefa.descricao,
 !tarefa.status
 );
 carregarTarefas();
 }
 async function excluirTarefa(id) {
 await deletarTarefa(id);
 carregarTarefas();
 }
 return (
 <div>
 <h1>Lista de Tarefas</h1>
 <form onSubmit={adicionarTarefa}>
 <input
 value={descricao}
 onChange={(event) => setDescricao(event.target.value)}
 placeholder="Digite uma tarefa"
 />
 <button type="submit">Adicionar</button>
 </form>
 <ul>
 {tarefas.map((tarefa) => (
 <li key={tarefa.id}>
 <span>
 {tarefa.descricao} - {tarefa.status ? 'Concluida' : 'Pendente'}
 </span>
 <button onClick={() => alternarStatus(tarefa)}>
 Alterar status
 </button>
 <button onClick={() => excluirTarefa(tarefa.id)}>
 Excluir
 </button>
 </li>
 ))}
 </ul>
 </div>
 );
}
export default App;
