// Importa o framework Express para criação de rotas
const express = require('express');

// Importa a instância configurada do Prisma para integração com o banco de dados
const prisma = require('../scripts/prisma/prismaConfig');

// Importa função de tratamento de erros padronizada
const handleError = require('../utils/exceptions');

// Cria um roteador específico para os endpoints relacionados a todo
const todoRoutes = express.Router();

// Verifica se o id foi informado
const validateId = (id, response) => {
  const intId = parseInt(id);
  if (!intId) {
    handleError(response, 400, 'Id is required');
    return null;
  }
  return intId;
};

// Busca um todo pelo id
const findTodoById = async (id, response) => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    handleError(response, 404, 'Todo not found');
    return null;
  }
  return todo;
};

/**
 * @route   POST /todos
 * @desc    Cria um todo.
 * @access  Público
 *
 * @body    {string} name - Name a ser alterado no todo
 * @body    {string} description - Description a ser alterado no todo
 *
 * @returns {Object} 201 - Todo criado
 * @returns {Object} 500 - Erro interno do servidor
 */
todoRoutes.post('/todos', async (request, response) => {
  try {
    const { name, description } = request.body;
    const todo = await prisma.todo.create({
      data: { name, description }
    });

    await prisma.log.create({
      data: {
        table_name: 'Todo',
        action: 'CREATE',
        record_id: todo.id
      }
    });

    return response.status(201).json(todo);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   GET /todos
 * @desc    Retorna todos os todo.
 * @access  Público
 *
 * @returns {Array<Object>} 200 - Lista de todos.
 * @returns {Object} 500 - Erro interno do servidor
 */
todoRoutes.get('/todos', async (request, response) => {
  try {
    const todos = await prisma.todo.findMany();
    return response.status(200).json(todos);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   PUT /todos
 * @desc    Edita um todo.
 * @access  Público
 *
 * @body    {number} id - ID do todo a ser editado
 * @body    {string} name - Name a ser alterado no todo
 * @body    {boolean} status - Status a ser alterado no todo
 * @body    {string} description - Description a ser alterado no todo
 *
 * @returns {Object} 200 - Todo editado
 * @returns {Object} 500 - Erro interno do servidor
 */
todoRoutes.put('/todos', async (request, response) => {
  try {
    const { id, name, status, description } = request.body;
    const intId = validateId(id, response);
    if (intId === null) return;

    const todo = await findTodoById(intId, response);
    if (todo === null) return;

    const alterTodo = await prisma.todo.update({
      where: { id: intId },
      data: { name, status, description }
    });

    await prisma.log.create({
      data: {
        table_name: 'Todo',
        action: 'UPDATE',
        record_id: id
      }
    });

    return response.status(200).json(alterTodo);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   DELETE /todos/:id
 * @desc    Deleta um todo.
 * @access  Público
 *
 * @param    {number} id - ID do todo a ser deletado
 *
 * @returns {Object} 200 - Todo deletado (e o relacionamento com a tag se tiver)
 * @returns {Object} 500 - Erro interno do servidor
 */
todoRoutes.delete('/todos/:id', async (request, response) => {
  try {
    const intId = validateId(request.params.id, response);
    if (intId === null) return;

    const todo = await findTodoById(intId, response);
    if (todo === null) return;

    await prisma.tagTodo.deleteMany({ where: { todoId: intId } });
    await prisma.todo.delete({ where: { id: intId } });

    await prisma.log.create({
      data: {
        table_name: 'Todo',
        action: 'DELETE',
        record_id: intId
      }
    });

    return response.status(200).json({ success: 'Todo deleted' });
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

module.exports = todoRoutes;
