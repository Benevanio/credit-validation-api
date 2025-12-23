import { Debt } from '../../domain/entities/Debt';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';
import { DebtRepository } from '../../domain/repositories/DebtRepository';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import { ISerasaGateway } from './consultSerasa.usecase';

export class UpdateStatusUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly debtRepository: DebtRepository,
    private readonly serasaGateway: ISerasaGateway
  ) {}

  async execute(cpf: string): Promise<{ previousStatus: InadimplenciaStatus; newStatus: InadimplenciaStatus }> {
    console.log(`[USE CASE] UpdateStatus - Updating CPF: ${cpf.substring(0, 3)}***`);

    const person = await this.personRepository.findByCPF(cpf);
    if (!person) {
      throw new Error('Pessoa não encontrada');
    }

    const latestDebt = await this.debtRepository.findLatestByPersonId(person.id);
    const previousStatus = latestDebt?.status || InadimplenciaStatus.ADIMPLENTE;

    const serasaResponse = await this.serasaGateway.consultCPF(cpf);
   
    const debtData = new Debt(
      0,
      person.id,
      cpf,
      serasaResponse.status,
      serasaResponse.totalAmount,
      serasaResponse.recordsCount,
      serasaResponse.lastNegativationDate 
        ? new Date(serasaResponse.lastNegativationDate) 
        : null,
      'SERASA',
      new Date(),
      serasaResponse.summary,
      new Date(),
      new Date()
    );

    await this.debtRepository.create(debtData);
    await this.debtRepository.create(debtData);

    console.log(`[USE CASE] UpdateStatus - Changed from ${previousStatus} to ${serasaResponse.status}`);

    return {
      previousStatus,
      newStatus: serasaResponse.status,
    };
  }
}
