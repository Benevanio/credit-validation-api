import { describe, expect, it } from 'vitest';
import { CreatePersonDTO } from '../../../src/application/dto/createPerson.dto';

describe('CreatePersonDTO', () => {
  describe('Structure Validation', () => {
    it('should have all required fields', () => {
      const validDto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'João Silva',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
      };

      expect(validDto).toHaveProperty('cpf');
      expect(validDto).toHaveProperty('name');
      expect(validDto).toHaveProperty('birthDate');
      expect(validDto).toHaveProperty('email');
    });

    it('should accept optional fields', () => {
      const dtoWithOptionals: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'João Silva',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123',
      };

      expect(dtoWithOptionals).toHaveProperty('phone');
      expect(dtoWithOptionals).toHaveProperty('address');
      expect(dtoWithOptionals.phone).toBe('11987654321');
      expect(dtoWithOptionals.address).toBe('Rua das Flores, 123');
    });

    it('should work without optional fields', () => {
      const dtoWithoutOptionals: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Maria Santos',
        birthDate: '1985-05-20',
        email: 'maria@email.com',
      };

      expect(dtoWithoutOptionals.phone).toBeUndefined();
      expect(dtoWithoutOptionals.address).toBeUndefined();
    });
  });

  describe('Field Type Validation', () => {
    it('should have cpf as string', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.cpf).toBe('string');
    });

    it('should have name as string', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test Name',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.name).toBe('string');
    });

    it('should have birthDate as string in ISO format', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(typeof dto.birthDate).toBe('string');
      expect(dto.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should have email as string', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'valid@email.com',
      };

      expect(typeof dto.email).toBe('string');
    });

    it('should have phone as optional string', () => {
      const dtoWithPhone: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        phone: '11999999999',
      };

      expect(typeof dtoWithPhone.phone).toBe('string');
    });

    it('should have address as optional string', () => {
      const dtoWithAddress: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        address: 'Rua Teste, 123',
      };

      expect(typeof dtoWithAddress.address).toBe('string');
    });
  });

  describe('CPF Format Validation', () => {
    it('should accept CPF with formatting', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.cpf).toBe('123.456.789-09');
    });

    it('should accept CPF without formatting', () => {
      const dto: CreatePersonDTO = {
        cpf: '12345678909',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.cpf).toBe('12345678909');
    });

    it('should accept different valid CPF formats', () => {
      const formattedDto: CreatePersonDTO = {
        cpf: '895.520.192-30',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      const unformattedDto: CreatePersonDTO = {
        cpf: '89552019230',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(formattedDto.cpf).toBe('895.520.192-30');
      expect(unformattedDto.cpf).toBe('89552019230');
    });
  });

  describe('Email Format Validation', () => {
    it('should accept valid email format', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'valid.email@domain.com',
      };

      expect(dto.email).toContain('@');
      expect(dto.email).toContain('.');
    });

    it('should accept different email formats', () => {
      const emails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_123@test-domain.com',
      ];

      emails.forEach((email) => {
        const dto: CreatePersonDTO = {
          cpf: '123.456.789-09',
          name: 'Test',
          birthDate: '2000-01-01',
          email,
        };

        expect(dto.email).toBe(email);
        expect(dto.email).toContain('@');
      });
    });
  });

  describe('Date Format Validation', () => {
    it('should accept valid ISO date format', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '1990-01-15',
        email: 'test@test.com',
      };

      expect(dto.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should accept different valid dates', () => {
      const dates = ['1990-01-01', '2000-12-31', '1985-06-15'];

      dates.forEach((date) => {
        const dto: CreatePersonDTO = {
          cpf: '123.456.789-09',
          name: 'Test',
          birthDate: date,
          email: 'test@test.com',
        };

        expect(dto.birthDate).toBe(date);
        expect(dto.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('Complete DTO Examples', () => {
    it('should create a complete DTO with all fields', () => {
      const completeDto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'João da Silva Santos',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11987654321',
        address: 'Rua das Flores, 123 - São Paulo/SP',
      };

      expect(completeDto.cpf).toBe('123.456.789-09');
      expect(completeDto.name).toBe('João da Silva Santos');
      expect(completeDto.birthDate).toBe('1990-01-15');
      expect(completeDto.email).toBe('joao.silva@email.com');
      expect(completeDto.phone).toBe('11987654321');
      expect(completeDto.address).toBe('Rua das Flores, 123 - São Paulo/SP');
    });

    it('should create a minimal DTO with only required fields', () => {
      const minimalDto: CreatePersonDTO = {
        cpf: '895.520.192-30',
        name: 'Maria Santos',
        birthDate: '1985-05-20',
        email: 'maria.santos@test.com',
      };

      expect(minimalDto.cpf).toBe('895.520.192-30');
      expect(minimalDto.name).toBe('Maria Santos');
      expect(minimalDto.birthDate).toBe('1985-05-20');
      expect(minimalDto.email).toBe('maria.santos@test.com');
      expect(minimalDto.phone).toBeUndefined();
      expect(minimalDto.address).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty optional fields', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        phone: undefined,
        address: undefined,
      };

      expect(dto.phone).toBeUndefined();
      expect(dto.address).toBeUndefined();
    });

    it('should handle long names', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'João Pedro da Silva Santos Oliveira Junior',
        birthDate: '2000-01-01',
        email: 'test@test.com',
      };

      expect(dto.name.length).toBeGreaterThan(20);
      expect(dto.name).toBe('João Pedro da Silva Santos Oliveira Junior');
    });

    it('should handle long addresses', () => {
      const dto: CreatePersonDTO = {
        cpf: '123.456.789-09',
        name: 'Test',
        birthDate: '2000-01-01',
        email: 'test@test.com',
        address: 'Rua Professor Doutor João da Silva Santos, 1234, Apartamento 567, Bloco B, Torre 2 - Bairro Jardim das Flores - São Paulo/SP - CEP: 01234-567',
      };

      expect(dto.address!.length).toBeGreaterThan(50);
    });

    it('should handle different phone formats', () => {
      const phones = [
        '11987654321',
        '(11) 98765-4321',
        '+55 11 98765-4321',
        '11 9 8765-4321',
      ];

      phones.forEach((phone) => {
        const dto: CreatePersonDTO = {
          cpf: '123.456.789-09',
          name: 'Test',
          birthDate: '2000-01-01',
          email: 'test@test.com',
          phone,
        };

        expect(dto.phone).toBe(phone);
      });
    });
  });
});