// Importa o framework Express para criação de rotas
const express = require('express');

// Importa a instância configurada do Prisma para integração com o banco de dados
const prisma = require('../scripts/prisma/prismaConfig');

// Importa função de tratamento de erros padronizada
const handleError = require('../utils/exceptions');

// Cria um roteador específico para os endpoints relacionados a tags
const tagRoutes = express.Router();

/**
 * @route   POST /tags
 * @desc    Cria uma nova tag e, opcionalmente, associa-a a uma tarefa existente.
 * @access  Público
 *
 * @body    {string} name - Nome da tag
 * @body    {string} color - Cor representativa da tag
 * @body    {number} [todoId] - ID opcional de uma tarefa à qual a tag será associada
 *
 * @returns {Object} 201 - Tag criada (e associação com tarefa, se aplicável)
 * @returns {Object} 404 - Tarefa não encontrada
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.post('/tags', async (request, response) => {
  try {
    const { name, color, todoId } = request.body;

    if (todoId) {
      const todo = await prisma.todo.findUnique({ where: { id: todoId } });
      if (!todo) return handleError(response, 404, 'Todo not found');
    }

    const tag = await prisma.tag.create({
      data: { name, color }
    });

    await prisma.log.create({
      data: {
        table_name: 'Tag',
        action: 'CREATE',
        record_id: tag.id
      }
    });

    if (todoId) {
      const tagTodo = await prisma.tagTodo.create({
        data: {
          todo: { connect: { id: todoId } },
          tag: { connect: { id: tag.id } }
        }
      });

      return response.status(201).json({ tag, tagTodo });
    } else {
      return response.status(201).json({ tag });
    }
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   GET /tags
 * @desc    Retorna todas as tags existentes ou apenas as associadas a uma tarefa específica.
 * @access  Público
 *
 * @query   {number} [todoId] - ID opcional da tarefa para filtrar as tags relacionadas
 *
 * @returns {Array<Object>} 200 - Lista de tags
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.get('/tags', async (request, response) => {
  try {
    const { todoId } = request.query;

    const tags = todoId
      ? await prisma.tag.findMany({
          where: { tagTodo: { some: { todoId: parseInt(todoId) } } }
        })
      : await prisma.tag.findMany();

    return response.status(200).json(tags);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   GET /tags/:todoId
 * @desc    Retorna todas as tags associadas a uma tarefa específica.
 * @access  Público
 *
 * @param   {number} todoId - ID da tarefa
 *
 * @returns {Array<Object>} 200 - Lista de tags relacionadas à tarefa
 * @returns {Object} 404 - Tarefa não encontrada
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.get('/tags/:todoId', async (request, response) => {
  try {
    const { todoId } = request.params;
    if (!todoId) return handleError(response, 400, 'todoId is required');

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(todoId) }
    });
    if (!todo) return handleError(response, 404, 'Todo not found');

    const tags = await prisma.tag.findMany({
      where: { tagTodo: { some: { todoId: parseInt(todoId) } } }
    });

    return response.status(200).json(tags);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   PUT /tags
 * @desc    Atualiza informações de uma tag e pode associá-la a uma tarefa, se necessário.
 * @access  Público
 *
 * @body    {number} id - ID da tag a ser atualizada
 * @body    {string} name - Novo nome da tag
 * @body    {string} [color] - Nova cor da tag
 * @body    {number} [todoId] - ID opcional de tarefa para associar à tag
 *
 * @returns {Object} 200 - Tag atualizada (e nova associação, se houver)
 * @returns {Object} 404 - Tag ou tarefa não encontrada
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.put('/tags', async (request, response) => {
  try {
    let newTagTodo = null;

    const { id, name, color, todoId } = request.body;

    if (!id) return handleError(response, 400, 'Id is required');

    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) return handleError(response, 404, 'Tag not found');

    if (todoId) {
      const todo = await prisma.todo.findUnique({ where: { id: todoId } });
      if (!todo) return handleError(response, 404, 'Todo not exists');

      const tagTodo = await prisma.tagTodo.findFirst({
        where: { todoId, tagId: tag.id }
      });

      if (!tagTodo) {
        newTagTodo = await prisma.tagTodo.create({
          data: { todo: { connect: { id: todoId } }, tag: { connect: { id } } }
        });
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name, color: color || tag.color }
    });

    await prisma.log.create({
      data: {
        table_name: 'Tag',
        action: 'UPDATE',
        record_id: id
      }
    });

    if (newTagTodo)
      return response.status(200).json({ updatedTag, newTagTodo });
    return response.status(200).json(updatedTag);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   DELETE /tags/:id
 * @desc    Remove uma tag do sistema e suas associações com tarefas.
 * @access  Público
 *
 * @param   {number} id - ID da tag a ser removida
 *
 * @returns {Object} 200 - Confirmação da remoção
 * @returns {Object} 404 - Tag não encontrada
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.delete('/tags/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const intId = parseInt(id);

    if (!intId) return handleError(response, 400, 'Id is required');

    const tag = await prisma.tag.findUnique({ where: { id: intId } });
    if (!tag) return handleError(response, 404, 'Tag not exists');

    await prisma.tagTodo.deleteMany({ where: { tagId: intId } });
    await prisma.tag.delete({ where: { id: intId } });

    await prisma.log.create({
      data: {
        table_name: 'Tag',
        action: 'DELETE',
        record_id: intId
      }
    });

    return response.status(200).json({ success: 'Tag deleted' });
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   POST /tag-todos
 * @desc    Cria uma associação entre uma tag e uma tarefa (relacionamento tagTodo).
 * @access  Público
 *
 * @body    {number} tagId - ID da tag
 * @body    {number} todoId - ID da tarefa
 *
 * @returns {Object} 201 - Associação criada com sucesso
 * @returns {Object} 404 - Tag ou tarefa não encontrada
 * @returns {Object} 409 - Associação já existe
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.post('/tag-todos', async (request, response) => {
  try {
    const { tagId, todoId } = request.body;

    if (!tagId || !todoId)
      return handleError(response, 400, 'Both tagId and todoId are required');

    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) return handleError(response, 404, 'Tag not found');

    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo) return handleError(response, 404, 'Todo not found');

    const existingTagTodo = await prisma.tagTodo.findFirst({
      where: { tagId: tag.id, todoId: todo.id }
    });

    if (existingTagTodo)
      return handleError(response, 409, 'TagTodo relation already exists');

    const tagTodo = await prisma.tagTodo.create({
      data: {
        todo: { connect: { id: todoId } },
        tag: { connect: { id: tagId } }
      }
    });

    return response.status(201).json(tagTodo);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

/**
 * @route   DELETE /tag-todos/:tagId/:todoId
 * @desc    Remove a associação entre uma tag e uma tarefa específica.
 * @access  Público
 *
 * @param   {number} tagId - ID da tag
 * @param   {number} todoId - ID da tarefa
 *
 * @returns {Object} 200 - Associação removida com sucesso
 * @returns {Object} 404 - Associação, tag ou tarefa não encontrada
 * @returns {Object} 500 - Erro interno do servidor
 */
tagRoutes.delete('/tag-todos/:tagId/:todoId', async (request, response) => {
  try {
    const { tagId, todoId } = request.params;

    if (!tagId || !todoId)
      return handleError(response, 400, 'Both tagId and todoId are required');

    const tag = await prisma.tag.findUnique({ where: { id: parseInt(tagId) } });
    if (!tag) return handleError(response, 404, 'Tag not found');

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(todoId) }
    });
    if (!todo) return handleError(response, 404, 'Todo not found');

    const existingTagTodo = await prisma.tagTodo.findFirst({
      where: { tagId: tag.id, todoId: todo.id }
    });

    if (existingTagTodo) {
      await prisma.tagTodo.delete({ where: { id: existingTagTodo.id } });
      return response.status(200).json('TagTodo relation deleted');
    }

    return handleError(response, 404, 'TagTodo relation not found');
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

module.exports = tagRoutes;
