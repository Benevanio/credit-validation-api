import { DebtResponseDTO } from '../../application/dto/debt.response.dto';
import { IDebtGateway } from '../../application/usecases/consultSerasa.usecase';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';

export class DebtSimulator implements IDebtGateway {
  constructor() {}

  async consultCPF(cpf: string): Promise<DebtResponseDTO> {
    console.log(`[GATEWAY DEBT SIMULATOR] Consulting CPF: ${cpf.substring(0, 3)}***`);

    const startTime = Date.now();

    try {
      const response = await this.simulateDebtConsult(cpf);
      
      const duration = Date.now() - startTime;
      console.log(`[GATEWAY DEBT SIMULATOR] Response generated in ${duration}ms`);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[GATEWAY DEBT SIMULATOR] Error after ${duration}ms:`, error);
      throw new Error('Falha ao gerar dados de dívida');
    }
  }

  private async simulateDebtConsult(cpf: string): Promise<DebtResponseDTO> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const isInadimplente = Math.random() > 0.7;

    return {
      cpf,
      status: isInadimplente ? InadimplenciaStatus.INADIMPLENTE : InadimplenciaStatus.ADIMPLENTE,
      totalAmount: isInadimplente ? parseFloat((Math.random() * 50000).toFixed(2)) : 0,
      recordsCount: isInadimplente ? Math.floor(Math.random() * 5) + 1 : 0,
      lastNegativationDate: isInadimplente 
        ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() 
        : null,
      summary: isInadimplente 
        ? `${Math.floor(Math.random() * 5) + 1} pendências financeiras encontradas` 
        : 'Sem pendências financeiras',
      consultedAt: new Date().toISOString(),
    };
  }
}
