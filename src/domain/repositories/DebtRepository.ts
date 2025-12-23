import { Debt } from '../entities/Debt';

export interface DebtRepository {
  create(debt: Omit<Debt, 'id'>): Promise<Debt>;
  findByPersonId(personId: number): Promise<Debt[]>;
  findLatestByPersonId(personId: number): Promise<Debt | null>;
  update(id: number, debt: Partial<Debt>): Promise<Debt>;
}
