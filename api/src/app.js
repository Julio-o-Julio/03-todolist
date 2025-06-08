// Importa o framework Express, utilizado para criar o servidor e gerenciar rotas HTTP
const express = require('express');

// Importa o middleware CORS, que permite requisições de diferentes origens (Cross-Origin Resource Sharing)
const cors = require('cors');

// Importa os arquivos de rotas específicas para "todos" e "tags"
const todoRoutes = require('./routes/todoRoutes');
const tagRoutes = require('./routes/tagRoutes');

// Cria uma instância da aplicação Express
const app = express();

// Middleware para habilitar o parsing de requisições com corpo no formato JSON
app.use(express.json());

// Middleware para permitir que a API aceite requisições de origens diferentes (útil para frontend e outras APIs)
app.use(cors());

// Registra as rotas da aplicação relacionadas a tarefas (todos)
app.use(todoRoutes);

// Registra as rotas da aplicação relacionadas a tags
app.use(tagRoutes);

// Rota raiz apenas para verificar se o servidor está no ar (retorna 'up')
app.get('/', (request, response) => {
  return response.json('up');
});

// Exporta a instância do app para ser usada em outro arquivo, geralmente o arquivo principal do servidor (ex: server.js)
module.exports = app;

