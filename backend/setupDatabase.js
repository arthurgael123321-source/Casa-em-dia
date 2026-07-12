import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function ensureColumn(connection, tableName, columnName, definitionSql) {
 const [rows] = await connection.query(
	`
	 SELECT COUNT(*) AS count
	 FROM INFORMATION_SCHEMA.COLUMNS
	 WHERE TABLE_SCHEMA = ?
		 AND TABLE_NAME = ?
		 AND COLUMN_NAME = ?
	`,
	[DB_NAME, tableName, columnName]
 );

 if (rows[0].count === 0) {
	await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${definitionSql}`);
 }
}

async function hasColumn(connection, tableName, columnName) {
 const [rows] = await connection.query(
	`
	 SELECT COUNT(*) AS count
	 FROM INFORMATION_SCHEMA.COLUMNS
	 WHERE TABLE_SCHEMA = ?
		 AND TABLE_NAME = ?
		 AND COLUMN_NAME = ?
	`,
	[DB_NAME, tableName, columnName]
 );

 return rows[0].count > 0;
}

async function setupDatabase() {
 try {
 const connection = await mysql.createConnection({
 host: DB_HOST,
 user: DB_USER,
 password: DB_PASSWORD,
 port: Number(DB_PORT) || 3306
 });

 await connection.query(
 `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
 );

 await connection.query(`USE \`${DB_NAME}\``);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(60) NOT NULL UNIQUE,
	nome_completo VARCHAR(120) NOT NULL,
	email VARCHAR(120) NOT NULL UNIQUE,
	senha_hash VARCHAR(255) NOT NULL,
	telefone VARCHAR(30) DEFAULT '',
	endereco VARCHAR(255) DEFAULT '',
	plano_atual VARCHAR(20) DEFAULT 'basico',
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 ) ENGINE=InnoDB
 `);

 await ensureColumn(connection, 'usuarios', 'telefone', "telefone VARCHAR(30) DEFAULT ''");
 await ensureColumn(connection, 'usuarios', 'endereco', "endereco VARCHAR(255) DEFAULT ''");
 await ensureColumn(connection, 'usuarios', 'plano_atual', "plano_atual VARCHAR(20) DEFAULT 'basico'");

 await connection.query(`
 CREATE TABLE IF NOT EXISTS clientes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id INT NOT NULL UNIQUE,
	nome VARCHAR(120) NOT NULL,
	email VARCHAR(120) NOT NULL,
	telefone VARCHAR(30) DEFAULT '',
	endereco VARCHAR(255) DEFAULT '',
	plano_atual VARCHAR(20) DEFAULT 'basico',
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX idx_clientes_email (email),
	CONSTRAINT fk_clientes_usuario
	 FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
 ) ENGINE=InnoDB
 `);

 await ensureColumn(connection, 'clientes', 'usuario_id', 'usuario_id INT NULL AFTER id');
 await ensureColumn(connection, 'clientes', 'nome', "nome VARCHAR(120) NOT NULL DEFAULT '' AFTER usuario_id");
 await ensureColumn(connection, 'clientes', 'email', "email VARCHAR(120) NOT NULL DEFAULT '' AFTER nome");
 await ensureColumn(connection, 'clientes', 'telefone', "telefone VARCHAR(30) DEFAULT '' AFTER email");
 await ensureColumn(connection, 'clientes', 'endereco', "endereco VARCHAR(255) DEFAULT '' AFTER telefone");
 await ensureColumn(connection, 'clientes', 'plano_atual', "plano_atual VARCHAR(20) DEFAULT 'basico' AFTER endereco");
 await ensureColumn(connection, 'clientes', 'criado_em', 'criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
 await ensureColumn(connection, 'clientes', 'atualizado_em', 'atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

 await connection.query(`
 CREATE TABLE IF NOT EXISTS tarefas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id INT NOT NULL,
	descricao VARCHAR(255) NOT NULL,
	status BOOLEAN DEFAULT false,
	data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX idx_tarefas_usuario_id (usuario_id),
	CONSTRAINT fk_tarefas_usuario
	 FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
 ) ENGINE=InnoDB
 `);

 await ensureColumn(connection, 'tarefas', 'usuario_id', 'usuario_id INT NULL AFTER id');
 await ensureColumn(connection, 'tarefas', 'data_atualizacao', 'data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

 await connection.query(`
 CREATE TABLE IF NOT EXISTS agendamentos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	usuario_id INT NULL,
	nome VARCHAR(120) NOT NULL,
	telefone VARCHAR(30) NOT NULL,
	servico VARCHAR(120) NOT NULL,
	data_desejada DATE NOT NULL,
	observacoes TEXT,
	status ENUM('pendente','confirmado','cancelado') DEFAULT 'pendente',
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_agendamentos_usuario_id (usuario_id),
	CONSTRAINT fk_agendamentos_usuario
	 FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
 ) ENGINE=InnoDB
 `);

 await ensureColumn(connection, 'agendamentos', 'usuario_id', 'usuario_id INT NULL AFTER id');
 await ensureColumn(connection, 'agendamentos', 'nome', "nome VARCHAR(120) NOT NULL DEFAULT '' AFTER usuario_id");
 await ensureColumn(connection, 'agendamentos', 'telefone', "telefone VARCHAR(30) NOT NULL DEFAULT '' AFTER nome");
 await ensureColumn(connection, 'agendamentos', 'servico', "servico VARCHAR(120) NOT NULL DEFAULT '' AFTER telefone");
 await ensureColumn(connection, 'agendamentos', 'data_desejada', "data_desejada DATE NULL AFTER servico");
 await ensureColumn(connection, 'agendamentos', 'observacoes', 'observacoes TEXT AFTER data_desejada');
 await ensureColumn(connection, 'agendamentos', 'status', "status ENUM('pendente','confirmado','cancelado') DEFAULT 'pendente'");
 await ensureColumn(connection, 'agendamentos', 'criado_em', 'criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

 if (await hasColumn(connection, 'agendamentos', 'cliente_id')) {
  await connection.query('ALTER TABLE agendamentos MODIFY COLUMN cliente_id INT NULL');
 }

 console.log('Banco e tabelas configurados com sucesso!');
 await connection.end();
 } catch (error) {
 console.error('Erro ao configurar o banco:', error);
 process.exitCode = 1;
 }
}
setupDatabase();