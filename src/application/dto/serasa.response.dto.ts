import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';

export interface SerasaResponseDTO {
  cpf: string;
  status: InadimplenciaStatus;
  totalAmount: number;
  recordsCount: number;
  lastNegativationDate: string | null;
  summary?: string;
  consultedAt: string;
}
