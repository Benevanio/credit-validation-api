import { Debt } from '../../domain/entities/Debt';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';
import { DebtRepository } from '../../domain/repositories/DebtRepository';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import { IDebtGateway } from './consultSerasa.usecase';

export class UpdateStatusUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly debtRepository: DebtRepository,
    private readonly debtGateway: IDebtGateway
  ) {}

  async execute(cpf: string): Promise<{ previousStatus: InadimplenciaStatus; newStatus: InadimplenciaStatus }> {
    console.log(`[USE CASE] UpdateStatus - Updating CPF: ${cpf.substring(0, 3)}***`);

    const person = await this.personRepository.findByCPF(cpf);
    if (!person) {
      throw new Error('Pessoa não encontrada');
    }

    const latestDebt = await this.debtRepository.findLatestByPersonId(person.id);
    const previousStatus = latestDebt?.status || InadimplenciaStatus.ADIMPLENTE;

    const debtResponse = await this.debtGateway.consultCPF(cpf);
   
    const debtData = new Debt(
      0,
      person.id,
      cpf,
      debtResponse.status as InadimplenciaStatus,
      debtResponse.totalAmount,
      debtResponse.recordsCount,
      debtResponse.lastNegativationDate 
        ? new Date(debtResponse.lastNegativationDate) 
        : null,
      'LOCAL_SIMULATOR',
      new Date(),
      debtResponse.summary,
      new Date(),
      new Date()
    );

    await this.debtRepository.create(debtData);

    console.log(`[USE CASE] UpdateStatus - Changed from ${previousStatus} to ${debtResponse.status}`);

    return {
      previousStatus,
      newStatus: debtResponse.status as InadimplenciaStatus,
    };
  }
}
