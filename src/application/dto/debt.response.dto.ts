export interface DebtResponseDTO {
  cpf: string;
  status: string;
  totalAmount: number;
  recordsCount: number;
  lastNegativationDate: string | null;
  summary?: string;
  consultedAt: string;
}
