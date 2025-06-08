# 03-todolist

### Projeto ToDo List – GCS UFMS 2025

Este é um sistema de gerenciamento de tarefas que permite aos usuários criar, editar, excluir e organizar tarefas.  
O sistema também possui suporte a tags, permitindo categorizar tarefas com etiquetas personalizadas e coloridas.  
Desenvolvido como parte da Prova Parcial 2 da disciplina Gerência de Configuração de Software (GCS) na Faculdade de Computação – UFMS.  
O projeto simula diferentes fluxos de trabalho em equipe utilizando GitHub Flow, Git Flow e Trunk-Based Development.

### Tecnologias Utilizadas:

- Frontend: React + Vite
- Backend: Node.js + Express
- ORM: Prisma
- Banco de dados: SQLite

### Como rodar o projeto na sua máquina

Abra o terminal em uma pasta de sua escolha e faça o clone do repositório rodando este código:

> git clone https://github.com/Julio-o-Julio/03-todolist

Após clonar o repositório, entre na pasta do repositório rodando o comando ainda no seu terminal:

> cd ./03-todolist

Agora abra mais um terminal, um para o Backend e outro para o Frontend.

Após abir mais um terminal rode o seguinte comando em um dos terminais:

> cd ./api

Agora altere o nome do arquivo ".env.exemple" para ".env" e rode os seguintes comandos no terminal:

> npx prisma generate

> npm run dev

No outro terminal rode os seguintes comandos:

> cd ./front

> npm install

> npm run dev

Para abrir o projeto no seu navegador, basta entrar nesta url: http://localhost:5173/

### Estrutura Básica do Projeto:

.
├── backend
│ ├── src
│ ├── prisma
│ └── package.json
├── frontend
│ ├── src
│ └── package.json
└── README.md
