import { SerasaResponseDTO } from '../../application/dto/serasa.response.dto';
import { ISerasaGateway } from '../../application/usecases/consultSerasa.usecase';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';

export class SerasaClient implements ISerasaGateway {
  private readonly baseURL: string;
  private readonly oauthURL: string;
  private readonly clientSecret: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.baseURL = process.env.SERASA_API_URL || 'https://api.serasaexperian.com.br';
    this.oauthURL = `${this.baseURL}/oauth/token`;
    this.clientSecret = process.env.SERASA_CLIENT_SECRET || '';
    this.timeout = 10000; 
    this.maxRetries = 3;
  }

  async consultCPF(cpf: string): Promise<SerasaResponseDTO> {
    console.log(`[GATEWAY SERASA] Consulting CPF: ${cpf.substring(0, 3)}***`);

    const startTime = Date.now();

    try {
    
      await this.ensureValidToken();
      const response = await this.callSerasaAPI(cpf);
      
      const duration = Date.now() - startTime;
      console.log(`[GATEWAY SERASA] Response received in ${duration}ms`);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[GATEWAY SERASA] Error after ${duration}ms:`, error);
      throw new Error('Falha ao consultar Serasa');
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 300000) {
      return;
    }

    console.log('[GATEWAY SERASA] Obtaining new access token');


    this.accessToken = 'mock_access_token_' + Date.now();
    this.tokenExpiresAt = Date.now() + 3600000; // 1 hora
  }

  private async callSerasaAPI(cpf: string): Promise<SerasaResponseDTO> {
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const isInadimplente = Math.random() > 0.5;

    return {
      cpf,
      status: isInadimplente ? InadimplenciaStatus.INADIMPLENTE : InadimplenciaStatus.ADIMPLENTE,
      totalAmount: isInadimplente ? Math.random() * 10000 : 0,
      recordsCount: isInadimplente ? Math.floor(Math.random() * 5) + 1 : 0,
      lastNegativationDate: isInadimplente ? new Date().toISOString() : null,
      summary: isInadimplente ? 'Pendências financeiras identificadas' : 'Sem pendências',
      consultedAt: new Date().toISOString(),
    };
  }


}
