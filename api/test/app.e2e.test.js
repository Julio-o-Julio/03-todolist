const request = require('supertest');
const app = require('../src/app');

const prisma = require('../src/scripts/prisma/prismaConfig');

describe('Teste API (e2e)', () => {
  it('GET / deve retornar uma string "up" ', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual('up');
  });
});

describe('Teste logs (e2e)', () => {
  it('GET /logs deve retornar um vetor com logs ', async () => {
    const res = await request(app).get('/logs');
    expect(res.statusCode).toBe(200);
    res.body.length > 0
      ? expect(res.body[0]).toHaveProperty('table_name')
      : expect(res.body).toBeInstanceOf(Array);
  });
});

describe('Teste CRUD todos (e2e)', () => {
  beforeAll(async () => {
    await prisma.todo.deleteMany();
  });

  it('GET /todos deve retornar lista vazia inicialmente ', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /todos deve adicionar uma nova tarefa ', async () => {
    const novaTarefa = { name: 'Comprar pão' };
    const res = await request(app).post('/todos').send(novaTarefa);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toEqual(novaTarefa.name);
  });

  it('GET /todos deve retornar a tarefa adicionada ', async () => {
    const res = await request(app).get('/todos');
    expect(res.body.length).toBeGreaterThan(0);
  });
});
