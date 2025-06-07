const express = require('express');
const prisma = require('../scripts/prisma/prismaConfig');
const handleError = require('../utils/exceptions');

const todoRoutes = express.Router();

const validateId = (id, response) => {
  const intId = parseInt(id);
  if (!intId) {
    handleError(response, 400, 'Id is required');
    return null;
  }
  return intId;
};

const findTodoById = async (id, response) => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    handleError(response, 404, 'Todo not found');
    return null;
  }
  return todo;
};

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

todoRoutes.get('/todos', async (request, response) => {
  try {
    const todos = await prisma.todo.findMany();
    return response.status(200).json(todos);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

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
