const express = require('express');
const prisma = require('../scripts/prisma/prismaConfig');
const handleError = require('../utils/exceptions');

const logRoutes = express.Router();

logRoutes.get('/logs', async (request, response) => {
  try {
    const logs = await prisma.log.findMany();

    return response.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return handleError(response, 500, 'Internal Server Error');
  }
});

module.exports = logRoutes;
