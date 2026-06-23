import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
async function setupDatabase() {
 try {
 const connection = await mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 port: Number(process.env.DB_PORT) || 3306
 });
 await connection.query(
 `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
 );
 await connection.query(`USE \`${process.env.DB_NAME}\``);
 await connection.query(`
 CREATE TABLE IF NOT EXISTS tarefas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 descricao VARCHAR(255) NOT NULL,
 status BOOLEAN DEFAULT false,
 data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);
 console.log('Banco e tabela criados com sucesso!');
 await connection.end();
 } catch (error) {
 console.error('Erro ao configurar o banco:', error);
 }
}
setupDatabase();