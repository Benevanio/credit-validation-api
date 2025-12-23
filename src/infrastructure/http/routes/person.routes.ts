import { FastifyInstance } from 'fastify';
import { PersonController } from '../controllers/PersonController';

export async function personRoutes(
  fastify: FastifyInstance,
  controller: PersonController
) {

  fastify.post('/api/persons', (request, reply) => 
    controller.create(request, reply)
  );

  fastify.get<{ Params: { cpf: string } }>('/api/persons/:cpf', (request, reply) => 
    controller.getByCPF(request, reply)
  );

  fastify.get<{ Params: { cpf: string } }>('/api/persons/:cpf/serasa', (request, reply) => 
    controller.consultSerasa(request, reply)
  );

  fastify.put<{ Params: { cpf: string } }>('/api/persons/:cpf/status', (request, reply) => 
    controller.updateStatus(request, reply)
  );
}
