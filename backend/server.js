import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const PLANOS_VALIDOS = new Set(['basico', 'premium', 'pro']);

const normalizeUser = (user) => ({
 id: user.id,
 username: user.username,
 fullName: user.nome_completo,
 email: user.email,
 phone: user.telefone || '',
 address: user.endereco || '',
 plan: user.plano_atual || 'basico',
 createdAt: user.criado_em
});

const syncClienteFromUsuario = async (usuario) => {
 try {
	const [existing] = await pool.execute(
	 'SELECT id FROM clientes WHERE usuario_id = ? LIMIT 1',
	 [usuario.id]
	);

	if (existing.length > 0) {
		await pool.execute(
			`UPDATE clientes
			 SET nome = ?, email = ?, telefone = ?, endereco = ?, plano_atual = ?
			 WHERE id = ?`,
			[
				usuario.nome_completo,
				usuario.email,
				usuario.telefone || '',
				usuario.endereco || '',
				usuario.plano_atual || 'basico',
				existing[0].id
			]
		);
		return;
	}

	await pool.execute(
		`INSERT INTO clientes (usuario_id, nome, email, telefone, endereco, plano_atual)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		[
			usuario.id,
			usuario.nome_completo,
			usuario.email,
			usuario.telefone || '',
			usuario.endereco || '',
			usuario.plano_atual || 'basico'
		]
	);
 } catch (error) {
	console.error('Falha ao sincronizar cliente:', error.message);
 }
};

const generateToken = (user) => {
 return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
	expiresIn: JWT_EXPIRES_IN
 });
};

const authMiddleware = (req, res, next) => {
 const authHeader = req.headers.authorization || '';
 const [, token] = authHeader.split(' ');

 if (!token) {
	return res.status(401).json({ erro: 'Token de autenticacao ausente' });
 }

 try {
	const payload = jwt.verify(token, JWT_SECRET);
	req.userId = payload.userId;
	return next();
 } catch {
	return res.status(401).json({ erro: 'Token invalido ou expirado' });
 }
};

const optionalAuthMiddleware = (req, res, next) => {
 const authHeader = req.headers.authorization || '';
 const [, token] = authHeader.split(' ');

 if (!token) {
	return next();
 }

 try {
	const payload = jwt.verify(token, JWT_SECRET);
	req.userId = payload.userId;
 } catch {
	req.userId = null;
 }

 return next();
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
 res.json({ mensagem: 'API Casa em Dia rodando' });
});

app.get('/api/health', async (req, res) => {
 try {
	await pool.query('SELECT 1');
	res.json({ ok: true, database: 'connected' });
 } catch (error) {
	res.status(500).json({ ok: false, erro: 'Falha de conexao com banco', detalhes: error.message });
 }
});

app.post('/api/auth/register', async (req, res) => {
	try {
		const { username, fullName, email, password, phone = '', address = '' } = req.body;

		if (!username || !fullName || !email || !password) {
			return res.status(400).json({ erro: 'username, fullName, email e password sao obrigatorios' });
		}

		if (password.length < 6) {
			return res.status(400).json({ erro: 'A senha deve ter ao menos 6 caracteres' });
		}

		const [existing] = await pool.execute(
			'SELECT id FROM usuarios WHERE email = ? OR username = ? LIMIT 1',
			[email.trim().toLowerCase(), username.trim().toLowerCase()]
		);

		if (existing.length > 0) {
			return res.status(409).json({ erro: 'Email ou username ja cadastrado' });
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const [result] = await pool.execute(
			`INSERT INTO usuarios (username, nome_completo, email, senha_hash, telefone, endereco)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[
				username.trim().toLowerCase(),
				fullName.trim(),
				email.trim().toLowerCase(),
				passwordHash,
				phone,
				address
			]
		);

		const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [result.insertId]);
		const user = rows[0];
		await syncClienteFromUsuario(user);

		return res.status(201).json({
			token: generateToken(user),
			user: normalizeUser(user)
		});
	} catch (error) {
		return res.status(500).json({ erro: 'Erro ao criar usuario', detalhes: error.message });
	}
});

app.post('/api/auth/login', async (req, res) => {
	try {
		const { identifier, email, password } = req.body;
		const loginIdentifier = (identifier || email || '').trim().toLowerCase();

		if (!loginIdentifier || !password) {
			return res.status(400).json({ erro: 'Identificador e senha obrigatorios' });
		}

		const [rows] = await pool.execute(
			'SELECT * FROM usuarios WHERE email = ? OR username = ? LIMIT 1',
			[loginIdentifier, loginIdentifier]
		);

		if (rows.length === 0) {
			return res.status(401).json({ erro: 'Credenciais invalidas' });
		}

		const user = rows[0];
		const passwordIsValid = await bcrypt.compare(password, user.senha_hash);

		if (!passwordIsValid) {
			return res.status(401).json({ erro: 'Credenciais invalidas' });
		}

		await syncClienteFromUsuario(user);

		return res.json({
			token: generateToken(user),
			user: normalizeUser(user)
		});
	} catch (error) {
		res.status(500).json({ erro: 'Erro no login', detalhes: error.message });
	}
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
 try {
	const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [req.userId]);
	if (rows.length === 0) {
	 return res.status(404).json({ erro: 'Usuario nao encontrado' });
	}

	await syncClienteFromUsuario(rows[0]);

	return res.json({ user: normalizeUser(rows[0]) });
 } catch (error) {
	return res.status(500).json({ erro: 'Erro ao obter usuario', detalhes: error.message });
 }
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
 try {
  const { fullName, username, email, phone = '', address = '' } = req.body;

  if (!fullName || !username || !email) {
   return res.status(400).json({ erro: 'fullName, username e email sao obrigatorios' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();
  const cleanName = fullName.trim();
  const cleanPhone = String(phone || '').trim();
  const cleanAddress = String(address || '').trim();

  const [existing] = await pool.execute(
   'SELECT id FROM usuarios WHERE (email = ? OR username = ?) AND id <> ? LIMIT 1',
   [cleanEmail, cleanUsername, req.userId]
  );

  if (existing.length > 0) {
   return res.status(409).json({ erro: 'Email ou username ja em uso' });
  }

  await pool.execute(
   `UPDATE usuarios
	SET nome_completo = ?, username = ?, email = ?, telefone = ?, endereco = ?
	WHERE id = ?`,
   [cleanName, cleanUsername, cleanEmail, cleanPhone, cleanAddress, req.userId]
  );

  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [req.userId]);
  const user = rows[0];
  await syncClienteFromUsuario(user);

  return res.json({
   mensagem: 'Perfil atualizado com sucesso',
   user: normalizeUser(user)
  });
 } catch (error) {
  return res.status(500).json({ erro: 'Erro ao atualizar perfil', detalhes: error.message });
 }
});

app.patch('/api/clientes/me/plano', authMiddleware, async (req, res) => {
 try {
  const { plano } = req.body;
  const normalizedPlan = String(plano || '').trim().toLowerCase();

  if (!PLANOS_VALIDOS.has(normalizedPlan)) {
   return res.status(400).json({ erro: 'Plano invalido' });
  }

  await pool.execute('UPDATE usuarios SET plano_atual = ? WHERE id = ?', [normalizedPlan, req.userId]);

  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [req.userId]);
  if (rows.length === 0) {
   return res.status(404).json({ erro: 'Usuario nao encontrado' });
  }

  const user = rows[0];
  await syncClienteFromUsuario(user);

  return res.json({
   mensagem: 'Plano atualizado com sucesso',
   user: normalizeUser(user)
  });
 } catch (error) {
  return res.status(500).json({ erro: 'Erro ao atualizar plano', detalhes: error.message });
 }
});

app.get('/api/tarefas', authMiddleware, async (req, res) => {
 try {
	const [tarefas] = await pool.query(
	 'SELECT id, descricao, status, data_criacao AS dataCriacao FROM tarefas WHERE usuario_id = ? ORDER BY data_criacao DESC',
	 [req.userId]
	);

	res.json(tarefas);
 } catch (error) {
	res.status(500).json({ erro: 'Erro ao buscar tarefas', detalhes: error.message });
 }
});

app.post('/api/tarefas', authMiddleware, async (req, res) => {
 try {
	const { descricao } = req.body;
	if (!descricao || !descricao.trim()) {
	 return res.status(400).json({ erro: 'Descricao obrigatoria' });
	}

	const [result] = await pool.execute(
	 'INSERT INTO tarefas (usuario_id, descricao, status) VALUES (?, ?, ?)',
	 [req.userId, descricao.trim(), false]
	);

	res.status(201).json({
	 id: result.insertId,
	 descricao: descricao.trim(),
	 status: false
	});
 } catch (error) {
	res.status(500).json({ erro: 'Erro ao criar tarefa', detalhes: error.message });
 }
});

app.put('/api/tarefas/:id', authMiddleware, async (req, res) => {
 try {
	const { id } = req.params;
	const { descricao, status } = req.body;
	if (!descricao || typeof status !== 'boolean') {
	 return res.status(400).json({ erro: 'Dados invalidos' });
	}

	const [result] = await pool.execute(
	 'UPDATE tarefas SET descricao = ?, status = ? WHERE id = ? AND usuario_id = ?',
	 [descricao.trim(), status, id, req.userId]
	);

	if (result.affectedRows === 0) {
	 return res.status(404).json({ erro: 'Tarefa nao encontrada' });
	}

	res.json({ mensagem: 'Tarefa atualizada com sucesso' });
 } catch (error) {
	res.status(500).json({ erro: 'Erro ao atualizar tarefa', detalhes: error.message });
 }
});

app.delete('/api/tarefas/:id', authMiddleware, async (req, res) => {
 try {
	const { id } = req.params;
	const [result] = await pool.execute(
	 'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?',
	 [id, req.userId]
	);

	if (result.affectedRows === 0) {
	 return res.status(404).json({ erro: 'Tarefa nao encontrada' });
	}

	res.json({ mensagem: 'Tarefa deletada com sucesso' });
 } catch (error) {
	res.status(500).json({ erro: 'Erro ao deletar tarefa', detalhes: error.message });
 }
});

app.post('/api/agendamentos', optionalAuthMiddleware, async (req, res) => {
 try {
	const { nome, telefone, servico, data, observacoes = '' } = req.body;

	if (!nome || !telefone || !servico || !data) {
	 return res.status(400).json({ erro: 'nome, telefone, servico e data sao obrigatorios' });
	}

	const [result] = await pool.execute(
	 `INSERT INTO agendamentos (usuario_id, nome, telefone, servico, data_desejada, observacoes)
		VALUES (?, ?, ?, ?, ?, ?)`,
	 [req.userId || null, nome.trim(), telefone.trim(), servico.trim(), data, observacoes.trim()]
	);

	return res.status(201).json({
	 id: result.insertId,
	 mensagem: 'Agendamento recebido com sucesso'
	});
 } catch (error) {
	return res.status(500).json({ erro: 'Erro ao criar agendamento', detalhes: error.message });
 }
});

app.get('/api/agendamentos/me', authMiddleware, async (req, res) => {
 try {
	const [rows] = await pool.execute(
	 `SELECT id, nome, telefone, servico, data_desejada AS data, observacoes, status, criado_em AS criadoEm
		FROM agendamentos
		WHERE usuario_id = ?
		ORDER BY criado_em DESC`,
	 [req.userId]
	);

	return res.json(rows);
 } catch (error) {
	return res.status(500).json({ erro: 'Erro ao listar agendamentos', detalhes: error.message });
 }
});

app.listen(PORT, () => {
 console.log(`Servidor rodando na porta ${PORT}`);
});
