import { Person } from '../../domain/entities/Person';
import { PersonRepository } from '../../domain/repositories/PersonRepository';
import { normalizeCPF, validateCPF } from '../../domain/utils/cpf.utils';
import { CreatePersonDTO } from '../dto/createPerson.dto';
import { PersonResponseDTO } from '../dto/person.response.dto';

export class CreatePersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(data: CreatePersonDTO): Promise<PersonResponseDTO> {
    console.log('[USE CASE] CreatePerson - Creating person');
    const normalizedCPF = normalizeCPF(data.cpf);
    
    if (!validateCPF(normalizedCPF)) {
      throw new Error('CPF inválido');
    }

    const existingPerson = await this.personRepository.findByCPF(normalizedCPF);
    if (existingPerson) {
      throw new Error('CPF já cadastrado');
    }


    const personData = Person.create({
      cpf: normalizedCPF,
      name: data.name,
      birthDate: new Date(data.birthDate),
      email: data.email.toLowerCase(),
      phone: data.phone,
      address: data.address,
      isValidCPF: () => true,
    });

    const savedPerson = await this.personRepository.create(personData);

    console.log(`[USE CASE] CreatePerson - Person created with id: ${savedPerson.id}`);

    return {
      id: savedPerson.id,
      cpf: savedPerson.cpf,
      name: savedPerson.name,
      birthDate: savedPerson.birthDate.toISOString().split('T')[0],
      email: savedPerson.email,
      phone: savedPerson.phone,
      address: savedPerson.address,
      createdAt: savedPerson.createdAt?.toISOString(),
      updatedAt: savedPerson.updatedAt?.toISOString(),
    };
  }
}
