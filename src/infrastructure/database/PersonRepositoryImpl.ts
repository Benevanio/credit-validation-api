import { Knex } from 'knex';
import { Person } from '../../domain/entities/Person';
import { PersonRepository } from '../../domain/repositories/PersonRepository';

export class PersonRepositoryImpl implements PersonRepository {
  constructor(private readonly db: Knex) {}

  async create(person: Omit<Person, 'id'>): Promise<Person> {
    const [id] = await this.db('persons').insert({
      cpf: person.cpf,
      name: person.name,
      birth_date: person.birthDate,
      email: person.email,
      phone: person.phone,
      address: person.address,
      created_at: person.createdAt,
      updated_at: person.updatedAt,
    });

    return new Person(
      id,
      person.cpf,
      person.name,
      person.birthDate,
      person.email,
      person.phone,
      person.address,
      person.createdAt,
      person.updatedAt
    );
  }

  async findByCPF(cpf: string): Promise<Person | null> {
    const row = await this.db('persons')
      .where({ cpf: cpf.replace(/\D/g, '') })
      .first();

    if (!row) return null;

    return new Person(
      row.id,
      row.cpf,
      row.name,
      new Date(row.birth_date),
      row.email,
      row.phone,
      row.address,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async findById(id: number): Promise<Person | null> {
    const row = await this.db('persons').where({ id }).first();

    if (!row) return null;

    return new Person(
      row.id,
      row.cpf,
      row.name,
      new Date(row.birth_date),
      row.email,
      row.phone,
      row.address,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async update(id: number, person: Partial<Person>): Promise<Person> {
    await this.db('persons')
      .where({ id })
      .update({
        ...(person.name && { name: person.name }),
        ...(person.email && { email: person.email }),
        ...(person.phone && { phone: person.phone }),
        ...(person.address && { address: person.address }),
        updated_at: new Date(),
      });

    const updated = await this.findById(id);
    if (!updated) throw new Error('Person not found after update');

    return updated;
  }
}
