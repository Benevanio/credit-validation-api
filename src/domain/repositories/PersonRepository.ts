import { Person } from '../entities/Person';

export interface PersonRepository {
  create(person: Omit<Person, 'id'>): Promise<Person>;
  findByCPF(cpf: string): Promise<Person | null>;
  findById(id: number): Promise<Person | null>;
  update(id: number, person: Partial<Person>): Promise<Person>;
}
