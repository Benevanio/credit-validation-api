import { describe, expect, it } from 'vitest';
import { Person } from '../../../src/domain/entities/Person';

describe('Person Entity', () => {
  describe('Constructor', () => {
    it('should create a Person instance with all fields', () => {
      const person = new Person(
        1,
        '12345678909',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com',
        '11987654321',
        'Rua ABC, 123',
        new Date('2025-01-01'),
        new Date('2025-01-01')
      );

      expect(person.id).toBe(1);
      expect(person.cpf).toBe('12345678909');
      expect(person.name).toBe('João Silva');
      expect(person.birthDate).toEqual(new Date('1990-01-15'));
      expect(person.email).toBe('joao@example.com');
      expect(person.phone).toBe('11987654321');
      expect(person.address).toBe('Rua ABC, 123');
      expect(person.createdAt).toBeDefined();
      expect(person.updatedAt).toBeDefined();
    });

    it('should create a Person instance without optional fields', () => {
      const person = new Person(
        2,
        '11144477735',
        'Maria Santos',
        new Date('1985-05-20'),
        'maria@example.com'
      );

      expect(person.id).toBe(2);
      expect(person.cpf).toBe('11144477735');
      expect(person.name).toBe('Maria Santos');
      expect(person.phone).toBeUndefined();
      expect(person.address).toBeUndefined();
      expect(person.createdAt).toBeUndefined();
      expect(person.updatedAt).toBeUndefined();
    });
  });

  describe('create static method', () => {
    it('should create a new Person without id', () => {
      const personData = {
        cpf: '12345678909',
        name: 'João Silva',
        birthDate: new Date('1990-01-15'),
        email: 'joao@example.com',
        phone: '11987654321',
        address: 'Rua ABC, 123',
        isValidCPF: () => true
      };

      const person = Person.create(personData);

      expect(person.cpf).toBe('12345678909');
      expect(person.name).toBe('João Silva');
      expect(person.birthDate).toEqual(new Date('1990-01-15'));
      expect(person.email).toBe('joao@example.com');
      expect(person.phone).toBe('11987654321');
      expect(person.address).toBe('Rua ABC, 123');
      expect(person.createdAt).toBeInstanceOf(Date);
      expect(person.updatedAt).toBeInstanceOf(Date);
      expect(person.createdAt?.getTime()).toBeCloseTo(new Date().getTime(), -2);
      expect(person.updatedAt?.getTime()).toBeCloseTo(new Date().getTime(), -2);
    });

    it('should create Person with createdAt and updatedAt', () => {
      const before = new Date().getTime();
      
      const person = Person.create({
        cpf: '11144477735',
        name: 'Maria Santos',
        birthDate: new Date('1985-05-20'),
        email: 'maria@example.com',
        isValidCPF() { return true; }
      });

      const after = new Date().getTime();

      expect(person.createdAt).toBeDefined();
      expect(person.updatedAt).toBeDefined();
      expect(person.createdAt?.getTime()).toBeGreaterThanOrEqual(before);
      expect(person.createdAt?.getTime()).toBeLessThanOrEqual(after);
      expect(person.updatedAt?.getTime()).toBeGreaterThanOrEqual(before);
      expect(person.updatedAt?.getTime()).toBeLessThanOrEqual(after);
    });

    it('should create Person without optional fields', () => {
      const person = Person.create({
        cpf: '11144477735',
        name: 'Carlos Oliveira',
        birthDate: new Date('1992-03-10'),
        email: 'carlos@example.com',
        isValidCPF() { return true; }
      });

      expect(person.phone).toBeUndefined();
      expect(person.address).toBeUndefined();
      expect(person.createdAt).toBeDefined();
      expect(person.updatedAt).toBeDefined();
    });
  });

  describe('isValidCPF', () => {
    it('should validate a valid CPF without formatting', () => {
      const person = new Person(
        1,
        '12345678909',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(true);
    });

    it('should validate a valid CPF with formatting', () => {
      const person = new Person(
        1,
        '123.456.789-09',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(true);
    });

    it('should invalidate CPF with less than 11 digits', () => {
      const person = new Person(
        1,
        '123456789',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(false);
    });

    it('should invalidate CPF with all same digits', () => {
      const person = new Person(
        1,
        '11111111111',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(false);
    });

    it('should invalidate CPF with wrong first check digit', () => {
      const person = new Person(
        1,
        '12345678900',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(false);
    });

    it('should invalidate CPF with wrong second check digit', () => {
      const person = new Person(
        1,
        '12345678908',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(false);
    });

    it('should validate multiple valid CPFs', () => {
      const validCPFs = ['12345678909', '11144477735'];

      validCPFs.forEach((cpf) => {
        const person = new Person(
          1,
          cpf,
          'Test Person',
          new Date('1990-01-01'),
          'test@example.com'
        );
        expect(person.isValidCPF()).toBe(true);
      });
    });

    it('should handle CPF with special characters', () => {
      const person = new Person(
        1,
        '123.456.789-09',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.isValidCPF()).toBe(true);
    });

    it('should validate CPF where digit calculation results in >= 10', () => {
      const person = new Person(
        1,
        '00000000191',
        'Test User',
        new Date('1990-01-01'),
        'test@example.com'
      );

      expect(person.isValidCPF()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names', () => {
      const longName = 'A'.repeat(200);
      const person = new Person(
        1,
        '12345678909',
        longName,
        new Date('1990-01-15'),
        'joao@example.com'
      );

      expect(person.name).toBe(longName);
      expect(person.name.length).toBe(200);
    });

    it('should handle very long addresses', () => {
      const longAddress = 'Rua ' + 'A'.repeat(300);
      const person = new Person(
        1,
        '12345678909',
        'João Silva',
        new Date('1990-01-15'),
        'joao@example.com',
        '11987654321',
        longAddress
      );

      expect(person.address).toBe(longAddress);
    });

    it('should handle old birthdates', () => {
      const oldDate = new Date('1920-01-01');
      const person = new Person(
        1,
        '12345678909',
        'Very Old Person',
        oldDate,
        'old@example.com'
      );

      expect(person.birthDate).toEqual(oldDate);
    });

    it('should handle future birthdates', () => {
      const futureDate = new Date('2030-01-01');
      const person = new Person(
        1,
        '12345678909',
        'Future Person',
        futureDate,
        'future@example.com'
      );

      expect(person.birthDate).toEqual(futureDate);
    });
  });
});
