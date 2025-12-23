import { FastifyReply, FastifyRequest } from 'fastify';
import { CreatePersonDTO } from '../../../application/dto/createPerson.dto';
import { ConsultSerasaUseCase } from '../../../application/usecases/consultSerasa.usecase';
import { CreatePersonUseCase } from '../../../application/usecases/createPerson.usecase';
import { UpdateStatusUseCase } from '../../../application/usecases/updateStatus.usecase';
import { PersonRepository } from '../../../domain/repositories/PersonRepository';

export class PersonController {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly consultSerasaUseCase: ConsultSerasaUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log('[CONTROLLER] POST /api/persons - Creating person');

      const data = request.body as CreatePersonDTO;
      const result = await this.createPersonUseCase.execute(data);

      return reply.status(201).send(result);
    } catch (error) {
      console.error('[CONTROLLER] Error creating person:', error);
      return reply.status(400).send({
        error: error instanceof Error ? error.message : 'Erro ao criar pessoa',
      });
    }
  }

  async getByCPF(request: FastifyRequest<{ Params: { cpf: string } }>, reply: FastifyReply) {
    try {
      console.log(`[CONTROLLER] GET /api/persons/${request.params.cpf}`);

      const person = await this.personRepository.findByCPF(request.params.cpf);

      if (!person) {
        return reply.status(404).send({ error: 'Pessoa não encontrada' });
      }

      return reply.send({
        id: person.id,
        cpf: person.cpf,
        name: person.name,
        birthDate: person.birthDate.toISOString().split('T')[0],
        email: person.email,
        phone: person.phone,
        address: person.address,
      });
    } catch (error) {
      console.error('[CONTROLLER] Error fetching person:', error);
      return reply.status(500).send({ error: 'Erro ao buscar pessoa' });
    }
  }

  async consultSerasa(request: FastifyRequest<{ Params: { cpf: string } }>, reply: FastifyReply) {
    try {
      console.log(`[CONTROLLER] GET /api/persons/${request.params.cpf}/serasa`);

      const result = await this.consultSerasaUseCase.execute(request.params.cpf);

      return reply.send(result);
    } catch (error) {
      console.error('[CONTROLLER] Error consulting Serasa:', error);
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Erro ao consultar Serasa',
      });
    }
  }

  async updateStatus(request: FastifyRequest<{ Params: { cpf: string } }>, reply: FastifyReply) {
    try {
      console.log(`[CONTROLLER] PUT /api/persons/${request.params.cpf}/status`);

      const result = await this.updateStatusUseCase.execute(request.params.cpf);

      return reply.send(result);
    } catch (error) {
      console.error('[CONTROLLER] Error updating status:', error);
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Erro ao atualizar status',
      });
    }
  }
}
