import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
 res.json({ mensagem: 'API de tarefas rodando!' });
});
app.get('/api/tarefas', async (req, res) => {
 try {
 const [tarefas] = await pool.query(
 'SELECT * FROM tarefas ORDER BY data_criacao DESC'
 );
 res.json(tarefas);
 } catch {
 res.status(500).json({ erro: 'Erro ao buscar tarefas' });
 }
});
// Rota de login (mock) para autenticação
app.post('/api/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ erro: 'Email e senha obrigatorios' });
		}

		// Aqui você pode implementar verificação com DB.
		// Por enquanto, retornamos um token mock baseado em base64.
		const token = Buffer.from(`${email}:${password}`).toString('base64');
		return res.json({ token, email });
	} catch {
		res.status(500).json({ erro: 'Erro no login' });
	}
});
app.post('/api/tarefas', async (req, res) => {
 try {
 const { descricao } = req.body;
 if (!descricao || !descricao.trim()) {
 return res.status(400).json({ erro: 'Descricao obrigatoria' });
 }
 const [result] = await pool.execute(
 'INSERT INTO tarefas (descricao) VALUES (?)',
 [descricao]
 );
 res.status(201).json({
 id: result.insertId,
 descricao,
 status: false
 });
 } catch {
 res.status(500).json({ erro: 'Erro ao criar tarefa' });
 }
});
app.put('/api/tarefas/:id', async (req, res) => {
 try {
 const { id } = req.params;
 const { descricao, status } = req.body;
 if (!descricao || typeof status !== 'boolean') {
 return res.status(400).json({ erro: 'Dados invalidos' });
 }
 const [result] = await pool.execute(
 'UPDATE tarefas SET descricao = ?, status = ? WHERE id = ?',
 [descricao, status, id]
 );
 if (result.affectedRows === 0) {
 return res.status(404).json({ erro: 'Tarefa nao encontrada' });
 }
 res.json({ mensagem: 'Tarefa atualizada com sucesso' });
 } catch {
 res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
 }
});
app.delete('/api/tarefas/:id', async (req, res) => {
 try {
 const { id } = req.params;
 const [result] = await pool.execute(
 'DELETE FROM tarefas WHERE id = ?',
 [id]
 );
 if (result.affectedRows === 0) {
 return res.status(404).json({ erro: 'Tarefa nao encontrada' });
 }
 res.json({ mensagem: 'Tarefa deletada com sucesso' });
 } catch {
 res.status(500).json({ erro: 'Erro ao deletar tarefa' });
 }
});
app.listen(PORT, () => {
 console.log(`Servidor rodando na porta ${PORT}`);
});
