import { InadimplenciaStatus } from '../enums/InadimplenciaStatus';

export class Debt {
  constructor(
    public readonly id: number,
    public readonly personId: number,
    public readonly cpf: string,
    public readonly status: InadimplenciaStatus,
    public readonly totalAmount: number,
    public readonly recordsCount: number,
    public readonly lastNegativationDate: Date | null,
    public readonly origin: string,
    public readonly consultedAt: Date,
    public readonly summary?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

static createFromSerasa(data: {
  personId: number;
  cpf: string;
  status: InadimplenciaStatus;
  totalAmount: number;
  recordsCount: number;
  lastNegativationDate: Date | null;
  summary?: string;
}): Omit<Debt, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    ...data,
    origin: 'SERASA',
    consultedAt: new Date(),
    isInadimplente: function (): boolean {
      return this.status === InadimplenciaStatus.INADIMPLENTE;
    }
  };
}

  isInadimplente(): boolean {
    return this.status === InadimplenciaStatus.INADIMPLENTE;
  }
}
