// Importa o framework Express para criação de rotas
const express = require('express');

// Importa a instância configurada do Prisma para integração com o banco de dados
const prisma = require('../scripts/prisma/prismaConfig');

// Importa função de tratamento de erros padronizada
const handleError = require('../utils/exceptions');

// Cria um roteador específico para os endpoints relacionados a logs
const logRoutes = express.Router();

/**
 * @route   GET /logs
 * @desc    Retorna todos os registros de logs armazenados no banco de dados.
 * @access  Público (ou pode ser ajustado conforme regras de autenticação)
 *
 * @returns {Array<Object>} 200 - Lista de objetos de log em formato JSON
 * @returns {Object} 500 - Erro interno do servidor, com mensagem padronizada
 *
 * Integração: Utiliza o ORM Prisma para acessar a tabela 'log' no banco de dados.
 */
logRoutes.get('/logs', async (request, response) => {
  try {
    // Busca todos os registros da tabela de logs usando o Prisma
    const logs = await prisma.log.findMany();

    // Retorna os logs encontrados com status 200 (OK)
    return response.status(200).json(logs);
  } catch (error) {
    // Em caso de erro, exibe no console para debug e retorna status 500
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

// Exporta o conjunto de rotas relacionadas a logs para uso em outros arquivos
module.exports = logRoutes;
