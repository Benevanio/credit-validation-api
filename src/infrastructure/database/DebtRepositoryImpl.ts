import { Knex } from 'knex';
import { Debt } from '../../domain/entities/Debt';
import { InadimplenciaStatus } from '../../domain/enums/InadimplenciaStatus';
import { DebtRepository } from '../../domain/repositories/DebtRepository';

export class DebtRepositoryImpl implements DebtRepository {
  constructor(private readonly db: Knex) {}

  async create(debt: Omit<Debt, 'id'>): Promise<Debt> {
    const [id] = await this.db('debts').insert({
      person_id: debt.personId,
      cpf: debt.cpf,
      status: debt.status,
      total_amount: debt.totalAmount,
      records_count: debt.recordsCount,
      last_negativation_date: debt.lastNegativationDate,
      origin: debt.origin,
      consulted_at: debt.consultedAt,
      summary: debt.summary,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return new Debt(
      id,
      debt.personId,
      debt.cpf,
      debt.status,
      debt.totalAmount,
      debt.recordsCount,
      debt.lastNegativationDate,
      debt.origin,
      debt.consultedAt,
      debt.summary,
      new Date(),
      new Date()
    );
  }

  async findByPersonId(personId: number): Promise<Debt[]> {
    const rows = await this.db('debts')
      .where({ person_id: personId })
      .orderBy('consulted_at', 'desc');

    return rows.map(row => new Debt(
      row.id,
      row.person_id,
      row.cpf,
      row.status as InadimplenciaStatus,
      parseFloat(row.total_amount),
      row.records_count,
      row.last_negativation_date ? new Date(row.last_negativation_date) : null,
      row.origin,
      new Date(row.consulted_at),
      row.summary,
      new Date(row.created_at),
      new Date(row.updated_at)
    ));
  }

  async findLatestByPersonId(personId: number): Promise<Debt | null> {
    const row = await this.db('debts')
      .where({ person_id: personId })
      .orderBy('consulted_at', 'desc')
      .first();

    if (!row) return null;

    return new Debt(
      row.id,
      row.person_id,
      row.cpf,
      row.status as InadimplenciaStatus,
      parseFloat(row.total_amount),
      row.records_count,
      row.last_negativation_date ? new Date(row.last_negativation_date) : null,
      row.origin,
      new Date(row.consulted_at),
      row.summary,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async update(id: number, debt: Partial<Debt>): Promise<Debt> {
    await this.db('debts')
      .where({ id })
      .update({
        ...(debt.status && { status: debt.status }),
        ...(debt.totalAmount !== undefined && { total_amount: debt.totalAmount }),
        ...(debt.recordsCount !== undefined && { records_count: debt.recordsCount }),
        ...(debt.summary && { summary: debt.summary }),
        updated_at: new Date(),
      });

    const row = await this.db('debts').where({ id }).first();
    if (!row) throw new Error('Debt not found after update');

    return new Debt(
      row.id,
      row.person_id,
      row.cpf,
      row.status as InadimplenciaStatus,
      parseFloat(row.total_amount),
      row.records_count,
      row.last_negativation_date ? new Date(row.last_negativation_date) : null,
      row.origin,
      new Date(row.consulted_at),
      row.summary,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}
