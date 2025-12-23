import { Debt } from '../../domain/entities/Debt';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';
import { DebtRepository } from '../../domain/repositories/DebtRepository';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import { DebtResponseDTO } from '../dto/debt.response.dto';

export interface IDebtGateway {
  consultCPF(cpf: string): Promise<DebtResponseDTO>;
}

export class ConsultSerasaUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly debtRepository: DebtRepository,
    private readonly debtGateway: IDebtGateway
  ) {}

  async execute(cpf: string): Promise<DebtResponseDTO> {
    console.log(`[USE CASE] ConsultDebt - Consulting CPF: ${cpf.substring(0, 3)}***`);

    const person = await this.personRepository.findByCPF(cpf);
    if (!person) {
      throw new Error('Pessoa não encontrada');
    }

    const debtResponse = await this.debtGateway.consultCPF(cpf);

    const debtData = Debt.createFromSerasa({
      personId: person.id,
      cpf: cpf,
      status: debtResponse.status as InadimplenciaStatus,
      totalAmount: debtResponse.totalAmount,
      recordsCount: debtResponse.recordsCount,
      lastNegativationDate: debtResponse.lastNegativationDate 
        ? new Date(debtResponse.lastNegativationDate) 
        : null,
      summary: debtResponse.summary,
    });

    await this.debtRepository.create(debtData);

    console.log(`[USE CASE] ConsultDebt - Status: ${debtResponse.status}`);

    return debtResponse;
  }
}
