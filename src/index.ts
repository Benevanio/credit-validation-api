import fastify from "fastify";
import knex from "knex";
import database from "./config/database";

import { DebtRepositoryImpl } from "./infrastructure/database/DebtRepositoryImpl";
import { PersonRepositoryImpl } from "./infrastructure/database/PersonRepositoryImpl";
import { DebtSimulator } from "./infrastructure/gateways/DebtSimulator";

import { ConsultSerasaUseCase } from "./application/usecases/consultSerasa.usecase";
import { CreatePersonUseCase } from "./application/usecases/createPerson.usecase";
import { UpdateStatusUseCase } from "./application/usecases/updateStatus.usecase";

import { PersonController } from "./infrastructure/http/controllers/PersonController";
import { personRoutes } from "./infrastructure/http/routes/person.routes";

console.log('[SYSTEM] Initializing Fastify server');
const app = fastify({ logger: false });

console.log('[SYSTEM] Configuring database connection');
const db = knex(database);

console.log('[SYSTEM] Setting up dependency injection');

const personRepository = new PersonRepositoryImpl(db);
const debtRepository = new DebtRepositoryImpl(db);

const debtSimulator = new DebtSimulator();

const createPersonUseCase = new CreatePersonUseCase(personRepository);
const consultSerasaUseCase = new ConsultSerasaUseCase(
  personRepository,
  debtRepository,
  debtSimulator
);
const updateStatusUseCase = new UpdateStatusUseCase(
  personRepository,
  debtRepository,
  debtSimulator
);

const personController = new PersonController(
  personRepository,
  createPersonUseCase,
  consultSerasaUseCase,
  updateStatusUseCase
);

console.log('[SYSTEM] Registering routes');
personRoutes(app, personController);

app.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error('[SYSTEM] Error starting server:', err);
    process.exit(1);
  }
  console.log(`[SYSTEM] ✅ Server listening at ${address}`);
  console.log(`[SYSTEM] 📋 Available routes:`);
  console.log(`[SYSTEM]   POST   /api/persons`);
  console.log(`[SYSTEM]   GET    /api/persons/:cpf`);
  console.log(`[SYSTEM]   GET    /api/persons/:cpf/serasa`);
  console.log(`[SYSTEM]   PUT    /api/persons/:cpf/status`);
  console.log(`[SYSTEM]   GET    /health`);
});
