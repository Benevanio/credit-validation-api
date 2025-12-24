import { describe, expect, it } from 'vitest';
import { Debt } from '../../../src/domain/entities/Debt';
import { InadimplenciaStatus } from '../../../src/domain/enums/InadimplenciaStatus';

describe('Debt Entity', () => {
  describe('Constructor', () => {
    it('should create a Debt instance with all fields', () => {
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        5432.50,
        3,
        new Date('2025-11-15'),
        'SERASA',
        new Date('2025-12-24'),
        'Pendências financeiras identificadas',
        new Date('2025-12-01'),
        new Date('2025-12-01')
      );

      expect(debt.id).toBe(1);
      expect(debt.personId).toBe(100);
      expect(debt.cpf).toBe('12345678909');
      expect(debt.status).toBe(InadimplenciaStatus.INADIMPLENTE);
      expect(debt.totalAmount).toBe(5432.50);
      expect(debt.recordsCount).toBe(3);
      expect(debt.lastNegativationDate).toEqual(new Date('2025-11-15'));
      expect(debt.origin).toBe('SERASA');
      expect(debt.consultedAt).toEqual(new Date('2025-12-24'));
      expect(debt.summary).toBe('Pendências financeiras identificadas');
      expect(debt.createdAt).toBeDefined();
      expect(debt.updatedAt).toBeDefined();
    });

    it('should create a Debt instance for ADIMPLENTE status', () => {
      const debt = new Debt(
        2,
        101,
        '11144477735',
        InadimplenciaStatus.ADIMPLENTE,
        0,
        0,
        null,
        'SERASA',
        new Date('2025-12-24')
      );

      expect(debt.id).toBe(2);
      expect(debt.personId).toBe(101);
      expect(debt.status).toBe(InadimplenciaStatus.ADIMPLENTE);
      expect(debt.totalAmount).toBe(0);
      expect(debt.recordsCount).toBe(0);
      expect(debt.lastNegativationDate).toBeNull();
      expect(debt.summary).toBeUndefined();
      expect(debt.createdAt).toBeUndefined();
      expect(debt.updatedAt).toBeUndefined();
    });
  });

  describe('createFromSerasa static method', () => {
    it('should create a Debt from Serasa data for INADIMPLENTE', () => {
      const serasaData = {
        personId: 100,
        cpf: '12345678909',
        status: InadimplenciaStatus.INADIMPLENTE,
        totalAmount: 7250.75,
        recordsCount: 5,
        lastNegativationDate: new Date('2025-11-20'),
        summary: '5 registros de inadimplência encontrados',
      };

      const before = new Date().getTime();
      const debt = Debt.createFromSerasa(serasaData);
      const after = new Date().getTime();

      expect(debt.personId).toBe(100);
      expect(debt.cpf).toBe('12345678909');
      expect(debt.status).toBe(InadimplenciaStatus.INADIMPLENTE);
      expect(debt.totalAmount).toBe(7250.75);
      expect(debt.recordsCount).toBe(5);
      expect(debt.lastNegativationDate).toEqual(new Date('2025-11-20'));
      expect(debt.origin).toBe('SERASA');
      expect(debt.summary).toBe('5 registros de inadimplência encontrados');
      expect(debt.consultedAt).toBeDefined();
      expect(debt.consultedAt.getTime()).toBeGreaterThanOrEqual(before);
      expect(debt.consultedAt.getTime()).toBeLessThanOrEqual(after);
    });

    it('should create a Debt from Serasa data for ADIMPLENTE', () => {
      const serasaData = {
        personId: 101,
        cpf: '11144477735',
        status: InadimplenciaStatus.ADIMPLENTE,
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        summary: 'Sem pendências',
      };

      const debt = Debt.createFromSerasa(serasaData);

      expect(debt.personId).toBe(101);
      expect(debt.status).toBe(InadimplenciaStatus.ADIMPLENTE);
      expect(debt.totalAmount).toBe(0);
      expect(debt.recordsCount).toBe(0);
      expect(debt.lastNegativationDate).toBeNull();
      expect(debt.origin).toBe('SERASA');
      expect(debt.summary).toBe('Sem pendências');
    });

    it('should create Debt without summary', () => {
      const serasaData = {
        personId: 102,
        cpf: '98765432100',
        status: InadimplenciaStatus.ADIMPLENTE,
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
      };

      const debt = Debt.createFromSerasa(serasaData);

      expect(debt.summary).toBeUndefined();
      expect(debt.origin).toBe('SERASA');
    });

    it('should set consultedAt to current time', () => {
      const before = new Date();
      
      const debt = Debt.createFromSerasa({
        personId: 100,
        cpf: '12345678909',
        status: InadimplenciaStatus.INADIMPLENTE,
        totalAmount: 1000,
        recordsCount: 1,
        lastNegativationDate: new Date('2025-11-15'),
      });

      const after = new Date();

      expect(debt.consultedAt).toBeInstanceOf(Date);
      expect(debt.consultedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(debt.consultedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should always set origin to SERASA', () => {
      const debt = Debt.createFromSerasa({
        personId: 100,
        cpf: '12345678909',
        status: InadimplenciaStatus.INADIMPLENTE,
        totalAmount: 1000,
        recordsCount: 1,
        lastNegativationDate: new Date('2025-11-15'),
      });

      expect(debt.origin).toBe('SERASA');
    });
  });

  describe('isInadimplente method', () => {
    it('should return true for INADIMPLENTE status', () => {
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        5000,
        2,
        new Date('2025-11-15'),
        'SERASA',
        new Date('2025-12-24')
      );

      expect(debt.isInadimplente()).toBe(true);
    });

    it('should return false for ADIMPLENTE status', () => {
      const debt = new Debt(
        2,
        101,
        '11144477735',
        InadimplenciaStatus.ADIMPLENTE,
        0,
        0,
        null,
        'SERASA',
        new Date('2025-12-24')
      );

      expect(debt.isInadimplente()).toBe(false);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should represent a person with multiple debts', () => {
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        15750.25,
        10,
        new Date('2025-10-01'),
        'SERASA',
        new Date('2025-12-24'),
        '10 registros de inadimplência encontrados'
      );

      expect(debt.recordsCount).toBe(10);
      expect(debt.totalAmount).toBeGreaterThan(15000);
      expect(debt.isInadimplente()).toBe(true);
    });

    it('should represent a clean record consultation', () => {
      const debt = Debt.createFromSerasa({
        personId: 101,
        cpf: '11144477735',
        status: InadimplenciaStatus.ADIMPLENTE,
        totalAmount: 0,
        recordsCount: 0,
        lastNegativationDate: null,
        summary: 'Nenhum registro encontrado',
      });

      expect(debt.isInadimplente()).toBe(false);
      expect(debt.totalAmount).toBe(0);
      expect(debt.recordsCount).toBe(0);
      expect(debt.lastNegativationDate).toBeNull();
    });

    it('should handle single debt record', () => {
      const debt = Debt.createFromSerasa({
        personId: 102,
        cpf: '98765432100',
        status: InadimplenciaStatus.INADIMPLENTE,
        totalAmount: 1500.0,
        recordsCount: 1,
        lastNegativationDate: new Date('2025-12-01'),
        summary: '1 registro de inadimplência encontrado',
      });

      expect(debt.recordsCount).toBe(1);
      expect(debt.totalAmount).toBe(1500.0);
      expect(debt.isInadimplente()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large debt amounts', () => {
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        999999999.99,
        100,
        new Date('2025-11-15'),
        'SERASA',
        new Date('2025-12-24')
      );

      expect(debt.totalAmount).toBe(999999999.99);
      expect(debt.recordsCount).toBe(100);
    });

    it('should handle old negativation dates', () => {
      const oldDate = new Date('2020-01-01');
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        5000,
        1,
        oldDate,
        'SERASA',
        new Date('2025-12-24')
      );

      expect(debt.lastNegativationDate).toEqual(oldDate);
      const diffYears = new Date().getFullYear() - oldDate.getFullYear();
      expect(diffYears).toBeGreaterThan(5);
    });

    it('should handle very recent negativation', () => {
      const recentDate = new Date();
      recentDate.setHours(recentDate.getHours() - 1);

      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        1000,
        1,
        recentDate,
        'SERASA',
        new Date()
      );

      expect(debt.lastNegativationDate).toEqual(recentDate);
      expect(debt.consultedAt.getTime()).toBeGreaterThan(recentDate.getTime());
    });

    it('should handle very long summary', () => {
      const longSummary = 'A'.repeat(1000);
      const debt = new Debt(
        1,
        100,
        '12345678909',
        InadimplenciaStatus.INADIMPLENTE,
        5000,
        2,
        new Date('2025-11-15'),
        'SERASA',
        new Date('2025-12-24'),
        longSummary
      );

      expect(debt.summary).toBe(longSummary);
      expect(debt.summary?.length).toBe(1000);
    });
  });
});
