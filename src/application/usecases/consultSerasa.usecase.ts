import { Debt } from '../../domain/entities/Debt';
import { DebtRepository } from '../../domain/repositories/DebtRepository';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import { SerasaResponseDTO } from '../dto/serasa.response.dto';

export interface ISerasaGateway {
  consultCPF(cpf: string): Promise<SerasaResponseDTO>;
}

export class ConsultSerasaUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly debtRepository: DebtRepository,
    private readonly serasaGateway: ISerasaGateway
  ) {}

  async execute(cpf: string): Promise<SerasaResponseDTO> {
    console.log(`[USE CASE] ConsultSerasa - Consulting CPF: ${cpf.substring(0, 3)}***`);

 
    const person = await this.personRepository.findByCPF(cpf);
    if (!person) {
      throw new Error('Pessoa não encontrada');
    }

    const serasaResponse = await this.serasaGateway.consultCPF(cpf);

    const debtData = Debt.createFromSerasa({
      personId: person.id,
      cpf: cpf,
      status: serasaResponse.status,
      totalAmount: serasaResponse.totalAmount,
      recordsCount: serasaResponse.recordsCount,
      lastNegativationDate: serasaResponse.lastNegativationDate 
        ? new Date(serasaResponse.lastNegativationDate) 
        : null,
      summary: serasaResponse.summary,
    });

    await this.debtRepository.create(debtData);

    console.log(`[USE CASE] ConsultSerasa - Status: ${serasaResponse.status}`);

    return serasaResponse;
  }
}
