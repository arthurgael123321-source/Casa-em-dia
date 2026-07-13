# Casa em Dia

Sistema desenvolvido para gerenciar os serviços prestados pela empresa Casa em Dia.

## Sobre a empresa

A Casa em Dia é uma empresa especializada em serviços domésticos, oferecendo limpeza residencial, manutenção, pequenos consertos e outros serviços para facilitar o dia a dia de seus clientes.

## Objetivo do sistema

O sistema tem como objetivo facilitar o gerenciamento dos serviços da empresa. Ele permitirá cadastrar clientes, funcionários, serviços, agendamentos e acompanhar o andamento de cada atendimento.

## Integrantes

- Arthur Gonçalves
- Renan Kael
- Vinicius Gabriel
- Djony
- João Marchi

## Tecnologias utilizadas

- React
- Vite
- Node.js
- Express
- MySQL
- mysql2
- GitHub

## Como instalar e executar

Clone o repositório:

```bash
git clone https://github.com/arthurgael123321-source/Casa-em-dia.git
```

Entre na pasta:

```bash
cd casa-em-dia
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

Backend (na mesma pasta do projeto):

```bash
npm run setup-db
npm run server
```

Frontend + backend juntos:

```bash
npm run dev:all
```

## Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=
```

## Status do projeto

Projeto em desenvolvimento.