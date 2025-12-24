import { describe, expect, it } from 'vitest';
import { PersonResponseDTO } from '../../../src/application/dto/person.response.dto';

describe('PersonResponseDTO', () => {
  describe('Structure Validation', () => {
    it('should have all required fields', () => {
      const validDto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João Silva',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
      };

      expect(validDto).toHaveProperty('id');
      expect(validDto).toHaveProperty('cpf');
      expect(validDto).toHaveProperty('name');
      expect(validDto).toHaveProperty('birthDate');
      expect(validDto).toHaveProperty('email');
    });

    it('should accept optional fields', () => {
      const dtoWithOptionals: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João Silva',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123',
        createdAt: '2025-12-24T10:00:00.000Z',
        updatedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dtoWithOptionals).toHaveProperty('phone');
      expect(dtoWithOptionals).toHaveProperty('address');
      expect(dtoWithOptionals).toHaveProperty('createdAt');
      expect(dtoWithOptionals).toHaveProperty('updatedAt');
    });

    it('should work without optional fields', () => {
      const minimalDto: PersonResponseDTO = {
        id: 2,
        cpf: '98765432100',
        name: 'Maria Santos',
        birthDate: '1985-05-20',
        email: 'maria@email.com',
      };

      expect(minimalDto.phone).toBeUndefined();
      expect(minimalDto.address).toBeUndefined();
      expect(minimalDto.createdAt).toBeUndefined();
      expect(minimalDto.updatedAt).toBeUndefined();
    });
  });

  describe('Field Type Validation', () => {
    it('should have id as number', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.id).toBe('number');
      expect(dto.id).toBeGreaterThan(0);
    });

    it('should have cpf as string without formatting', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.cpf).toBe('string');
      expect(dto.cpf).toMatch(/^\d{11}$/);
    });

    it('should have name as string', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João da Silva',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.name).toBe('string');
      expect(dto.name.length).toBeGreaterThan(0);
    });

    it('should have birthDate as string', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.birthDate).toBe('string');
    });

    it('should have email as string', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'valid@email.com',
      };

      expect(typeof dto.email).toBe('string');
      expect(dto.email).toContain('@');
    });

    it('should have createdAt as optional ISO string', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        createdAt: '2025-12-24T10:00:00.000Z',
      };

      expect(typeof dto.createdAt).toBe('string');
      expect(dto.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should have updatedAt as optional ISO string', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        updatedAt: '2025-12-24T12:30:00.000Z',
      };

      expect(typeof dto.updatedAt).toBe('string');
      expect(dto.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('ID Validation', () => {
    it('should accept positive integers', () => {
      const ids = [1, 2, 10, 100, 1000, 999999];

      ids.forEach((id) => {
        const dto: PersonResponseDTO = {
          id,
          cpf: '12345678909',
          name: 'Test',
          birthDate: '2000-01-01',
          email: 'test@test.com',
        };

        expect(dto.id).toBe(id);
        expect(dto.id).toBeGreaterThan(0);
      });
    });

    it('should handle sequential IDs', () => {
      const person1: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Person 1',
        birthDate: '2000-01-01',
        email: 'person1@test.com',
      };

      const person2: PersonResponseDTO = {
        id: 2,
        cpf: '98765432100',
        name: 'Person 2',
        birthDate: '2000-01-02',
        email: 'person2@test.com',
      };

      expect(person2.id).toBeGreaterThan(person1.id);
      expect(person2.id - person1.id).toBe(1);
    });
  });

  describe('CPF Format Validation', () => {
    it('should store CPF without formatting', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.cpf).toBe('12345678909');
      expect(dto.cpf).not.toContain('.');
      expect(dto.cpf).not.toContain('-');
    });

    it('should have exactly 11 digits', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.cpf.length).toBe(11);
      expect(dto.cpf).toMatch(/^\d{11}$/);
    });

    it('should accept different valid CPFs', () => {
      const cpfs = ['12345678909', '98765432100', '11122233344', '55566677788'];

      cpfs.forEach((cpf) => {
        const dto: PersonResponseDTO = {
          id: 1,
          cpf,
          name: 'Test',
          birthDate: '2000-01-01',
          email: 'test@test.com',
        };

        expect(dto.cpf).toBe(cpf);
        expect(dto.cpf.length).toBe(11);
      });
    });
  });

  describe('Timestamp Validation', () => {
    it('should accept ISO 8601 format for createdAt', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        createdAt: '2025-12-24T10:00:00.000Z',
      };

      expect(dto.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      const date = new Date(dto.createdAt!);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(dto.createdAt);
    });

    it('should accept ISO 8601 format for updatedAt', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        updatedAt: '2025-12-24T12:30:00.000Z',
      };

      expect(dto.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      const date = new Date(dto.updatedAt!);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(dto.updatedAt);
    });

    it('should handle updatedAt being after createdAt', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        createdAt: '2025-12-24T10:00:00.000Z',
        updatedAt: '2025-12-24T12:00:00.000Z',
      };

      const created = new Date(dto.createdAt!);
      const updated = new Date(dto.updatedAt!);

      expect(updated.getTime()).toBeGreaterThan(created.getTime());
    });
  });

  describe('Complete Response Examples', () => {
    it('should create a complete response with all fields', () => {
      const completeDto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João da Silva Santos',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2025-12-24T10:00:00.000Z',
        updatedAt: '2025-12-24T10:00:00.000Z',
      };

      expect(completeDto.id).toBe(1);
      expect(completeDto.cpf).toBe('12345678909');
      expect(completeDto.name).toBe('João da Silva Santos');
      expect(completeDto.birthDate).toBe('1990-01-15');
      expect(completeDto.email).toBe('joao.silva@email.com');
      expect(completeDto.phone).toBe('11987654321');
      expect(completeDto.address).toBe('Rua das Flores, 123 - São Paulo/SP');
      expect(completeDto.createdAt).toBeDefined();
      expect(completeDto.updatedAt).toBeDefined();
    });

    it('should create a minimal response with only required fields', () => {
      const minimalDto: PersonResponseDTO = {
        id: 2,
        cpf: '98765432100',
        name: 'Maria Santos',
        birthDate: '1985-05-20',
        email: 'maria.santos@test.com',
      };

      expect(minimalDto.id).toBe(2);
      expect(minimalDto.cpf).toBe('98765432100');
      expect(minimalDto.name).toBe('Maria Santos');
      expect(minimalDto.birthDate).toBe('1985-05-20');
      expect(minimalDto.email).toBe('maria.santos@test.com');
      expect(minimalDto.phone).toBeUndefined();
      expect(minimalDto.address).toBeUndefined();
      expect(minimalDto.createdAt).toBeUndefined();
      expect(minimalDto.updatedAt).toBeUndefined();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should represent a person created from API', () => {
      const apiResponse: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João Silva',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123 - São Paulo/SP',
        createdAt: '2025-12-24T20:00:00.000Z',
        updatedAt: '2025-12-24T20:00:00.000Z',
      };

      expect(apiResponse.id).toBeGreaterThan(0);
      expect(apiResponse.createdAt).toBeDefined();
      expect(apiResponse.updatedAt).toBeDefined();
    });

    it('should represent a person queried by CPF', () => {
      const queryResponse: PersonResponseDTO = {
        id: 5,
        cpf: '11122233344',
        name: 'Ana Paula',
        birthDate: '1992-08-10',
        email: 'ana.paula@test.com',
        phone: '21987654321',
        address: 'Av. Paulista, 1000',
      };

      expect(queryResponse).toBeDefined();
      expect(queryResponse.id).toBe(5);
      expect(queryResponse.cpf).toBe('11122233344');
    });

    it('should handle multiple persons in a list', () => {
      const persons: PersonResponseDTO[] = [
        {
          id: 1,
          cpf: '12345678909',
          name: 'Person 1',
          birthDate: '1990-01-01',
          email: 'person1@test.com',
        },
        {
          id: 2,
          cpf: '98765432100',
          name: 'Person 2',
          birthDate: '1991-02-02',
          email: 'person2@test.com',
        },
        {
          id: 3,
          cpf: '11122233344',
          name: 'Person 3',
          birthDate: '1992-03-03',
          email: 'person3@test.com',
        },
      ];

      expect(persons).toHaveLength(3);
      expect(persons[0].id).toBe(1);
      expect(persons[1].id).toBe(2);
      expect(persons[2].id).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'João Pedro da Silva Santos Oliveira Junior Neto',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.name.length).toBeGreaterThan(20);
    });

    it('should handle very long addresses', () => {
      const dto: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        address:
          'Rua Professor Doutor João da Silva Santos, 1234, Apartamento 567 - Bairro Jardim das Flores - São Paulo/SP',
      };

      expect(dto.address!.length).toBeGreaterThan(50);
    });

    it('should handle timestamps at different times', () => {
      const earlyMorning: PersonResponseDTO = {
        id: 1,
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        createdAt: '2025-12-24T03:00:00.000Z',
      };

      const lateNight: PersonResponseDTO = {
        id: 2,
        cpf: '98765432100',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        createdAt: '2025-12-24T23:59:59.999Z',
      };

      expect(earlyMorning.createdAt).toBeDefined();
      expect(lateNight.createdAt).toBeDefined();
    });
  });
});
